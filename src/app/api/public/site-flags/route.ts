import { NextResponse } from 'next/server'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** Public flags used by unauthenticated pages (e.g. login). */
export async function GET() {
  try {
    if (!isPayloadEnabled()) {
      return NextResponse.json(
        { showDemoAccounts: true },
        { headers: { 'Cache-Control': 'public, max-age=30' } },
      )
    }

    const payload = await getPayloadSingleton()
    const doc = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    return NextResponse.json(
      { showDemoAccounts: doc.showDemoAccounts !== false },
      { headers: { 'Cache-Control': 'public, max-age=30' } },
    )
  } catch (e) {
    console.error('[public/site-flags GET]', e)
    // Fail closed: hide demo accounts if settings cannot be loaded (safer for production).
    return NextResponse.json(
      { showDemoAccounts: false },
      { headers: { 'Cache-Control': 'public, max-age=10' } },
    )
  }
}
