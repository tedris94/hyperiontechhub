import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { canManageCategories, slugFromTitle } from '@/lib/lmsApi'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const user = await getCurrentUser(request)
  if (!user || !canManageCategories(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'course-categories',
      sort: 'name',
      limit: 100,
      overrideAccess: true,
    })
    return NextResponse.json(result.docs)
  } catch (e) {
    console.error('[admin/lms/categories GET]', e)
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser(request)
  if (!user || !canManageCategories(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as { name?: string; description?: string }
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const name = body.name.trim()
    const payload = await getPayloadSingleton()
    const created = await payload.create({
      collection: 'course-categories',
      data: {
        name,
        slug: slugFromTitle(name),
        description: body.description?.trim(),
      },
      overrideAccess: true,
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    console.error('[admin/lms/categories POST]', e)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
