import { NextResponse } from 'next/server'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { generateOrderReference, initializeTransaction, verifyTransaction } from '@/lib/paystack'
import { getTenantBySlug, getTenantPaystackSecret } from '@/lib/icms/tenants'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const FREQUENCIES = new Set(['One-Off', 'Monthly', 'Quarterly', 'Yearly'])

function isValidPurpose(purpose: string) {
  return purpose.length > 0 && purpose.length <= 80
}

type DonateBody = {
  tenantSlug?: string
  amount?: number
  purpose?: string
  frequency?: string
  anonymous?: boolean
  donorName?: string
  donorPhone?: string
  donorEmail?: string
}

function siteBase() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DonateBody
    const tenantSlug = (body.tenantSlug || '').trim()
    const amountNaira = Number(body.amount)
    const purpose = (body.purpose || '').trim()
    const frequency = (body.frequency || 'One-Off').trim()
    const anonymous = Boolean(body.anonymous)
    const donorName = (body.donorName || '').trim()
    const donorPhone = (body.donorPhone || '').trim()
    const donorEmail = (body.donorEmail || '').trim().toLowerCase()

    if (!tenantSlug) {
      return NextResponse.json({ error: 'Tenant is required' }, { status: 400 })
    }
    if (!Number.isFinite(amountNaira) || amountNaira < 100) {
      return NextResponse.json({ error: 'Minimum donation is ₦100' }, { status: 400 })
    }
    if (!isValidPurpose(purpose)) {
      return NextResponse.json({ error: 'Invalid donation purpose' }, { status: 400 })
    }
    if (!FREQUENCIES.has(frequency)) {
      return NextResponse.json({ error: 'Invalid frequency' }, { status: 400 })
    }

    const tenant = await getTenantBySlug(tenantSlug)
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const secretKey = getTenantPaystackSecret(tenant)
    if (!secretKey) {
      return NextResponse.json(
        {
          error:
            'Paystack is not configured for this centre. Add the tenant secret key under Admin → Settings.',
        },
        { status: 503 },
      )
    }

    const email =
      anonymous || !donorEmail
        ? tenant.email || `donate+${tenantSlug}@hyperionicms.com`
        : donorEmail

    if (!anonymous && !donorEmail) {
      return NextResponse.json(
        { error: 'Email is required for card payments (or donate anonymously).' },
        { status: 400 },
      )
    }

    const reference = `icms_${tenantSlug}_${generateOrderReference()}`
    const callbackUrl = `${siteBase()}/icms/${tenantSlug}/donate?payment=verify&reference=${encodeURIComponent(reference)}`

    if (isPayloadEnabled() && typeof tenant.id !== 'string') {
      const payload = await getPayloadSingleton()
      await payload.create({
        collection: 'icms-donations',
        data: {
          tenant: tenant.id,
          reference,
          donor: anonymous ? 'Anonymous' : donorName || 'Donor',
          amount: amountNaira,
          fund: purpose,
          status: 'Pending',
          donatedAt: new Date().toISOString(),
        },
        overrideAccess: true,
      })
    }

    const init = await initializeTransaction({
      email,
      amount: Math.round(amountNaira * 100),
      reference,
      callbackUrl,
      secretKey,
      metadata: {
        type: 'icms_donation',
        tenantSlug,
        purpose,
        frequency,
        anonymous,
        donorName: anonymous ? 'Anonymous' : donorName,
        donorPhone: anonymous ? '' : donorPhone,
      },
    })

    return NextResponse.json({
      authorizationUrl: init.data.authorization_url,
      reference: init.data.reference,
    })
  } catch (e) {
    console.error('[icms/donate/paystack POST]', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to start payment' },
      { status: 500 },
    )
  }
}

/** Verify Paystack payment after redirect and mark donation Completed */
export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { reference?: string; tenantSlug?: string }
    const reference = (body.reference || '').trim()
    const tenantSlug = (body.tenantSlug || '').trim()
    if (!reference) {
      return NextResponse.json({ error: 'Reference is required' }, { status: 400 })
    }

    let secretKey: string | null = null
    if (tenantSlug) {
      const tenant = await getTenantBySlug(tenantSlug)
      secretKey = getTenantPaystackSecret(tenant)
    }
    if (!secretKey && reference.startsWith('icms_')) {
      const slugFromRef = reference.split('_')[1]
      if (slugFromRef) {
        const tenant = await getTenantBySlug(slugFromRef)
        secretKey = getTenantPaystackSecret(tenant)
      }
    }
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Paystack is not configured for this centre.' },
        { status: 503 },
      )
    }

    const verified = await verifyTransaction(reference, secretKey)
    if (verified.data.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment not successful', status: verified.data.status },
        { status: 400 },
      )
    }

    if (isPayloadEnabled()) {
      const payload = await getPayloadSingleton()
      const found = await payload.find({
        collection: 'icms-donations',
        where: { reference: { equals: reference } },
        limit: 1,
        overrideAccess: true,
      })
      const doc = found.docs[0]
      if (doc) {
        await payload.update({
          collection: 'icms-donations',
          id: doc.id,
          data: { status: 'Completed' },
          overrideAccess: true,
        })
      }
    }

    return NextResponse.json({
      ok: true,
      amount: verified.data.amount / 100,
      reference: verified.data.reference,
    })
  } catch (e) {
    console.error('[icms/donate/paystack PUT]', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Verification failed' },
      { status: 500 },
    )
  }
}
