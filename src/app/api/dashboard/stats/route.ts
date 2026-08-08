import { NextResponse } from 'next/server'
import { authorizeAnyCapability } from '@/lib/dashboardAuth'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const auth = await authorizeAnyCapability(request, ['dashboard.home', 'analytics.view'])
  if (!auth.ok) return auth.response

  try {
    const payload = await getPayloadSingleton()
    const siteSettings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })

    const usersCount = await payload.find({ collection: 'users', limit: 0, overrideAccess: true })

    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString()
    const sessions = await payload.find({
      collection: 'analytics-events',
      where: { and: [{ type: { equals: 'session' } }, { createdAt: { greater_than: since } }] },
      limit: 0,
      overrideAccess: true,
    })

    return NextResponse.json({
      usersCount: usersCount.totalDocs,
      activeSessions: sessions.totalDocs,
      revenueTotal: siteSettings?.revenueTotal ?? 0,
    })
  } catch (e) {
    console.error('[dashboard/stats]', e)
    return NextResponse.json({ usersCount: 0, activeSessions: 0, revenueTotal: 0 })
  }
}
