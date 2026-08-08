import type { Access, CollectionConfig, Field } from 'payload'

export const SCHOOL_ROLES = [
  'owner',
  'principal',
  'vice_principal',
  'teacher',
  'accountant',
  'hr',
  'librarian',
  'transport',
  'hostel',
  'admission',
  'parent',
  'student',
  'alumni',
  'it_support',
] as const

export type SchoolRole = (typeof SCHOOL_ROLES)[number]

export function isPlatformAdmin(user: unknown): boolean {
  const role = (user as { role?: string } | null | undefined)?.role
  return role === 'super_admin' || role === 'admin'
}

export function schoolRelationField(required = true): Field {
  return {
    name: 'school',
    type: 'relationship',
    relationTo: 'schools',
    required,
    index: true,
  }
}

/** Authenticated users can read/write; platform admins always can. School scoping enforced in app APIs. */
export const edusuiteAccess: Access = ({ req }) => {
  if (!req.user) return false
  return true
}

export const edusuiteAdminAccess: Access = ({ req }) => {
  if (!req.user) return false
  if (isPlatformAdmin(req.user)) return true
  return true
}

export function makeSchoolScopedCollection(
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
      defaultColumns: options?.defaultColumns || ['title', 'school', 'updatedAt'],
      group: 'EduSuite',
    },
    access: {
      read: edusuiteAccess,
      create: edusuiteAccess,
      update: edusuiteAccess,
      delete: edusuiteAccess,
    },
    fields: [schoolRelationField(true), ...extraFields],
  }
}
