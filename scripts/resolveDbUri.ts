import dns from 'node:dns/promises'

const PUBLIC_DNS = ['8.8.8.8', '1.1.1.1']

function extractHost(connectionString: string): string | null {
  const match = connectionString.match(/@([^/?]+)/)
  if (!match) return null
  const authority = match[1]
  const host = authority.includes(':') ? authority.slice(0, authority.lastIndexOf(':')) : authority
  return host.replace(/^\[|\]$/g, '') || null
}

function projectRefFromDirectHost(host: string): string | null {
  const match = host.match(/^db\.([^.]+)\.supabase\.co$/)
  return match?.[1] ?? null
}

/** Rewrite Direct URI → Session pooler (IPv4-friendly, correct pooler username). */
export function toSessionPoolerUri(directUri: string, region: string): string {
  const host = extractHost(directUri)
  if (!host) return directUri
  const ref = projectRefFromDirectHost(host)
  if (!ref) return directUri

  const poolerHost = `aws-0-${region.trim()}.pooler.supabase.com`
  let uri = directUri.replace(host, poolerHost)
  if (uri.includes('postgresql://postgres:')) {
    uri = uri.replace('postgresql://postgres:', `postgresql://postgres.${ref}:`)
  }
  console.info(`[db] Using Session pooler (${poolerHost}) with user postgres.${ref}`)
  return uri
}

function replaceHostInUri(connectionString: string, host: string, replacement: string): string {
  return connectionString.replace(`@${host}:`, `@${replacement}:`)
}

export async function prepareDatabaseUri(connectionString: string): Promise<string> {
  const poolerRegion = process.env.SUPABASE_POOLER_REGION?.trim()
  const host = extractHost(connectionString)

  if (poolerRegion && host && projectRefFromDirectHost(host)) {
    return toSessionPoolerUri(connectionString, poolerRegion)
  }

  if (!host?.includes('supabase.co')) return connectionString

  const tryLookup = async (servers?: string[]) => {
    if (servers) dns.setServers(servers)
    await dns.lookup(host, { verbatim: true })
    return connectionString
  }

  try {
    return await tryLookup()
  } catch {
    console.info(`[db] System DNS could not resolve ${host} — trying public DNS (${PUBLIC_DNS.join(', ')})`)
    try {
      return await tryLookup(PUBLIC_DNS)
    } catch {
      const v4 = await dns.resolve4(host).catch(() => [] as string[])
      const v6 = await dns.resolve6(host).catch(() => [] as string[])
      const ip = v4[0] ?? v6[0]
      if (!ip) {
        throw new Error(
          [
            `Cannot resolve ${host}.`,
            'Fix: In Supabase → Connect → Session pooler, copy the URI and set DATABASE_URI,',
            'OR set SUPABASE_POOLER_REGION=your-region in .env.local (region shown in Session pooler URI).',
          ].join('\n'),
        )
      }
      const connectHost = ip.includes(':') ? `[${ip}]` : ip
      console.info(`[db] Resolved ${host} → ${connectHost} via public DNS`)
      return replaceHostInUri(connectionString, host, connectHost)
    }
  }
}
