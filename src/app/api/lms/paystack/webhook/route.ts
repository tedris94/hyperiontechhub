import { NextResponse } from 'next/server'
import { fulfillPaidOrder } from '@/lib/lms/reviews'
import { verifyPaystackWebhookSignature } from '@/lib/paystack'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    if (!verifyPaystackWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody) as {
      event?: string
      data?: { reference?: string; status?: string }
    }

    if (event.event === 'charge.success' && event.data?.reference) {
      const { getPayloadSingleton } = await import('@/lib/payload')
      const payload = await getPayloadSingleton()
      await fulfillPaidOrder(payload, event.data.reference)
    }

    return NextResponse.json({ received: true })
  } catch (e) {
    console.error('[paystack/webhook POST]', e)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
