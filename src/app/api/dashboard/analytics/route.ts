import { NextResponse } from 'next/server'
import { authorizeAnyCapability } from '@/lib/dashboardAuth'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const auth = await authorizeAnyCapability(request, ['analytics.view', 'dashboard.home'])
  if (!auth.ok) return auth.response

  try {
    const payload = await getPayloadSingleton()
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const [total, recent] = await Promise.all([
      payload.find({ collection: 'analytics-events', where: { type: { equals: 'pageview' } }, limit: 0, overrideAccess: true }),
      payload.find({
        collection: 'analytics-events',
        where: { and: [{ type: { equals: 'pageview' } }, { createdAt: { greater_than: since } }] },
        limit: 10000,
        overrideAccess: true,
      }),
    ])

    const visitors = new Set(
      recent.docs.map((d) => (d as { visitorId?: string }).visitorId).filter(Boolean),
    )

    return NextResponse.json({
      totalViews: total.totalDocs,
      last24hViews: recent.totalDocs,
      last24hVisitors: visitors.size,
    })
  } catch (e) {
    console.error('[dashboard/analytics]', e)
    return NextResponse.json({ totalViews: 0, last24hViews: 0, last24hVisitors: 0 })
  }
}
