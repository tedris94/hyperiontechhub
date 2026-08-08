import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { isSuperAdmin, type IcmsRole } from '@/collections/icms/shared'
import {
  getTenantBySlug,
  type IcmsMembershipDoc,
  type IcmsTenantDoc,
} from './tenants'
import {
  ICMS_ROLES,
  resolveRoleCapabilities,
  type IcmsCapability,
  type RoleCapabilityOverride,
} from './roles'

export {
  canManageContent,
  canManageFinance,
  canManageSettings,
  canManageMembers,
  canManagePages,
  canManageWaqf,
  canManageLeadership,
  canManageInbox,
  canManageDomains,
  hasCapability,
  listCapabilities,
  canViewAdminSection,
  COLLECTION_CAPABILITY,
  type IcmsAccessRole,
  type IcmsCapability,
  type RoleCapabilityOverride,
} from './roles'

function parseOverrides(tenant: IcmsTenantDoc): RoleCapabilityOverride[] {
  const raw = (tenant as { roleCapabilityOverrides?: unknown }).roleCapabilityOverrides
  if (!Array.isArray(raw)) return []
  return raw
    .map((row) => {
      const r = row as { role?: string; capabilities?: unknown }
      if (!r.role) return null
      if (!ICMS_ROLES.includes(r.role as IcmsRole)) return null
      const caps = Array.isArray(r.capabilities)
        ? (r.capabilities.filter(Boolean) as IcmsCapability[])
        : []
      return { role: r.role as IcmsRole, capabilities: caps }
    })
    .filter(Boolean) as RoleCapabilityOverride[]
}

function normalizeIcmsRole(role: unknown): IcmsRole | null {
  if (typeof role !== 'string') return null
  return ICMS_ROLES.includes(role as IcmsRole) ? (role as IcmsRole) : null
}

export async function getUserIcmsMemberships(
  userId: string | number,
): Promise<IcmsMembershipDoc[]> {
  if (!isPayloadEnabled()) return []
  const payload = await getPayloadSingleton()
  const result = await payload.find({
    collection: 'icms-memberships',
    where: {
      and: [{ user: { equals: userId } }, { status: { equals: 'active' } }],
    },
    depth: 1,
    limit: 50,
    sort: '-updatedAt',
    overrideAccess: true,
  })
  return result.docs as unknown as IcmsMembershipDoc[]
}

export type IcmsAccess = {
  tenant: IcmsTenantDoc
  membership: IcmsMembershipDoc | null
  /** True only for Hyperion super_admin (full bypass). */
  isAdmin: boolean
  role: IcmsRole | 'platform_admin' | null
  /** Effective capabilities after tenant overrides. */
  capabilities: IcmsCapability[]
  overrides: RoleCapabilityOverride[]
}

export async function resolveIcmsAccess(
  user: { id?: unknown; role?: string } | null | undefined,
  tenantSlug: string,
): Promise<IcmsAccess | null> {
  const tenant = await getTenantBySlug(tenantSlug)
  if (!tenant) return null

  const overrides = parseOverrides(tenant)

  // Only Hyperion super_admin gets automatic full ICMS access
  if (isSuperAdmin(user)) {
    return {
      tenant,
      membership: null,
      isAdmin: true,
      role: 'platform_admin',
      capabilities: resolveRoleCapabilities('platform_admin'),
      overrides,
    }
  }

  if (!user?.id) return null

  const memberships = await getUserIcmsMemberships(user.id as string | number)
  const forTenant = memberships.filter((m) => {
    const tid = typeof m.tenant === 'object' && m.tenant ? m.tenant.id : m.tenant
    return String(tid) === String(tenant.id)
  })
  // Newest membership wins if duplicates exist
  const membership = forTenant[0] || null

  if (!membership) return null

  const role = normalizeIcmsRole(membership.role)
  if (!role) return null

  return {
    tenant,
    membership,
    isAdmin: false,
    role,
    capabilities: resolveRoleCapabilities(role, overrides),
    overrides,
  }
}

export function accessHasCapability(access: IcmsAccess, capability: IcmsCapability): boolean {
  return access.capabilities.includes(capability)
}
