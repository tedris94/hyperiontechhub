import type { CustomDomainStatus } from './types'

const VERCEL_API = 'https://api.vercel.com'

function projectId(): string {
  const id = process.env.VERCEL_PROJECT_ID?.trim()
  if (!id) throw new Error('VERCEL_PROJECT_ID is not configured')
  return id
}

function token(): string {
  const t = process.env.VERCEL_TOKEN?.trim()
  if (!t) throw new Error('VERCEL_TOKEN is not configured')
  return t
}

export function isVercelDomainsConfigured(): boolean {
  return Boolean(process.env.VERCEL_TOKEN?.trim() && process.env.VERCEL_PROJECT_ID?.trim())
}

export type VercelDomainInfo = {
  name: string
  verified: boolean
  verification?: { type: string; domain: string; value: string; reason: string }[]
  configuredBy?: string | null
  raw?: Record<string, unknown>
}

export type DnsInstruction = {
  type: string
  name: string
  value: string
  reason?: string
}

function withTeam(path: string): string {
  const teamId = process.env.VERCEL_TEAM_ID?.trim()
  if (!teamId) return path
  return path.includes('?')
    ? `${path}&teamId=${encodeURIComponent(teamId)}`
    : `${path}?teamId=${encodeURIComponent(teamId)}`
}

async function vercelFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${VERCEL_API}${withTeam(path)}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok) {
    const msg =
      (json.error as { message?: string } | undefined)?.message ||
      (typeof json.message === 'string' ? json.message : `Vercel API ${res.status}`)
    throw new Error(msg)
  }
  return json
}

export async function addProjectDomain(hostname: string): Promise<VercelDomainInfo> {
  const pid = projectId()
  const json = await vercelFetch(`/v10/projects/${encodeURIComponent(pid)}/domains`, {
    method: 'POST',
    body: JSON.stringify({ name: hostname }),
  })
  return mapDomain(json)
}

export async function getProjectDomain(hostname: string): Promise<VercelDomainInfo | null> {
  const pid = projectId()
  try {
    const json = await vercelFetch(
      `/v9/projects/${encodeURIComponent(pid)}/domains/${encodeURIComponent(hostname)}`,
    )
    return mapDomain(json)
  } catch (err) {
    const msg = err instanceof Error ? err.message : ''
    if (msg.toLowerCase().includes('not found') || msg.includes('404')) return null
    throw err
  }
}

export async function removeProjectDomain(hostname: string): Promise<void> {
  const pid = projectId()
  await vercelFetch(
    `/v9/projects/${encodeURIComponent(pid)}/domains/${encodeURIComponent(hostname)}`,
    { method: 'DELETE' },
  )
}

function mapDomain(json: Record<string, unknown>): VercelDomainInfo {
  const verification = Array.isArray(json.verification)
    ? (json.verification as VercelDomainInfo['verification'])
    : undefined
  return {
    name: String(json.name || ''),
    verified: Boolean(json.verified),
    verification,
    configuredBy: json.configuredBy != null ? String(json.configuredBy) : null,
    raw: json,
  }
}

export function mapVercelStatus(
  info: VercelDomainInfo | null,
  fallbackError?: string,
): {
  status: CustomDomainStatus
  error?: string
  dns: DnsInstruction[]
} {
  if (fallbackError) {
    return { status: 'error', error: fallbackError, dns: [] }
  }
  if (!info) {
    return { status: 'pending_dns', dns: defaultCnameInstructions() }
  }

  const dns: DnsInstruction[] = []
  for (const v of info.verification || []) {
    dns.push({
      type: v.type?.toUpperCase() || 'TXT',
      name: v.domain || info.name,
      value: v.value,
      reason: v.reason,
    })
  }
  if (!dns.length) {
    dns.push(...defaultCnameInstructions(info.name))
  }

  if (info.verified) {
    return { status: 'active', dns }
  }

  const hasTxt = (info.verification || []).some((v) => v.type?.toLowerCase() === 'txt')
  return {
    status: hasTxt ? 'pending_dns' : 'pending_ssl',
    dns,
  }
}

function defaultCnameInstructions(hostname?: string): DnsInstruction[] {
  const name = hostname?.startsWith('www.')
    ? 'www'
    : hostname && hostname.includes('.')
      ? hostname.split('.')[0] || '@'
      : '@'
  return [
    {
      type: 'CNAME',
      name: name === hostname ? '@' : name,
      value: 'cname.vercel-dns.com',
      reason: 'Point this hostname to Vercel',
    },
  ]
}

/** Normalize user input to a hostname (no protocol/path). */
export function normalizeCustomDomainInput(input: string): string {
  let s = input.trim().toLowerCase()
  s = s.replace(/^https?:\/\//, '')
  s = s.split('/')[0] || ''
  s = s.replace(/:\d+$/, '').replace(/\.$/, '')
  return s
}
