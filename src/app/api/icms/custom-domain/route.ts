import { NextRequest, NextResponse } from 'next/server'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { getCurrentUser } from '@/lib/auth'
import { isSuperAdmin } from '@/collections/icms/shared'
import { resolveIcmsAccess, accessHasCapability } from '@/lib/icms/access'
import { normalizeHost, PLATFORM_APEX, PLATFORM_HOST } from '@/lib/icms/public-base'
import { tenantSubdomainHost } from '@/lib/icms/ui-variants'
import {
  addProjectDomain,
  getProjectDomain,
  isVercelDomainsConfigured,
  mapVercelStatus,
  normalizeCustomDomainInput,
  removeProjectDomain,
} from '@/lib/icms/vercel-domains'

export const runtime = 'nodejs'

function forbidden() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

async function loadTenantDoc(tenantSlug: string) {
  const payload = await getPayloadSingleton()
  const result = await payload.find({
    collection: 'icms-tenants',
    where: { slug: { equals: tenantSlug } },
    limit: 1,
    overrideAccess: true,
  })
  return result.docs[0] as
    | {
        id: string | number
        slug: string
        customDomain?: string | null
        customDomainStatus?: string | null
        customDomainError?: string | null
      }
    | undefined
}

async function assertDomainsAccess(req: NextRequest, tenantSlug: string) {
  if (!isPayloadEnabled()) return null
  const user = await getCurrentUser(req)
  if (!user) return null
  if (isSuperAdmin(user)) {
    return loadTenantDoc(tenantSlug)
  }
  const access = await resolveIcmsAccess(user, tenantSlug)
  if (!access || !accessHasCapability(access, 'domains')) return null
  return loadTenantDoc(tenantSlug)
}

function isReservedOrPlatformHost(host: string): boolean {
  const h = normalizeHost(host)
  if (!h) return true
  if (h === PLATFORM_HOST || h === PLATFORM_APEX) return true
  if (h.endsWith(`.${PLATFORM_APEX}`)) return true
  if (h.endsWith('.vercel.app') || h === 'localhost') return true
  return false
}

