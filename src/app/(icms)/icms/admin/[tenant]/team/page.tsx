import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { isSuperAdmin } from '@/collections/icms/shared'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import type { IcmsCapability, IcmsRole, RoleCapabilityOverride } from '@/lib/icms/roles'
import TeamManager from './TeamManager'

type Props = { params: Promise<{ tenant: string }> }

function parseOverrides(doc: {
  roleCapabilityOverrides?: { role?: string | null; capabilities?: string[] | null }[] | null
}): RoleCapabilityOverride[] {
  if (!Array.isArray(doc.roleCapabilityOverrides)) return []
  return doc.roleCapabilityOverrides
    .filter((r): r is { role: string; capabilities?: string[] | null } => Boolean(r?.role))
    .map((r) => ({
      role: r.role as IcmsRole,
      capabilities: (r.capabilities || []).filter(Boolean) as IcmsCapability[],
    }))
}

export default async function AdminTeamPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const user = await getCurrentUser()
  const canEditGrants = isSuperAdmin(user)
  const initialOverrides = parseOverrides(doc)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">Team</h1>
        <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
          Register centre staff, assign ICMS roles, and review what each role can open in the admin
          sidebar. Visibility grants (custom caps) are managed by Hyperion super admin.
        </p>
      </div>
      <TeamManager
        tenantId={doc.id}
        tenantSlug={tenant.slug}
        initialOverrides={initialOverrides}
        canEditGrants={canEditGrants}
      />
    </div>
  )
}
