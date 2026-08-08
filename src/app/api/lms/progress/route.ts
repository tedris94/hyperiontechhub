import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { findEnrollment } from '@/lib/lms/enrollment'
import { recalculateEnrollmentProgress, upsertLessonProgress } from '@/lib/lms/progress'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const user = await getCurrentUser(request)
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      lessonId?: number
      courseId?: number
      completed?: boolean
      lastPositionSeconds?: number
    }

    if (!body.lessonId) {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 })
    }

    const payload = await getPayloadSingleton()
    const lesson = await payload.findByID({
      collection: 'lessons',
      id: body.lessonId,
      depth: 0,
      overrideAccess: true,
    })

    const courseId =
      body.courseId ??
      (typeof lesson.course === 'number' ? lesson.course : lesson.course?.id)
    if (!courseId) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const enrollment = await findEnrollment(payload, user.id, courseId)
    if (!enrollment) {
      return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 })
    }

    await upsertLessonProgress(payload, {
      enrollmentId: enrollment.id,
      lessonId: body.lessonId,
      studentId: user.id,
      completed: body.completed,
      lastPositionSeconds: body.lastPositionSeconds,
    })

    const updated = await recalculateEnrollmentProgress(payload, enrollment.id)

    return NextResponse.json({
      progressPercent: updated.progressPercent,
      status: updated.status,
    })
  } catch (e) {
    console.error('[lms/progress POST]', e)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
