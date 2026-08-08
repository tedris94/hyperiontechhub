import type { Payload } from 'payload'
import { relId } from './enrollment'
import { generateCertificateSerial } from './enrollment'

export async function getCourseLessons(payload: Payload, courseId: number) {
  const sections = await payload.find({
    collection: 'course-sections',
    where: { course: { equals: courseId } },
    sort: 'order',
    limit: 100,
    overrideAccess: true,
  })

  const lessonsResult = await payload.find({
    collection: 'lessons',
    where: { course: { equals: courseId } },
    limit: 500,
    overrideAccess: true,
  })

  const bySection = new Map<number, typeof lessonsResult.docs>()
  for (const lesson of lessonsResult.docs) {
    const sectionId = relId(lesson.section)
    if (sectionId == null) continue
    const list = bySection.get(sectionId) ?? []
    list.push(lesson)
    bySection.set(sectionId, list)
  }

  const ordered: typeof lessonsResult.docs = []
  for (const section of sections.docs) {
    const sectionLessons = (bySection.get(section.id) ?? []).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    )
    ordered.push(...sectionLessons)
  }

  // Lessons without a section fall back to the end, sorted by order.
  const sectionIds = new Set(sections.docs.map((s) => s.id))
  const orphans = lessonsResult.docs
    .filter((lesson) => {
      const sectionId = relId(lesson.section)
      return sectionId == null || !sectionIds.has(sectionId)
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  ordered.push(...orphans)

  return ordered
}

export async function getResumeLessonSlug(
  payload: Payload,
  enrollmentId: number,
  courseId: number,
): Promise<string | null> {
  const lessons = await getCourseLessons(payload, courseId)
  if (lessons.length === 0) return null

  const progress = await payload.find({
    collection: 'lesson-progress',
    where: { enrollment: { equals: enrollmentId } },
    limit: 500,
    overrideAccess: true,
  })

  const completedLessonIds = new Set(
    progress.docs
      .filter((p) => p.completed)
      .map((p) => relId(p.lesson))
      .filter((id): id is number => id != null),
  )

  const nextLesson = lessons.find((l) => !completedLessonIds.has(l.id)) ?? lessons[0]
  return nextLesson.slug ?? null
}

export async function recalculateEnrollmentProgress(
  payload: Payload,
  enrollmentId: number,
) {
  const enrollment = await payload.findByID({
    collection: 'enrollments',
    id: enrollmentId,
    depth: 0,
    overrideAccess: true,
  })

  const courseId = relId(enrollment.course)
  if (!courseId) return enrollment

  const lessons = await getCourseLessons(payload, courseId)
  const totalLessons = lessons.length
  if (totalLessons === 0) {
    return enrollment
  }

  const progressResult = await payload.find({
    collection: 'lesson-progress',
    where: {
      and: [
        { enrollment: { equals: enrollmentId } },
        { completed: { equals: true } },
      ],
    },
    limit: 500,
    overrideAccess: true,
  })

  const completedCount = progressResult.docs.length
  const progressPercent = Math.round((completedCount / totalLessons) * 100)

  const updates: Record<string, unknown> = { progressPercent }

  if (progressPercent >= 100 && enrollment.status !== 'completed') {
    updates.status = 'completed'
    updates.completedAt = new Date().toISOString()
  }

  const updated = await payload.update({
    collection: 'enrollments',
    id: enrollmentId,
    data: updates,
    overrideAccess: true,
  })

  if (progressPercent >= 100) {
    await issueCertificateIfNeeded(payload, enrollmentId)
  }

  return updated
}

export async function upsertLessonProgress(
  payload: Payload,
  params: {
    enrollmentId: number
    lessonId: number
    studentId: number
    completed?: boolean
    lastPositionSeconds?: number
  },
) {
  const existing = await payload.find({
    collection: 'lesson-progress',
    where: {
      and: [
        { enrollment: { equals: params.enrollmentId } },
        { lesson: { equals: params.lessonId } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  })

  const data = {
    enrollment: params.enrollmentId,
    lesson: params.lessonId,
    student: params.studentId,
    completed: params.completed ?? false,
    lastPositionSeconds: params.lastPositionSeconds ?? 0,
    completedAt: params.completed ? new Date().toISOString() : undefined,
  }

  if (existing.docs[0]) {
    return payload.update({
      collection: 'lesson-progress',
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'lesson-progress',
    data,
    overrideAccess: true,
  })
}

async function issueCertificateIfNeeded(payload: Payload, enrollmentId: number) {
  const existing = await payload.find({
    collection: 'certificates',
    where: { enrollment: { equals: enrollmentId } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]) return existing.docs[0]

  const enrollment = await payload.findByID({
    collection: 'enrollments',
    id: enrollmentId,
    depth: 0,
    overrideAccess: true,
  })

  const studentId = relId(enrollment.student)
  const courseId = relId(enrollment.course)
  if (!studentId || !courseId) return null

  return payload.create({
    collection: 'certificates',
    data: {
      enrollment: enrollmentId,
      student: studentId,
      course: courseId,
      serial: generateCertificateSerial(),
      issuedAt: new Date().toISOString(),
    },
    overrideAccess: true,
  })
}

export { issueCertificateIfNeeded }
