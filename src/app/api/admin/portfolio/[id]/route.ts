import { NextResponse } from 'next/server'
import { getCurrentUser, isAdminRole } from '@/lib/auth'
import { getPayloadSingleton } from '@/lib/payload'
import { mediaIdForPayload, toPortfolioAdminResponse } from '@/lib/portfolioAdminApi'

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
}

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, ctx: Ctx) {
  const user = await getCurrentUser(request)
  if (!isAdminRole(user?.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await ctx.params
  try {
    const body = (await request.json()) as PortfolioPayload
    const payload = await getPayloadSingleton()
    const logo = mediaIdForPayload(body.logoId)
    const featuredImage = mediaIdForPayload(body.featuredImageId)

    const data: Record<string, unknown> = {}
    if (body.title !== undefined) data.title = body.title.trim()
    if (body.slug !== undefined) data.slug = body.slug.trim()
    if (body.client !== undefined) data.client = body.client.trim()
    if (body.industry !== undefined) data.industry = body.industry.trim()
    if (body.category !== undefined) data.category = body.category.trim()
    if (body.summary !== undefined) data.summary = body.summary.trim()
    if (body.challenge !== undefined) data.challenge = body.challenge.trim()
    if (body.solution !== undefined) data.solution = body.solution.trim()
    if (body.results !== undefined) {
      data.results = body.results.filter(Boolean).map((item) => ({ item }))
    }
    if (body.technologies !== undefined) {
      data.technologies = body.technologies.filter(Boolean).map((name) => ({ name }))
    }
    if (body.projectUrl !== undefined) data.projectUrl = body.projectUrl.trim()
    if (body.logoPath !== undefined) data.logoPath = body.logoPath.trim()
    if (body.previewImagePath !== undefined) data.previewImagePath = body.previewImagePath.trim()
    if (body.brandColors !== undefined) {
      data.brandColors = body.brandColors.filter(Boolean).map((color) => ({ color }))
    }
    if (body.featured !== undefined) data.featured = Boolean(body.featured)
    if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder) || 0
    if (logo !== undefined) data.logo = logo
    if (featuredImage !== undefined) data.featuredImage = featuredImage

    await payload.update({
      collection: 'portfolio-items',
      id,
      data,
      overrideAccess: true,
    })
    const withDepth = await payload.findByID({
      collection: 'portfolio-items',
      id,
      depth: 1,
      overrideAccess: true,
    })
    return NextResponse.json(toPortfolioAdminResponse(withDepth as unknown as Record<string, unknown>))
  } catch (e) {
    console.error('[admin/portfolio PATCH]', e)
    return NextResponse.json({ error: 'Failed to update portfolio item' }, { status: 500 })
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  const user = await getCurrentUser(request)
  if (!isAdminRole(user?.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await ctx.params
  try {
    const payload = await getPayloadSingleton()
    await payload.delete({
      collection: 'portfolio-items',
      id,
      overrideAccess: true,
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[admin/portfolio DELETE]', e)
    return NextResponse.json({ error: 'Failed to delete portfolio item' }, { status: 500 })
  }
}
