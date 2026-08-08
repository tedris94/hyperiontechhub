import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { findEnrollment } from '@/lib/lms/enrollment'
import { recalculateEnrollmentProgress } from '@/lib/lms/progress'
import { gradeQuizWithPassing } from '@/lib/lms/quiz'
import type { QuizAnswerInput } from '@/lib/lms/quiz'
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
      quizId?: number
      courseId?: number
      answers?: QuizAnswerInput
    }

    if (!body.quizId || !body.answers) {
      return NextResponse.json({ error: 'quizId and answers are required' }, { status: 400 })
    }

    const payload = await getPayloadSingleton()
    const quiz = await payload.findByID({
      collection: 'quizzes',
      id: body.quizId,
      overrideAccess: true,
    })

    const courseId =
      body.courseId ??
      (typeof quiz.course === 'number' ? quiz.course : quiz.course?.id)
    if (!courseId) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const enrollment = await findEnrollment(payload, user.id, courseId)
    if (!enrollment) {
      return NextResponse.json({ error: 'Not enrolled' }, { status: 403 })
    }

    const graded = gradeQuizWithPassing(
      quiz.questions ?? [],
      body.answers,
      quiz.passingScore ?? 70,
    )

    const attempt = await payload.create({
      collection: 'quiz-attempts',
      data: {
        student: user.id,
        quiz: body.quizId,
        enrollment: enrollment.id,
        answers: body.answers,
        score: graded.score,
        passed: graded.passed,
        attemptedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    if (graded.passed && quiz.lesson) {
      const lessonId = typeof quiz.lesson === 'number' ? quiz.lesson : quiz.lesson.id
      const { upsertLessonProgress } = await import('@/lib/lms/progress')
      await upsertLessonProgress(payload, {
        enrollmentId: enrollment.id,
        lessonId,
        studentId: user.id,
        completed: true,
      })
      await recalculateEnrollmentProgress(payload, enrollment.id)
    }

    return NextResponse.json({
      attemptId: attempt.id,
      score: graded.score,
      passed: graded.passed,
      results: graded.results,
    })
  } catch (e) {
    console.error('[lms/quiz/attempt POST]', e)
    return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 })
  }
}
