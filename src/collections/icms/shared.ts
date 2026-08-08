import type { Access, CollectionConfig, Field } from 'payload'
import { ICMS_ROLES } from '@/lib/icms/roles'

export { ICMS_ROLES }
export type { IcmsRole } from '@/lib/icms/roles'

export function isPlatformAdmin(user: unknown): boolean {
  const role = (user as { role?: string } | null | undefined)?.role
  return role === 'super_admin' || role === 'admin'
}

/** Full ICMS bypass — only Hyperion super_admin. */
export function isSuperAdmin(user: unknown): boolean {
  return (user as { role?: string } | null | undefined)?.role === 'super_admin'
}

export function tenantRelationField(required = true): Field {
  return {
    name: 'tenant',
    type: 'relationship',
    relationTo: 'icms-tenants',
    required,
    index: true,
  }
}

/** Authenticated users can read/write; platform admins always can. Tenant scoping enforced in app APIs. */
export const icmsAccess: Access = ({ req }) => {
  if (!req.user) return false
  return true
}

export const icmsAdminAccess: Access = ({ req }) => {
  if (!req.user) return false
  if (isPlatformAdmin(req.user)) return true
  return true
}

export function makeTenantScopedCollection(
  slug: string,
  label: string,
  extraFields: Field[],
  options?: { useAsTitle?: string; defaultColumns?: string[] },
): CollectionConfig {
  return {
    slug,
    labels: { singular: label, plural: label },
    admin: {
      useAsTitle: options?.useAsTitle || 'title',
      defaultColumns: options?.defaultColumns || ['title', 'tenant', 'updatedAt'],
      group: 'ICMS',
    },
    access: {
      read: icmsAccess,
      create: icmsAccess,
      update: icmsAccess,
      delete: icmsAccess,
    },
    fields: [tenantRelationField(true), ...extraFields],
  }
}
