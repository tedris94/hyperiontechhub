import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { isPlatformAdmin } from '@/collections/edusuite/shared'
import { resolveTenantAccess } from '@/lib/edusuite/tenant'
import { initializeTransaction, isPaystackConfigured, verifyTransaction } from '@/lib/paystack'

export async function POST(req: NextRequest) {
  if (!isPayloadEnabled()) return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  if (!isPaystackConfigured()) {
    return NextResponse.json(
      { error: 'Paystack not configured. Set PAYSTACK_SECRET_KEY to enable fee payments.' },
      { status: 503 },
    )
  }

  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const schoolSlug = String(body.schoolSlug || '')
  const invoiceId = body.invoiceId
  const email = String(body.email || user.email || '')
  const access = await resolveTenantAccess(user, schoolSlug)
  if (!access) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const payload = await getPayloadSingleton()
  const invoice = await payload.findByID({
    collection: 'edu-invoices',
    id: invoiceId,
    depth: 0,
    user,
    overrideAccess: isPlatformAdmin(user),
  })
  if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

  const invSchool = (invoice as { school?: unknown }).school
  if (String(invSchool) !== String(access.school.id)) {
    return NextResponse.json({ error: 'Invoice not found for school' }, { status: 404 })
  }

  const amount = Number((invoice as { amount?: number }).amount || 0)
  const paid = Number((invoice as { amountPaid?: number }).amountPaid || 0)
  const outstanding = Math.max(amount - paid, 0)
  if (outstanding <= 0) {
    return NextResponse.json({ error: 'Invoice already paid' }, { status: 400 })
  }

  const reference = `edu_${access.school.slug}_${invoiceId}_${Date.now()}`
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const init = await initializeTransaction({
    email,
    amount: Math.round(outstanding * 100),
    reference,
    callbackUrl: `${site}/edusuite/${schoolSlug}/invoices?paid=1`,
    metadata: {
      type: 'edusuite_fee',
      schoolSlug,
      invoiceId: String(invoiceId),
    },
  })

  await payload.update({
    collection: 'edu-invoices',
    id: invoiceId,
    data: { paystackReference: reference },
    user,
    overrideAccess: isPlatformAdmin(user),
  })

  return NextResponse.json({ authorization_url: init.data.authorization_url, reference })
}

export async function PUT(req: NextRequest) {
  if (!isPayloadEnabled()) return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  if (!isPaystackConfigured()) {
    return NextResponse.json({ error: 'Paystack not configured' }, { status: 503 })
  }
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const reference = String(body.reference || '')
  const schoolSlug = String(body.schoolSlug || '')
  const access = await resolveTenantAccess(user, schoolSlug)
  if (!access) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const verified = await verifyTransaction(reference)
  if (!verified.status || verified.data.status !== 'success') {
    return NextResponse.json({ error: 'Payment not successful' }, { status: 400 })
  }

  const payload = await getPayloadSingleton()
  const found = await payload.find({
    collection: 'edu-invoices',
    where: {
      and: [
        { school: { equals: access.school.id } },
        { paystackReference: { equals: reference } },
      ],
    },
    limit: 1,
  })
  const invoice = found.docs[0]
  if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

  const amountNaira = Math.round(Number(verified.data.amount) / 100)
  await payload.update({
    collection: 'edu-invoices',
    id: invoice.id,
    data: {
      amountPaid: amountNaira,
      status: 'paid',
    },
    user,
    overrideAccess: isPlatformAdmin(user),
  })

  return NextResponse.json({ ok: true })
}
