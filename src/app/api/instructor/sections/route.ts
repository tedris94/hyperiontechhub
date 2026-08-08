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
      title?: string
      order?: number
    }
    if (!body.courseId || !body.title?.trim()) {
      return NextResponse.json({ error: 'courseId and title are required' }, { status: 400 })
    }

    const payload = await getPayloadSingleton()
    const section = await payload.create({
      collection: 'course-sections',
      data: {
        course: body.courseId,
        title: body.title.trim(),
        order: body.order ?? 0,
      },
      overrideAccess: true,
    })

    return NextResponse.json(section, { status: 201 })
  } catch (e) {
    console.error('[instructor/sections POST]', e)
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 })
  }
}
