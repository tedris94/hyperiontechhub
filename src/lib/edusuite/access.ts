import type { Access, Where } from 'payload'
import { isPlatformAdmin, type SchoolRole } from '@/collections/edusuite/shared'
import {
  ROLE_MODULE_ACCESS,
  roleCanAccessModule,
  type SchoolRole as NavSchoolRole,
} from '@/lib/edusuite/nav'

export { ROLE_MODULE_ACCESS, roleCanAccessModule }

/** Roles that can manage school settings and all modules. */
export const MANAGEMENT_ROLES: SchoolRole[] = [
  'owner',
  'principal',
  'vice_principal',
  'it_support',
]

export function schoolIdFromDoc(school: unknown): string | number | null {
  if (school == null) return null
  if (typeof school === 'object' && school !== null && 'id' in school) {
    return (school as { id: string | number }).id
  }
  return school as string | number
}

/** Payload access: authenticated; platform admins unrestricted. App APIs enforce school membership. */
export const authenticatedEduAccess: Access = ({ req }) => {
  if (!req.user) return false
  return true
}

export function schoolEqualsWhere(schoolId: string | number): Where {
  return { school: { equals: schoolId } }
}

export function canManageSchoolSettings(
  isAdmin: boolean,
  role: SchoolRole | NavSchoolRole | null | undefined,
): boolean {
  if (isAdmin) return true
  if (!role) return false
  return MANAGEMENT_ROLES.includes(role as SchoolRole)
}

export { isPlatformAdmin }
