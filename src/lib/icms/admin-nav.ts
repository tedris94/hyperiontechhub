import type { IcmsCapability } from '@/lib/icms/roles'
import { capsInclude, resolveRoleCapabilities, type IcmsAccessRole } from '@/lib/icms/roles'

export type AdminNavItem = {
  label: string
  href: string
  capability: IcmsCapability | 'dashboard'
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: 'Dashboard', href: '', capability: 'dashboard' },
  { label: 'Site pages', href: 'pages', capability: 'pages' },
  { label: 'Articles', href: 'articles', capability: 'content' },
  { label: 'Events', href: 'events', capability: 'content' },
  { label: 'Islamiyyah', href: 'islamiyyah', capability: 'content' },
  { label: 'Leadership', href: 'leadership', capability: 'leadership' },
  { label: 'Shurah / Committee', href: 'committee', capability: 'committee' },
  { label: 'Waqf', href: 'waqf', capability: 'waqf' },
  { label: 'Facilities', href: 'facilities', capability: 'facilities' },
  { label: 'Donate funds', href: 'donate-funds', capability: 'donate_funds' },
  { label: 'Donations', href: 'donations', capability: 'finance' },
  { label: 'Contact inbox', href: 'inbox', capability: 'inbox' },
  { label: 'Team', href: 'team', capability: 'members' },
  { label: 'Brand tokens', href: 'brand', capability: 'settings' },
  { label: 'Settings', href: 'settings', capability: 'settings' },
]

/** Effective caps for nav/gates — always an array (empty = no module access). */
export function effectiveNavCapabilities(
  role: IcmsAccessRole,
  capabilities?: IcmsCapability[] | null,
): IcmsCapability[] {
  if (capabilities != null) return capabilities
  if (!role) return []
  return resolveRoleCapabilities(role)
}

function settingsVisible(caps: IcmsCapability[]) {
  return (
    capsInclude(caps, 'settings') ||
    capsInclude(caps, 'bank') ||
    capsInclude(caps, 'prayer') ||
    capsInclude(caps, 'domains')
  )
}

/** Sidebar items the role may open. Empty caps → Dashboard only (home / locked message). */
export function visibleAdminNav(
  role: IcmsAccessRole,
  capabilities?: IcmsCapability[] | null,
): AdminNavItem[] {
  if (!role) return []
  const caps = effectiveNavCapabilities(role, capabilities)

  return ADMIN_NAV.filter((item) => {
    if (item.capability === 'dashboard') return true
    if (item.capability === 'settings') return settingsVisible(caps)
    return capsInclude(caps, item.capability)
  })
}

/** Map /icms/admin/[tenant]/… segment to required capability (null = dashboard / allowed). */
export function capabilityForAdminPath(
  pathname: string,
  tenantSlug: string,
): IcmsCapability | 'dashboard' | null {
  const base = `/icms/admin/${tenantSlug}`
  if (pathname === base || pathname === `${base}/`) return 'dashboard'
  if (!pathname.startsWith(`${base}/`)) return null
  const segment = pathname.slice(base.length + 1).split('/')[0] || ''
  const item = ADMIN_NAV.find((n) => n.href === segment)
  return item?.capability ?? null
}

export function canAccessAdminPath(
  pathname: string,
  tenantSlug: string,
  role: IcmsAccessRole,
  capabilities?: IcmsCapability[] | null,
): boolean {
  if (!role) return false
  const required = capabilityForAdminPath(pathname, tenantSlug)
  if (required == null) return true
  if (required === 'dashboard') return true
  const caps = effectiveNavCapabilities(role, capabilities)
  if (required === 'settings') return settingsVisible(caps)
  return capsInclude(caps, required)
}
