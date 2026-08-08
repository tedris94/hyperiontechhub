import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { fulfillPaidOrder } from '@/lib/lms/reviews'
import { getPayloadSingleton } from '@/lib/payload'
import { isPaystackConfigured, verifyTransaction } from '@/lib/paystack'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const user = await getCurrentUser(request)
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const reference = searchParams.get('reference')?.trim()
  if (!reference) {
    return NextResponse.json({ error: 'Reference is required' }, { status: 400 })
  }

  if (!isPaystackConfigured()) {
    return NextResponse.json({ error: 'Payments are not configured' }, { status: 503 })
  }

  try {
    const payload = await getPayloadSingleton()
    const orders = await payload.find({
      collection: 'orders',
      where: { reference: { equals: reference } },
      limit: 1,
      overrideAccess: true,
    })

    const order = orders.docs[0]
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (typeof order.student === 'number' ? order.student !== user.id : order.student?.id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (order.status === 'paid') {
      return NextResponse.json({ status: 'paid', reference })
    }

    const verified = await verifyTransaction(reference)
    if (verified.data.status !== 'success') {
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: { status: 'failed' },
        overrideAccess: true,
      })
      return NextResponse.json({ status: 'failed', reference })
    }

    await fulfillPaidOrder(payload, reference)
    return NextResponse.json({ status: 'paid', reference })
  } catch (e) {
    console.error('[paystack/verify GET]', e)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
