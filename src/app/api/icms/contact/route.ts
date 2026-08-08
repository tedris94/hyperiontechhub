import { NextRequest, NextResponse } from 'next/server'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { getTenantBySlug } from '@/lib/icms/tenants'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** Public contact form — creates an inbox message for the tenant. */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      tenantSlug?: string
      name?: string
      email?: string
      phone?: string
      subject?: string
      message?: string
    }
    const tenantSlug = (body.tenantSlug || '').trim()
    const name = (body.name || '').trim()
    const email = (body.email || '').trim().toLowerCase()
    const phone = (body.phone || '').trim()
    const subject = (body.subject || '').trim()
    const message = (body.message || '').trim()

    if (!tenantSlug || !name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, message, and tenant are required' },
        { status: 400 },
      )
    }

    const tenant = await getTenantBySlug(tenantSlug)
    if (!tenant) {
      return NextResponse.json({ error: 'Centre not found' }, { status: 404 })
    }

    if (!isPayloadEnabled() || typeof tenant.id === 'string') {
      // Showcase / offline — accept without persistence
      return NextResponse.json({ ok: true, stored: false })
    }

    const payload = await getPayloadSingleton()
    await payload.create({
      collection: 'icms-contact-messages',
      data: {
        tenant: tenant.id,
        name,
        email,
        phone,
        subject,
        message,
        status: 'new',
      },
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true, stored: true })
  } catch (e) {
    console.error('[icms/contact POST]', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to send message' },
      { status: 500 },
    )
  }
}
