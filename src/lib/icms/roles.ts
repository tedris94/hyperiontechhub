/**
 * ICMS tenant roles and capabilities.
 * Only Hyperion `super_admin` gets a virtual `platform_admin` role with every capability.
 * Hyperion `admin` and centre staff use membership role + optional tenant overrides.
 */

export const ICMS_ROLES = [
  'owner',
  'director',
  'imam',
  'content_editor',
  'waqf_manager',
  'secretary',
  'finance',
  'viewer',
] as const

export type IcmsRole = (typeof ICMS_ROLES)[number]

export type IcmsAccessRole = IcmsRole | 'platform_admin' | null

/** Fine-grained gates used by admin nav and `/api/icms/records`. */
export type IcmsCapability =
  | 'content'
  | 'pages'
  | 'leadership'
  | 'committee'
  | 'waqf'
  | 'facilities'
  | 'donate_funds'
  | 'finance'
  | 'settings'
  | 'domains'
  | 'members'
  | 'inbox'
  | 'prayer'
  | 'bank'

export const ALL_ICMS_CAPABILITIES: IcmsCapability[] = [
  'content',
  'pages',
  'leadership',
  'committee',
  'waqf',
  'facilities',
  'donate_funds',
  'finance',
  'settings',
  'domains',
  'members',
  'inbox',
  'prayer',
  'bank',
]

export const CAPABILITY_LABELS: Record<IcmsCapability, string> = {
  content: 'Articles & events',
  pages: 'Site pages',
  leadership: 'Leadership',
  committee: 'Shurah & committees',
  waqf: 'Waqf',
  facilities: 'Facilities',
  donate_funds: 'Donate funds',
  finance: 'Donations',
  settings: 'Centre settings',
  domains: 'Custom domains',
  members: 'Team & users',
  inbox: 'Inbox',
  prayer: 'Prayer',
  bank: 'Bank',
}

/** Nav / dashboard sections tied to capabilities (for the grants UI). */
export const NAV_CAPABILITY_HINTS: Partial<Record<IcmsCapability, string>> = {
  content: 'Articles, Events, Islamiyyah',
  pages: 'Site pages',
  leadership: 'Leadership',
  committee: 'Shurah / Committee',
  waqf: 'Waqf',
  facilities: 'Facilities',
  donate_funds: 'Donate funds',
  finance: 'Donations',
  settings: 'Settings, Brand tokens',
  domains: 'Domain connection (Settings)',
  members: 'Team',
  inbox: 'Contact inbox',
  prayer: 'Prayer settings',
  bank: 'Bank details',
}

export type IcmsRoleMeta = {
  value: IcmsRole
  label: string
  description: string
  capabilities: IcmsCapability[]
}

export type RoleCapabilityOverride = {
  role: IcmsRole
  capabilities: IcmsCapability[]
}

/** Centre ops defaults — does NOT include `domains` (super_admin only unless granted). */
const FULL_OPS: IcmsCapability[] = [
  'content',
  'pages',
  'leadership',
  'committee',
  'waqf',
  'facilities',
  'donate_funds',
  'finance',
  'settings',
  'prayer',
  'bank',
  'inbox',
]

export const ICMS_ROLE_META: IcmsRoleMeta[] = [
  {
    value: 'owner',
    label: 'Owner',
    description:
      'Full centre control — website, finance, settings, and registering / assigning staff. Domains require an explicit grant.',
    capabilities: [...FULL_OPS, 'members'],
  },
  {
    value: 'director',
    label: 'Director',
    description:
      'Operational leadership: content, Waqf, finance, settings, inbox, and team registration.',
    capabilities: [...FULL_OPS, 'members'],
  },
  {
    value: 'imam',
    label: 'Imam',
    description:
      'Religious content — articles, events, leadership bios, Shurah roster, and public page copy.',
    capabilities: ['content', 'pages', 'leadership', 'committee', 'facilities'],
  },
  {
    value: 'content_editor',
    label: 'Content editor',
    description: 'Articles, events, and public page copy for the website.',
    capabilities: ['content', 'pages'],
  },
  {
    value: 'waqf_manager',
    label: 'Waqf manager',
    description: 'Waqf projects, fundraising progress, and related page copy.',
    capabilities: ['waqf', 'pages', 'donate_funds'],
  },
  {
    value: 'secretary',
    label: 'Secretary',
    description: 'Events, leadership, Shurah/HR committees, facilities, and contact inbox.',
    capabilities: ['content', 'leadership', 'committee', 'facilities', 'inbox', 'pages'],
  },
  {
    value: 'finance',
    label: 'Finance',
    description: 'Donations ledger, bank account details, and donate fund labels.',
    capabilities: ['finance', 'bank', 'donate_funds'],
  },
  {
    value: 'viewer',
    label: 'Viewer',
    description: 'Read-only dashboards only where granted (default: none until granted).',
    capabilities: [],
  },
]

