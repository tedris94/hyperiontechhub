import crypto from 'crypto'
import type { Payload } from 'payload'

export function relId(value: unknown): number | null {
  if (value == null) return null
  if (typeof value === 'number') return value
  if (typeof value === 'object' && value !== null && 'id' in value) {
    const id = (value as { id: unknown }).id
    return typeof id === 'number' ? id : null
  }
  return null
}

export function generateCertificateSerial(): string {
  const year = new Date().getFullYear()
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase()
  return `HTH-${year}-${rand}`
}

export async function findEnrollment(
  payload: Payload,
  studentId: number,
  courseId: number,
) {
  const result = await payload.find({
    collection: 'enrollments',
    where: {
      and: [
        { student: { equals: studentId } },
        { course: { equals: courseId } },
        { status: { not_equals: 'cancelled' } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  })
  return result.docs[0] ?? null
}

export async function createEnrollment(
  payload: Payload,
  params: {
    studentId: number
    courseId: number
    source: 'free' | 'paid' | 'manual'
  },
) {
  const existing = await findEnrollment(payload, params.studentId, params.courseId)
  if (existing) return existing

  const enrollment = await payload.create({
    collection: 'enrollments',
    data: {
      student: params.studentId,
      course: params.courseId,
      status: 'active',
      enrolledAt: new Date().toISOString(),
      progressPercent: 0,
      source: params.source,
    },
    overrideAccess: true,
  })

  const course = await payload.findByID({
    collection: 'courses',
    id: params.courseId,
    overrideAccess: true,
  })

  await payload.update({
    collection: 'courses',
    id: params.courseId,
    data: {
      enrollmentCount: (course.enrollmentCount ?? 0) + 1,
    },
    overrideAccess: true,
  })

  return enrollment
}

export async function isEnrolled(
  payload: Payload,
  studentId: number,
  courseId: number,
): Promise<boolean> {
  const enrollment = await findEnrollment(payload, studentId, courseId)
  return Boolean(enrollment)
}

export async function canAccessLesson(
  payload: Payload,
  userId: number | null,
  lesson: { isPreview?: boolean | null; course?: unknown },
): Promise<boolean> {
  if (lesson.isPreview) return true
  if (!userId) return false
  const courseId = relId(lesson.course)
  if (!courseId) return false
  return isEnrolled(payload, userId, courseId)
}
