import { NextResponse } from 'next/server'
import { getPayloadSingleton } from '@/lib/payload'
import { toCourseListItem } from '@/lib/lmsApi'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()
    const category = searchParams.get('category')?.trim()
    const level = searchParams.get('level')?.trim()
    const freeOnly = searchParams.get('free') === '1'

    const where: Record<string, unknown> = {
      status: { equals: 'published' },
    }

    if (q) {
      where.or = [
        { title: { contains: q } },
        { subtitle: { contains: q } },
      ]
    }
    if (category) {
      where['category.slug'] = { equals: category }
    }
    if (level) {
      where.level = { equals: level }
    }
    if (freeOnly) {
      where.isFree = { equals: true }
    }

    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'courses',
      where: where as never,
      sort: '-createdAt',
      limit: 100,
      depth: 2,
      overrideAccess: true,
    })

    return NextResponse.json(result.docs.map((doc) => toCourseListItem(doc as never)))
  } catch (e) {
    console.error('[courses GET]', e)
    return NextResponse.json({ error: 'Failed to load courses' }, { status: 500 })
  }
}
