import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { canAuthorCourses, slugFromTitle, toCourseDetail } from '@/lib/lmsApi'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const user = await getCurrentUser(request)
  if (!user || !canAuthorCourses(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayloadSingleton()
    const isAdmin = user.role === 'super_admin' || user.role === 'admin'
    const result = await payload.find({
      collection: 'courses',
      where: isAdmin ? {} : { instructor: { equals: user.id } },
      sort: '-updatedAt',
      limit: 200,
      depth: 2,
      overrideAccess: true,
    })

    return NextResponse.json(result.docs.map((doc) => toCourseDetail(doc as never)))
  } catch (e) {
    console.error('[instructor/courses GET]', e)
    return NextResponse.json({ error: 'Failed to load courses' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser(request)
  if (!user?.id || !canAuthorCourses(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      title?: string
      subtitle?: string
      level?: string
      isFree?: boolean
      price?: number
    }
    const title = body.title?.trim()
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const payload = await getPayloadSingleton()
    const created = await payload.create({
      collection: 'courses',
      data: {
        title,
        slug: slugFromTitle(title),
        subtitle: body.subtitle?.trim(),
        instructor: user.id,
        level: (body.level as 'beginner' | 'intermediate' | 'advanced' | 'all') ?? 'all',
        isFree: body.isFree ?? true,
        price: body.isFree ? 0 : (body.price ?? 0),
        currency: 'NGN',
        status: 'draft',
      },
      overrideAccess: true,
    })

    return NextResponse.json(toCourseDetail(created as never), { status: 201 })
  } catch (e) {
    console.error('[instructor/courses POST]', e)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
