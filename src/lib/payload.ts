export function isPayloadEnabled(): boolean {
  if (process.env.DISABLE_PAYLOAD === '1') return false
  // Avoid Postgres connections during `next build` prerender (Vercel IPv6/pooler issues).
  if (process.env.NEXT_PHASE === 'phase-production-build') return false

  const uri = process.env.DATABASE_URI?.trim()
  if (!uri) return false

  if (process.env.VERCEL === '1') {
    return uri.startsWith('postgres://') || uri.startsWith('postgresql://')
  }

  return true
}

let cachedPromise: Promise<Awaited<ReturnType<typeof import('payload').getPayload>>> | null = null

export async function getPayloadSingleton() {
  if (!isPayloadEnabled()) {
    throw new Error('Payload CMS is not configured for this deployment')
  }

  if (!cachedPromise) {
    cachedPromise = (async () => {
      const { getPayload } = await import('payload')
      const { default: payloadConfig } = await import('@payload-config')
      // Cron jobs do not belong in a request-scoped Vercel function. Starting
      // them here adds cold-start work and can keep free-plan invocations open.
      return getPayload({ config: payloadConfig, cron: false })
    })().catch((error) => {
      cachedPromise = null
      throw error
    })
  }

  return cachedPromise
}