const DEFAULT_ROLE_CAP_MAP: Record<IcmsRole, Set<IcmsCapability>> = Object.fromEntries(
  ICMS_ROLE_META.map((r) => [r.value, new Set(r.capabilities)]),
) as Record<IcmsRole, Set<IcmsCapability>>

export function getIcmsRoleMeta(role: IcmsRole): IcmsRoleMeta {
  return ICMS_ROLE_META.find((r) => r.value === role) || ICMS_ROLE_META[ICMS_ROLE_META.length - 1]
}

export function defaultCapabilitiesForRole(role: IcmsRole): IcmsCapability[] {
  return [...(DEFAULT_ROLE_CAP_MAP[role] || [])]
}

/** Resolve capabilities for a role, applying tenant overrides when present. */
export function resolveRoleCapabilities(
  role: IcmsAccessRole,
  overrides?: RoleCapabilityOverride[] | null,
): IcmsCapability[] {
  if (!role) return []
  if (role === 'platform_admin') return [...ALL_ICMS_CAPABILITIES]
  const override = overrides?.find((o) => o.role === role)
  if (override) {
    return override.capabilities.filter((c): c is IcmsCapability =>
      ALL_ICMS_CAPABILITIES.includes(c),
    )
  }
  return defaultCapabilitiesForRole(role)
}

export function hasCapability(
  role: IcmsAccessRole,
  capability: IcmsCapability,
  overrides?: RoleCapabilityOverride[] | null,
): boolean {
  if (!role) return false
  if (role === 'platform_admin') return true
  return resolveRoleCapabilities(role, overrides).includes(capability)
}

export function listCapabilities(
  role: IcmsAccessRole,
  overrides?: RoleCapabilityOverride[] | null,
): IcmsCapability[] {
  return resolveRoleCapabilities(role, overrides)
}

/** May open the nav section (viewers only see caps they were granted). */
export function canViewAdminSection(
  role: IcmsAccessRole,
  capability: IcmsCapability | 'any',
  overrides?: RoleCapabilityOverride[] | null,
): boolean {
  if (capability === 'any') return Boolean(role)
  return hasCapability(role, capability, overrides)
}

/** Effective capability check against a resolved cap list. */
export function capsInclude(
  capabilities: IcmsCapability[] | undefined | null,
  capability: IcmsCapability,
): boolean {
  return Boolean(capabilities?.includes(capability))
}

export function canManageContent(role: IcmsAccessRole): boolean {
  return hasCapability(role, 'content')
}

export function canManageFinance(role: IcmsAccessRole): boolean {
  return hasCapability(role, 'finance')
}

export function canManageSettings(role: IcmsAccessRole): boolean {
  return hasCapability(role, 'settings')
}

export function canManageMembers(role: IcmsAccessRole): boolean {
  return hasCapability(role, 'members')
}

export function canManagePages(role: IcmsAccessRole): boolean {
  return hasCapability(role, 'pages')
}

export function canManageWaqf(role: IcmsAccessRole): boolean {
  return hasCapability(role, 'waqf')
}

export function canManageLeadership(role: IcmsAccessRole): boolean {
  return hasCapability(role, 'leadership')
}

export function canManageCommittee(role: IcmsAccessRole): boolean {
  return hasCapability(role, 'committee')
}

export function canManageInbox(role: IcmsAccessRole): boolean {
  return hasCapability(role, 'inbox')
}

export function canManageDomains(role: IcmsAccessRole): boolean {
  return hasCapability(role, 'domains')
}

/** Map Payload collection slug → required write capability */
export const COLLECTION_CAPABILITY: Record<string, IcmsCapability | 'platform' | 'settings'> = {
  'icms-tenants': 'settings',
  'icms-memberships': 'members',
  'icms-articles': 'content',
  'icms-events': 'content',
  'icms-islamiyyah-classes': 'content',
  'icms-islamiyyah-students': 'content',
  'icms-leaders': 'leadership',
  'icms-committee-members': 'committee',
  'icms-prayer-times': 'prayer',
  'icms-donations': 'finance',
  'icms-waqf-projects': 'waqf',
  'icms-pages': 'pages',
  'icms-facilities': 'facilities',
  'icms-donate-funds': 'donate_funds',
  'icms-contact-messages': 'inbox',
}
