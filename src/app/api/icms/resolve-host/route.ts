import { NextResponse } from 'next/server'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { normalizeHost } from '@/lib/icms/public-base'
import { ANAS_TENANT } from '@/lib/icms/fallback'

export const runtime = 'nodejs'

/**
 * Resolve a custom hostname to an ICMS tenant slug.
 * Used by Edge middleware (short-cached).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const host = normalizeHost(searchParams.get('host'))
  if (!host) {
    return NextResponse.json({ error: 'host required' }, { status: 400 })
  }

  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
  }

  if (!isPayloadEnabled()) {
    // Fallback demo: no custom domain mapping
    if (host === ANAS_TENANT.domainLabel || host === 'anas-bn-malik.hyperiontechhub.com') {
      return NextResponse.json(
        { slug: ANAS_TENANT.slug, status: 'active' },
        { headers },
      )
    }
    return NextResponse.json({ slug: null }, { status: 404, headers })
  }

  try {
    const payload = await getPayloadSingleton()
    const candidates = [host]
    if (host.startsWith('www.')) candidates.push(host.slice(4))
    else candidates.push(`www.${host}`)

    const result = await payload.find({
      collection: 'icms-tenants',
      where: {
        and: [
          { customDomain: { in: candidates } },
          { status: { not_equals: 'suspended' } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })

    const doc = result.docs[0] as
      | { slug?: string; customDomainStatus?: string }
      | undefined

    if (!doc?.slug) {
      return NextResponse.json({ slug: null }, { status: 404, headers })
    }

    return NextResponse.json(
      {
        slug: doc.slug,
        status: doc.customDomainStatus || 'none',
      },
      { headers },
    )
  } catch (err) {
    console.error('[resolve-host]', err)
    return NextResponse.json({ error: 'resolve failed' }, { status: 500 })
  }
}
