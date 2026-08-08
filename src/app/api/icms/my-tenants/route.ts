import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, isAdminRole } from '@/lib/auth'
import { getUserIcmsMemberships } from '@/lib/icms/access'
import { mapTenantDoc, type IcmsTenantDoc } from '@/lib/icms/tenants'

/** Current user's ICMS memberships (any signed-in user). */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const memberships = await getUserIcmsMemberships(user.id)
  const tenants = memberships
    .map((m) => {
      const t = typeof m.tenant === 'object' ? (m.tenant as IcmsTenantDoc) : null
      if (!t?.slug) return null
      return {
        membershipId: m.id,
        role: m.role,
        tenant: mapTenantDoc(t),
        adminPath: `/icms/admin/${t.slug}`,
        publicPath: `/icms/${t.slug}`,
      }
    })
    .filter(Boolean)

  return NextResponse.json({
    isPlatformAdmin: isAdminRole(user.role),
    tenants,
  })
}
