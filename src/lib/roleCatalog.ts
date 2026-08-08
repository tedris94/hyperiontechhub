import { ICMS_ROLE_META, type IcmsRole } from '@/lib/icms/roles'
import { SCHOOL_ROLES, type SchoolRole } from '@/collections/edusuite/shared'

/** Hyperion platform identity on `users.role` — controls Hyperion dashboard access. */
export const PLATFORM_ROLES = [
  'super_admin',
  'admin',
  'consultant',
  'student',
  'instructor',
  'client',
  'subscriber',
  /** Mosque / center staff with no Hyperion dashboard — use ICMS memberships for tenant access */
  'tenant_member',
] as const

export type PlatformRole = (typeof PLATFORM_ROLES)[number]

export function isAdminRole(role: string | undefined): role is 'super_admin' | 'admin' {
  return role === 'super_admin' || role === 'admin'
}

export type RoleOption = { label: string; value: string }

const PLATFORM_LABELS: Record<PlatformRole, string> = {
  super_admin: 'Hyperion · Super Admin',
  admin: 'Hyperion · Admin',
  consultant: 'Hyperion · Consultant',
  student: 'Hyperion · Student',
  instructor: 'Hyperion · Instructor',
  client: 'Hyperion · Client',
  subscriber: 'Hyperion · Subscriber',
  tenant_member: 'Tenant member (no Hyperion dashboard)',
}

export function platformRoleOptions(): RoleOption[] {
  return PLATFORM_ROLES.map((value) => ({
    value,
    label: PLATFORM_LABELS[value],
  }))
}

export function icmsRoleOptions(): RoleOption[] {
  return ICMS_ROLE_META.map((meta) => ({
    value: meta.value,
    label: `ICMS · ${meta.label}`,
  }))
}

/** Rich role list for platform assign UI */
export function icmsRoleCatalog() {
  return ICMS_ROLE_META.map((meta) => ({
    value: meta.value,
    label: meta.label,
    description: meta.description,
    capabilities: meta.capabilities,
  }))
}

export function edusuiteRoleOptions(): RoleOption[] {
  return SCHOOL_ROLES.map((value) => ({
    value,
    label: `EduSuite · ${value.replace(/_/g, ' ')}`,
  }))
}

/** Full catalog for documentation / future unified invite UIs. */
export function allProductRoleCatalog(): {
  system: string
  options: RoleOption[]
}[] {
  return [
    { system: 'Hyperion', options: platformRoleOptions() },
    { system: 'ICMS', options: icmsRoleOptions() },
    { system: 'EduSuite', options: edusuiteRoleOptions() },
  ]
}

export function isPlatformAdminRole(role: string | undefined | null): boolean {
  return role === 'super_admin' || role === 'admin'
}

/** Who may assign which Hyperion platform role. */
export function canAssignPlatformRole(
  actorRole: string | undefined | null,
  targetRole: string,
): boolean {
  if (!actorRole) return false
  if (targetRole === 'super_admin') return actorRole === 'super_admin'
  if (actorRole === 'super_admin' || actorRole === 'admin') return true
  return false
}

/** Options shown on Users.role for the current actor. */
export function filterPlatformRoleOptions(
  actorRole: string | undefined | null,
  options: RoleOption[],
): RoleOption[] {
  if (actorRole === 'super_admin') return options
  if (actorRole === 'admin') {
    return options.filter((o) => o.value !== 'super_admin')
  }
  // Non-admins cannot assign platform roles via admin UI
  return []
}

/**
 * Product membership roles (ICMS / EduSuite).
 * Super admin & platform admin: all roles in that product.
 * Others: none via Payload admin (tenant invites come later).
 */
export function filterProductRoleOptions(
  actorRole: string | undefined | null,
  options: RoleOption[],
): RoleOption[] {
  if (isPlatformAdminRole(actorRole)) return options
  return []
}

export function isTenantOnlyPlatformRole(role: string | undefined | null): boolean {
  return role === 'tenant_member'
}

export type { IcmsRole, SchoolRole }
