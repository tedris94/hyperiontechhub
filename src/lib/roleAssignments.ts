import { canAssignPlatformRole, filterPlatformRoleOptions } from '@/lib/roleCatalog'

export function canAssignRole(actorRole: string | undefined, targetRole: string): boolean {
  return canAssignPlatformRole(actorRole, targetRole)
}

export function filterAssignableRoles<T extends { slug: string; name: string }>(
  roles: T[],
  actorRole: string | undefined,
): T[] {
  const asOptions = roles.map((r) => ({ label: r.name, value: r.slug }))
  const allowed = new Set(filterPlatformRoleOptions(actorRole, asOptions).map((o) => o.value))
  return roles.filter((r) => allowed.has(r.slug))
}

export function slugifyRoleName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48)
}

export function isProtectedRoleSlug(slug: string) {
  return slug === 'super_admin'
}

export function canDeleteRole(role: { slug: string; isSystem?: boolean }) {
  if (isProtectedRoleSlug(role.slug)) return false
  return role.isSystem === false
}
