import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { canAccessLesson, findEnrollment, relId } from '@/lib/lms/enrollment'
import { getCourseLessons } from '@/lib/lms/progress'
import { getPayloadSingleton } from '@/lib/payload'
import { toCourseDetail, toLessonSummary, toSectionResponse } from '@/lib/lmsApi'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Props = { params: Promise<{ courseSlug: string; lessonSlug: string }> }

export async function GET(request: Request, { params }: Props) {
  try {
    const { courseSlug, lessonSlug } = await params
    const user = await getCurrentUser(request)
    const payload = await getPayloadSingleton()

    const courses = await payload.find({
      collection: 'courses',
      where: { slug: { equals: courseSlug }, status: { equals: 'published' } },
      limit: 1,
      depth: 2,
      overrideAccess: true,
    })
    const course = courses.docs[0]
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const lessons = await payload.find({
      collection: 'lessons',
      where: {
        and: [
          { course: { equals: course.id } },
          { slug: { equals: lessonSlug } },
        ],
      },
      limit: 1,
      depth: 2,
      overrideAccess: true,
    })
    const lesson = lessons.docs[0]
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const canAccess = await canAccessLesson(payload, user?.id ?? null, lesson)
    if (!canAccess) {
      return NextResponse.json({ error: 'Enrollment required' }, { status: 403 })
    }

    let enrollment = null
    let progress = null
    let quiz = null
    const completedLessonIds = new Set<number>()

    if (user?.id) {
      enrollment = await findEnrollment(payload, user.id, course.id)
      if (enrollment) {
        const prog = await payload.find({
          collection: 'lesson-progress',
          where: {
            and: [
              { enrollment: { equals: enrollment.id } },
              { lesson: { equals: lesson.id } },
            ],
          },
          limit: 1,
          overrideAccess: true,
        })
        progress = prog.docs[0] ?? null

        const allProgress = await payload.find({
          collection: 'lesson-progress',
          where: {
            and: [
              { enrollment: { equals: enrollment.id } },
              { completed: { equals: true } },
            ],
          },
          limit: 500,
          overrideAccess: true,
        })
        for (const p of allProgress.docs) {
          const lid = relId(p.lesson)
          if (lid != null) completedLessonIds.add(lid)
        }
      }
    }

    if (lesson.type === 'quiz' && lesson.quiz) {
      const quizId = relId(lesson.quiz)
      if (quizId) {
        const quizDoc = await payload.findByID({
          collection: 'quizzes',
          id: quizId,
          overrideAccess: true,
        })
        quiz = {
          id: quizDoc.id,
          title: quizDoc.title,
          passingScore: quizDoc.passingScore,
          questions: (quizDoc.questions ?? []).map((q, index) => ({
            index,
            prompt: q.prompt,
            type: q.type,
            options: (q.options ?? []).map((o, i) => ({ index: i, text: o.text })),
            points: q.points,
          })),
        }
      }
    }

    const sectionsResult = await payload.find({
      collection: 'course-sections',
      where: { course: { equals: course.id } },
      sort: 'order',
      limit: 100,
      overrideAccess: true,
    })

    const orderedLessons = await getCourseLessons(payload, course.id)

    const curriculum = sectionsResult.docs.map((section) => {
      const sectionLessons = orderedLessons
        .filter((l) => relId(l.section) === section.id)
        .map((l) => ({
          ...toLessonSummary(l as never),
          completed: completedLessonIds.has(l.id),
        }))
      return {
        ...toSectionResponse(section as never, []),
        lessons: sectionLessons,
      }
    })

    const lessonOrder = orderedLessons.map((l) => ({
      slug: l.slug,
      title: l.title,
      id: l.id,
      completed: completedLessonIds.has(l.id),
    }))

    return NextResponse.json({
      course: toCourseDetail(course as never),
      lesson: {
        ...toLessonSummary(lesson as never),
        content: lesson.content ?? null,
        bunnyVideoId: lesson.bunnyVideoId ?? null,
        attachments: (lesson.attachments ?? []).map((a) => ({
          label: a.label,
          url:
            typeof a.file === 'object' && a.file && 'url' in a.file
              ? (a.file.url as string)
              : null,
        })),
        completed: completedLessonIds.has(lesson.id),
      },
      curriculum,
      lessonOrder,
      enrollment: enrollment
        ? {
            id: enrollment.id,
            progressPercent: enrollment.progressPercent,
            status: enrollment.status,
          }
        : null,
      progress: progress
        ? {
            completed: progress.completed,
            lastPositionSeconds: progress.lastPositionSeconds,
          }
        : null,
      quiz,
    })
  } catch (e) {
    console.error('[learn GET]', e)
    return NextResponse.json({ error: 'Failed to load lesson' }, { status: 500 })
  }
}
