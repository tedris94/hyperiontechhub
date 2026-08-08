import { NextResponse } from 'next/server'
import { authorizeCapability } from '@/lib/dashboardAuth'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const auth = await authorizeCapability(request, 'settings.manage')
  if (!auth.ok) return auth.response

  try {
    const payload = await getPayloadSingleton()
    const doc = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    return NextResponse.json(
      {
        showDemoAccounts: doc.showDemoAccounts !== false,
      },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
  } catch (e) {
    console.error('[admin/site-settings GET]', e)
    return NextResponse.json({ error: 'Failed to load site settings' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const auth = await authorizeCapability(request, 'settings.manage')
  if (!auth.ok) return auth.response

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const data: Record<string, unknown> = {}
  if (typeof body.showDemoAccounts === 'boolean') {
    data.showDemoAccounts = body.showDemoAccounts
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid settings provided' }, { status: 400 })
  }

  try {
    const payload = await getPayloadSingleton()
    const updated = await payload.updateGlobal({
      slug: 'site-settings',
      data,
      overrideAccess: true,
    })
    return NextResponse.json({
      showDemoAccounts: updated.showDemoAccounts !== false,
    })
  } catch (e) {
    console.error('[admin/site-settings PUT]', e)
    return NextResponse.json({ error: 'Failed to save site settings' }, { status: 500 })
  }
}
