import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { canAuthorCourses } from '@/lib/lmsApi'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const user = await getCurrentUser(request)
  if (!user || !canAuthorCourses(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      courseId?: number
      lessonId?: number
      title?: string
      passingScore?: number
      questions?: Array<Record<string, unknown>>
    }

    if (!body.courseId || !body.title?.trim() || !body.questions?.length) {
      return NextResponse.json(
        { error: 'courseId, title, and questions are required' },
        { status: 400 },
      )
    }

    const payload = await getPayloadSingleton()
    const quiz = await payload.create({
      collection: 'quizzes',
      data: {
        course: body.courseId,
        lesson: body.lessonId,
        title: body.title.trim(),
        passingScore: body.passingScore ?? 70,
        questions: body.questions as never,
      },
      overrideAccess: true,
    })

    if (body.lessonId) {
      await payload.update({
        collection: 'lessons',
        id: body.lessonId,
        data: { quiz: quiz.id, type: 'quiz' },
        overrideAccess: true,
      })
    }

    return NextResponse.json(quiz, { status: 201 })
  } catch (e) {
    console.error('[instructor/quizzes POST]', e)
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 })
  }
}
