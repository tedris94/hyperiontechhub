import { NextResponse } from 'next/server'
import { getCurrentUser, isAdminRole } from '@/lib/auth'
import { getPayloadSingleton } from '@/lib/payload'
import { mediaIdForPayload, toPortfolioAdminResponse } from '@/lib/portfolioAdminApi'
import fallbackCases from '@/content/portfolio-cases.json'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type PortfolioPayload = {
  title?: string
  slug?: string
  client?: string
  industry?: string
  category?: string
  summary?: string
  challenge?: string
  solution?: string
  results?: string[]
  technologies?: string[]
  projectUrl?: string
  logoPath?: string
  previewImagePath?: string
  brandColors?: string[]
  featured?: boolean
  sortOrder?: number
  logoId?: number | string | null
  featuredImageId?: number | string | null
  seedFromFallback?: boolean
}

function buildData(body: PortfolioPayload) {
  const logo = mediaIdForPayload(body.logoId)
  const featuredImage = mediaIdForPayload(body.featuredImageId)
  const normalizedIndustry =
    body.industry?.trim() === 'schools' ||
    body.industry?.trim() === 'mosques' ||
    body.industry?.trim() === 'smes' ||
    body.industry?.trim() === 'other'
      ? (body.industry.trim() as 'schools' | 'mosques' | 'smes' | 'other')
      : 'other'

  return {
    title: body.title?.trim() || '',
    slug: body.slug?.trim() || '',
    client: body.client?.trim() || '',
    industry: normalizedIndustry,
    category: body.category?.trim() || undefined,
    summary: body.summary?.trim() || undefined,
    challenge: body.challenge?.trim() || undefined,
    solution: body.solution?.trim() || undefined,
    results: (body.results || []).filter(Boolean).map((item) => ({ item })),
    technologies: (body.technologies || []).filter(Boolean).map((name) => ({ name })),
    projectUrl: body.projectUrl?.trim() || undefined,
    logoPath: body.logoPath?.trim() || undefined,
    previewImagePath: body.previewImagePath?.trim() || undefined,
    brandColors: (body.brandColors || []).filter(Boolean).map((color) => ({ color })),
    featured: Boolean(body.featured),
    sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0,
    ...(logo !== undefined ? { logo } : {}),
    ...(featuredImage !== undefined ? { featuredImage } : {}),
  }
}

export async function GET(request: Request) {
  const user = await getCurrentUser(request)
  if (!isAdminRole(user?.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'portfolio-items',
      limit: 200,
      sort: 'sortOrder',
      depth: 1,
      overrideAccess: true,
    })
    return NextResponse.json(
      {
        items: result.docs.map((d) => toPortfolioAdminResponse(d as unknown as Record<string, unknown>)),
        fallbackCount: fallbackCases.length,
      },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
  } catch (e) {
    console.error('[admin/portfolio GET]', e)
    return NextResponse.json({ error: 'Failed to load portfolio items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser(request)
  if (!isAdminRole(user?.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = (await request.json()) as PortfolioPayload
    const payload = await getPayloadSingleton()

    if (body.seedFromFallback) {
      const existing = await payload.find({
        collection: 'portfolio-items',
        limit: 200,
        depth: 0,
        overrideAccess: true,
      })
      const existingSlugs = new Set(existing.docs.map((d) => String((d as { slug?: string }).slug || '')))
      const created = []
      for (const c of fallbackCases) {
        if (existingSlugs.has(c.slug)) continue
        const doc = await payload.create({
          collection: 'portfolio-items',
          data: {
            title: c.title,
            slug: c.slug,
            client: c.client,
            industry: (c.industry === 'schools' || c.industry === 'mosques' || c.industry === 'smes' || c.industry === 'other'
              ? c.industry
              : 'other') as 'schools' | 'mosques' | 'smes' | 'other',
            category: c.category,
            summary: c.summary,
            challenge: c.challenge,
            solution: c.solution,
            results: c.results.map((item) => ({ item })),
            technologies: c.technologies.map((name) => ({ name })),
            projectUrl: c.projectUrl,
            logoPath: c.logo,
            previewImagePath: c.previewImage,
            brandColors: (c.brandColors || []).map((color) => ({ color })),
            featured: c.featured,
            sortOrder: c.sortOrder,
          },
          overrideAccess: true,
        })
        created.push(doc.id)
      }
      return NextResponse.json({ seeded: created.length }, { status: 201 })
    }

    const title = body.title?.trim()
    const slug = body.slug?.trim()
    const client = body.client?.trim()
    if (!title || !slug || !client) {
      return NextResponse.json({ error: 'Title, slug, and client are required.' }, { status: 400 })
    }

    const created = await payload.create({
      collection: 'portfolio-items',
      data: buildData(body) as any,
      overrideAccess: true,
    })
    const withDepth = await payload.findByID({
      collection: 'portfolio-items',
      id: created.id,
      depth: 1,
      overrideAccess: true,
    })
    return NextResponse.json(toPortfolioAdminResponse(withDepth as unknown as Record<string, unknown>), {
      status: 201,
    })
  } catch (e) {
    console.error('[admin/portfolio POST]', e)
    return NextResponse.json({ error: 'Failed to create portfolio item' }, { status: 500 })
  }
}
