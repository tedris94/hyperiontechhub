import { headers } from 'next/headers'
import { getPublicBasePath } from './public-base'

/** Server-only: read host from request headers and build public base. */
export async function getPublicBaseFromHeaders(tenantSlug: string): Promise<string> {
  const h = await headers()
  // Set by middleware on subdomain / custom-domain requests
  if (h.get('x-icms-vanity') === '1') return ''
  const host = h.get('x-forwarded-host') || h.get('host')
  return getPublicBasePath(tenantSlug, host)
}
