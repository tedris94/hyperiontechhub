import { tenantSubdomainHost } from './ui-variants'

export const PLATFORM_HOST = 'www.hyperiontechhub.com'
export const PLATFORM_APEX = 'hyperiontechhub.com'

/** Normalize hostname: lowercase, strip port and trailing dot. */
export function normalizeHost(host: string | null | undefined): string {
  if (!host) return ''
  return host.trim().toLowerCase().replace(/:\d+$/, '').replace(/\.$/, '')
}

export function isPlatformHost(host: string): boolean {
  const h = normalizeHost(host)
  return (
    h === PLATFORM_HOST ||
    h === PLATFORM_APEX ||
    h === 'localhost' ||
    h === '127.0.0.1' ||
    h.endsWith('.vercel.app')
  )
}

/**
 * True when the request is already on a tenant vanity host
 * (subdomain or custom domain) — public links should be root-relative.
 */
export function isVanityHost(host: string, tenantSlug: string): boolean {
  const h = normalizeHost(host)
  if (!h) return false
  if (h === tenantSubdomainHost(tenantSlug)) return true
  if (h === `${tenantSlug}.localhost`) return true
  // Custom domains are vanity; platform hosts are not
  if (isPlatformHost(h)) return false
  // Any other host reaching tenant layout via rewrite is vanity
  return true
}

/** Path prefix for public tenant links. Empty on vanity hosts. */
export function getPublicBasePath(tenantSlug: string, host?: string | null): string {
  if (host && isVanityHost(host, tenantSlug)) return ''
  return `/icms/${tenantSlug}`
}

/** Absolute www URL for admin / platform (never on vanity hosts). */
export function getAdminAbsoluteUrl(tenantSlug: string, path = ''): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || `https://${PLATFORM_HOST}`
  const suffix = path.startsWith('/') ? path : path ? `/${path}` : ''
  return `${base}/icms/admin/${tenantSlug}${suffix}`
}

export function getPlatformAbsoluteUrl(path = '/icms/platform'): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || `https://${PLATFORM_HOST}`
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
