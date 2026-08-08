import crypto from 'crypto'

export function getPaystackConfig(secretKeyOverride?: string | null) {
  const secretKey = secretKeyOverride?.trim() || process.env.PAYSTACK_SECRET_KEY
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

  if (!secretKey) {
    throw new Error('Paystack is not configured. Provide a secret key.')
  }

  return { secretKey, publicKey }
}

export function isPaystackConfigured(secretKeyOverride?: string | null): boolean {
  return Boolean(secretKeyOverride?.trim() || process.env.PAYSTACK_SECRET_KEY)
}

const PAYSTACK_API = 'https://api.paystack.co'

export type PaystackInitResponse = {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export type PaystackVerifyResponse = {
  status: boolean
  message: string
  data: {
    status: string
    reference: string
    amount: number
    currency: string
    paid_at: string
    metadata?: Record<string, unknown>
  }
}

export async function initializeTransaction(params: {
  email: string
  amount: number
  reference: string
  callbackUrl: string
  metadata?: Record<string, unknown>
  /** Per-tenant / per-merchant secret; falls back to PAYSTACK_SECRET_KEY */
  secretKey?: string | null
}): Promise<PaystackInitResponse> {
  const { secretKey } = getPaystackConfig(params.secretKey)
  const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amount,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
      currency: 'NGN',
    }),
  })

  const data = (await res.json()) as PaystackInitResponse
  if (!res.ok || !data.status) {
    throw new Error(data.message || 'Failed to initialize Paystack transaction')
  }
  return data
}

export async function verifyTransaction(
  reference: string,
  secretKeyOverride?: string | null,
): Promise<PaystackVerifyResponse> {
  const { secretKey } = getPaystackConfig(secretKeyOverride)
  const res = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  })

  const data = (await res.json()) as PaystackVerifyResponse
  if (!res.ok || !data.status) {
    throw new Error(data.message || 'Failed to verify Paystack transaction')
  }
  return data
}

export function verifyPaystackWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false
  const { secretKey } = getPaystackConfig()
  const hash = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex')
  return hash === signature
}

export function generateOrderReference(): string {
  return `HTH-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
}
