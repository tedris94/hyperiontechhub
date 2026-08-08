import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { resolveIcmsAccess } from '@/lib/icms/access'
import { visibleAdminNav } from '@/lib/icms/admin-nav'
import { tenantCssVars } from '@/lib/icms/utils'
import AdminShell from '@/components/icms/AdminShell'
import AdminAccessDenied from '@/components/icms/AdminAccessDenied'
import AdminCapabilityGate from '@/components/icms/AdminCapabilityGate'
import type { IcmsRole } from '@/lib/icms/roles'

export const dynamic = 'force-dynamic'

type Props = {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}

export default async function AdminLayout({ children, params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)

  const user = await getCurrentUser()

  if (!user) {
    return (
      <div className="icms-root" style={tenantCssVars(tenant)}>
        <AdminAccessDenied tenant={tenant} reason="unauthenticated" />
      </div>
    )
  }

  const access = await resolveIcmsAccess(user, slug)
  if (!access) {
    return (
      <div className="icms-root" style={tenantCssVars(tenant)}>
        <AdminAccessDenied
          tenant={tenant}
          reason="no_membership"
          signedInEmail={user.email}
        />
      </div>
    )
  }

  const role: IcmsRole | 'platform_admin' | null = access.role
  const isAdmin = access.isAdmin
  const capabilities = access.capabilities
  const navItems = visibleAdminNav(role, capabilities)

  return (
    <div className="icms-root" style={tenantCssVars(tenant)}>
      <AdminShell
        tenant={tenant}
        role={role}
        isAdmin={isAdmin}
        capabilities={capabilities}
        navItems={navItems}
      >
        <AdminCapabilityGate
          tenantSlug={tenant.slug}
          role={role}
          capabilities={capabilities}
        >
          {children}
        </AdminCapabilityGate>
      </AdminShell>
    </div>
  )
}
