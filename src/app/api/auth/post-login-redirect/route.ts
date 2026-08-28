import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, isAdminRole } from '@/lib/auth'
import { getUserIcmsMemberships } from '@/lib/icms/access'
import type { IcmsTenantDoc } from '@/lib/icms/tenants'

function isSafeReturnTo(path: string): boolean {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return false
  if (path.includes('://')) return false
  const pathOnly = path.split('?')[0]
  if (pathOnly === '/login') return false
  return true
}

function tenantSlugFromMembership(tenant: unknown): string | null {
  if (tenant && typeof tenant === 'object' && 'slug' in tenant) {
    return String((tenant as IcmsTenantDoc).slug || '') || null
  }
  return null
}

/**
 * Resolves where a user should land after login.
 * Query: ?returnTo=/optional/path
 */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const requested = req.nextUrl.searchParams.get('returnTo') || ''
  const isPlatform = isAdminRole(user.role)

  if (requested && requested !== '/dashboard' && isSafeReturnTo(requested)) {
    const requestedPath = requested.split('?')[0]
    if (isPlatform && requestedPath.startsWith('/icms/admin/')) {
      return NextResponse.json({ path: '/dashboard', reason: 'platform_admin_default_dashboard' })
    }
    return NextResponse.json({ path: requested, reason: 'returnTo' })
  }

  const memberships = await getUserIcmsMemberships(user.id)

  const tenantSlugs = memberships
    .map((m) => tenantSlugFromMembership(m.tenant))
    .filter(Boolean) as string[]

  // Tenant-only members: skip Hyperion dashboard and open their ICMS admin
  if ((!isPlatform || user.role === 'tenant_member') && tenantSlugs.length === 1) {
    return NextResponse.json({
      path: `/icms/admin/${tenantSlugs[0]}`,
      reason: 'single_icms_membership',
    })
  }
  if ((!isPlatform || user.role === 'tenant_member') && tenantSlugs.length > 1) {
    return NextResponse.json({ path: '/icms', reason: 'multiple_icms_memberships' })
  }
  if (user.role === 'tenant_member') {
    return NextResponse.json({ path: '/icms', reason: 'tenant_member_hub' })
  }

  if (isPlatform) {
    return NextResponse.json({ path: '/dashboard', reason: 'platform_admin' })
  }

  return NextResponse.json({ path: '/dashboard', reason: 'default' })
}
