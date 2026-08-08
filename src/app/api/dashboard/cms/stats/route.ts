import { NextResponse } from 'next/server'
import { authorizeCapability } from '@/lib/dashboardAuth'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const auth = await authorizeCapability(request, 'cms.view')
  if (!auth.ok) return auth.response

  try {
    const payload = await getPayloadSingleton()
    const [pagesRes, mediaRes] = await Promise.all([
      payload.find({ collection: 'pages', limit: 1000, depth: 0, sort: '-updatedAt', overrideAccess: true }),
      payload.find({ collection: 'media', limit: 1, depth: 0, overrideAccess: true }),
    ])

    const pages = pagesRes.docs as Array<{
      id: number | string
      title: string
      slug: string
      status?: string
      metaTitle?: string | null
      metaDescription?: string | null
      updatedAt: string
    }>

    const publishedPages = pages.filter((p) => p.status === 'published').length
    let seoScore = 0
    if (pages.length > 0) {
      const points = pages.reduce((sum, p) => {
        let s = 0
        if (p.metaTitle?.trim()) s += 1
        if (p.metaDescription?.trim()) s += 1
        return sum + s / 2
      }, 0)
      seoScore = Math.round((points / pages.length) * 100)
    }

    return NextResponse.json({
      totalPages: pagesRes.totalDocs,
      publishedPages,
      mediaCount: mediaRes.totalDocs,
      seoScore,
      homeViews: 0,
      recentPages: pages.slice(0, 6).map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        status: p.status ?? 'draft',
        updatedAt: p.updatedAt,
        views: 0,
      })),
    })
  } catch (e) {
    console.error('[dashboard/cms/stats GET]', e)
    return NextResponse.json({ error: 'Failed to load CMS stats' }, { status: 500 })
  }
}