export async function GET(req: NextRequest) {
  const tenantSlug = req.nextUrl.searchParams.get('tenantSlug') || ''
  if (!tenantSlug) {
    return NextResponse.json({ error: 'tenantSlug required' }, { status: 400 })
  }

  const tenant = await assertDomainsAccess(req, tenantSlug)
  if (!tenant) return forbidden()

  const customDomain = tenant.customDomain?.trim()
  if (!customDomain) {
    return NextResponse.json({
      configured: isVercelDomainsConfigured(),
      subdomain: tenantSubdomainHost(tenantSlug),
      customDomain: null,
      status: 'none',
      dns: [],
      pathFallback: `https://${PLATFORM_HOST}/icms/${tenantSlug}`,
    })
  }

  let status = tenant.customDomainStatus || 'none'
  let error = tenant.customDomainError || undefined
  let dns: { type: string; name: string; value: string; reason?: string }[] = []

  if (isVercelDomainsConfigured()) {
    try {
      const info = await getProjectDomain(customDomain)
      const mapped = mapVercelStatus(info)
      status = mapped.status
      dns = mapped.dns
      error = mapped.error
      const payload = await getPayloadSingleton()
      await payload.update({
        collection: 'icms-tenants',
        id: tenant.id,
        data: {
          customDomainStatus: status,
          customDomainError: error || null,
          domainLabel: status === 'active' ? customDomain : tenantSubdomainHost(tenantSlug),
        } as never,
        overrideAccess: true,
      })
    } catch (err) {
      error = err instanceof Error ? err.message : 'Refresh failed'
      status = 'error'
    }
  }

  return NextResponse.json({
    configured: isVercelDomainsConfigured(),
    subdomain: tenantSubdomainHost(tenantSlug),
    customDomain,
    status,
    error,
    dns,
    pathFallback: `https://${PLATFORM_HOST}/icms/${tenantSlug}`,
  })
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { tenantSlug?: string; domain?: string }
  const tenantSlug = body.tenantSlug || ''
  const domain = normalizeCustomDomainInput(body.domain || '')

  if (!tenantSlug || !domain) {
    return NextResponse.json({ error: 'tenantSlug and domain required' }, { status: 400 })
  }
  if (isReservedOrPlatformHost(domain)) {
    return NextResponse.json(
      { error: 'That hostname is reserved or already used by the platform' },
      { status: 400 },
    )
  }
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(domain)) {
    return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 })
  }

  const tenant = await assertDomainsAccess(req, tenantSlug)
  if (!tenant) return forbidden()

  const payload = await getPayloadSingleton()
  const taken = await payload.find({
    collection: 'icms-tenants',
    where: {
      and: [
        { customDomain: { equals: domain } },
        { id: { not_equals: tenant.id } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  })
  if (taken.totalDocs > 0) {
    return NextResponse.json({ error: 'Domain already connected to another centre' }, { status: 409 })
  }

  let status: string = 'pending_dns'
  let error: string | undefined
  let dns: { type: string; name: string; value: string; reason?: string }[] = []

  if (!isVercelDomainsConfigured()) {
    status = 'pending_dns'
    error =
      'Vercel Domains API is not configured (set VERCEL_TOKEN and VERCEL_PROJECT_ID). Domain saved; add it manually in Vercel until then.'
    dns = [
      {
        type: 'CNAME',
        name: domain.startsWith('www.') ? 'www' : '@',
        value: 'cname.vercel-dns.com',
        reason: 'Point this hostname to Vercel',
      },
    ]
  } else {
    try {
      const info = await addProjectDomain(domain)
      const mapped = mapVercelStatus(info)
      status = mapped.status
      dns = mapped.dns
    } catch (err) {
      try {
        const existing = await getProjectDomain(domain)
        const mapped = mapVercelStatus(existing)
        status = mapped.status
        dns = mapped.dns
        if (!existing) {
          status = 'error'
          error = err instanceof Error ? err.message : 'Failed to add domain'
        }
      } catch {
        status = 'error'
        error = err instanceof Error ? err.message : 'Failed to add domain'
      }
    }
  }

  await payload.update({
    collection: 'icms-tenants',
    id: tenant.id,
    data: {
      customDomain: domain,
      customDomainStatus: status,
      customDomainError: error || null,
      domainLabel: status === 'active' ? domain : tenantSubdomainHost(tenantSlug),
    } as never,
    overrideAccess: true,
  })

  return NextResponse.json({
    customDomain: domain,
    status,
    error,
    dns,
    subdomain: tenantSubdomainHost(tenantSlug),
    pathFallback: `https://${PLATFORM_HOST}/icms/${tenantSlug}`,
    configured: isVercelDomainsConfigured(),
  })
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { tenantSlug?: string }
  const tenantSlug = body.tenantSlug || req.nextUrl.searchParams.get('tenantSlug') || ''
  if (!tenantSlug) {
    return NextResponse.json({ error: 'tenantSlug required' }, { status: 400 })
  }

  const tenant = await assertDomainsAccess(req, tenantSlug)
  if (!tenant) return forbidden()

  const customDomain = tenant.customDomain?.trim()
  if (customDomain && isVercelDomainsConfigured()) {
    try {
      await removeProjectDomain(customDomain)
    } catch (err) {
      console.warn('[custom-domain] remove from Vercel:', err)
    }
  }

  const payload = await getPayloadSingleton()
  await payload.update({
    collection: 'icms-tenants',
    id: tenant.id,
    data: {
      customDomain: null,
      customDomainStatus: 'none',
      customDomainError: null,
      domainLabel: tenantSubdomainHost(tenantSlug),
    } as never,
    overrideAccess: true,
  })

  return NextResponse.json({ ok: true, subdomain: tenantSubdomainHost(tenantSlug) })
}
