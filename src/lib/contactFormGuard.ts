/** Allowed "Interested In" values from the public contact form. */
export const CONTACT_SERVICE_VALUES = [
  'edusuite',
  'icms',
  'sme-kit',
  'hyperion-care',
  'training',
  'custom',
  'hub',
  'other',
] as const

export type ContactServiceValue = (typeof CONTACT_SERVICE_VALUES)[number]

const RATE_WINDOW_MS = 60_000
const RATE_MAX = 3
const MIN_FILL_MS = 2_500

type RateBucket = { count: number; resetAt: number }

const ipBuckets = new Map<string, RateBucket>()

export function isAllowedContactService(service: string): service is ContactServiceValue {
  return (CONTACT_SERVICE_VALUES as readonly string[]).includes(service)
}

/** Silent-discard heuristics for obvious bot names (e.g. nRBpKTYDllvOwtmtwCrrriy). */
export function looksLikeBotName(name: string): boolean {
  const n = name.trim()
  if (!n || /\s/.test(n)) return false
  if (n.length < 14) return false
  if (!/^[A-Za-z]+$/.test(n)) return false
  const vowels = (n.match(/[aeiouAEIOU]/g) || []).length
  if (vowels / n.length < 0.22) return true
  return /[a-z]/.test(n) && /[A-Z]/.test(n) && n.length >= 16
}

export function isTooFastSubmission(formStartedAt: unknown): boolean {
  const started = typeof formStartedAt === 'number' ? formStartedAt : Number(formStartedAt)
  if (!Number.isFinite(started) || started <= 0) return true
  const elapsed = Date.now() - started
  return elapsed < MIN_FILL_MS || elapsed > 1000 * 60 * 60 * 24
}

export function clientIpFromRequest(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

/** Simple in-memory rate limit (per serverless instance). Returns true if allowed. */
export function allowContactRequest(ip: string): boolean {
  const now = Date.now()
  const existing = ipBuckets.get(ip)
  if (!existing || existing.resetAt <= now) {
    ipBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (existing.count >= RATE_MAX) return false
  existing.count += 1
  return true
}
