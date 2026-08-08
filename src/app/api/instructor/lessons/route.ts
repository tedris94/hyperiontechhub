import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { canAuthorCourses, slugFromTitle } from '@/lib/lmsApi'
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
      sectionId?: number
      title?: string
      type?: string
      order?: number
      isPreview?: boolean
    }

    if (!body.courseId || !body.sectionId || !body.title?.trim()) {
      return NextResponse.json(
        { error: 'courseId, sectionId, and title are required' },
        { status: 400 },
      )
    }

    const payload = await getPayloadSingleton()
    const lesson = await payload.create({
      collection: 'lessons',
      data: {
        course: body.courseId,
        section: body.sectionId,
        title: body.title.trim(),
        slug: slugFromTitle(body.title),
        type: (body.type as 'video' | 'article' | 'quiz' | 'resource') ?? 'video',
        order: body.order ?? 0,
        isPreview: body.isPreview ?? false,
      },
      overrideAccess: true,
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (e) {
    console.error('[instructor/lessons POST]', e)
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 })
  }
}
