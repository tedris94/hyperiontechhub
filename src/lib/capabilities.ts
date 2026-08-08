export type CapabilityDef = {
  key: string
  label: string
  group: string
  description?: string
}

export const ALL_CAPABILITIES = [
  { key: 'dashboard.home', label: 'Dashboard home', group: 'General' },
  { key: 'analytics.view', label: 'Analytics', group: 'General' },
  { key: 'contacts.manage', label: 'Contact submissions', group: 'Operations' },
  { key: 'consultations.manage', label: 'Consultations', group: 'Operations' },
  { key: 'team.view', label: 'Team members', group: 'People' },
  { key: 'careers.manage', label: 'Careers / jobs', group: 'People' },
  { key: 'applications.manage', label: 'Job applications', group: 'People' },
  { key: 'applications.delete', label: 'Delete applications', group: 'People' },
  { key: 'cms.view', label: 'CMS', group: 'Content' },
  { key: 'cms.pages.view', label: 'View pages', group: 'Content' },
  { key: 'cms.pages.create', label: 'Create pages', group: 'Content' },
  { key: 'cms.pages.edit', label: 'Edit pages', group: 'Content' },
  { key: 'cms.pages.delete', label: 'Delete pages', group: 'Content' },
  { key: 'cms.pages.publish', label: 'Publish pages', group: 'Content' },
  { key: 'cms.home.manage', label: 'Manage home page', group: 'Content' },
  { key: 'cms.media.manage', label: 'Manage media library', group: 'Content' },
  { key: 'cms.seo.manage', label: 'Manage SEO settings', group: 'Content' },
  { key: 'cms.header.manage', label: 'Manage site header', group: 'Content' },
  { key: 'cms.footer.manage', label: 'Manage site footer', group: 'Content' },
  { key: 'settings.view', label: 'Account settings', group: 'Settings' },
  { key: 'settings.manage', label: 'Manage site settings', group: 'Settings' },
  { key: 'audit.view', label: 'Audit trail', group: 'System' },
  { key: 'users.manage', label: 'Manage users', group: 'System' },
  { key: 'roles.manage', label: 'Manage roles & capabilities', group: 'System' },
  { key: 'courses.learn', label: 'Access courses as student', group: 'LMS' },
  { key: 'courses.author', label: 'Author courses', group: 'LMS' },
  { key: 'lms.manage', label: 'Manage LMS', group: 'LMS' },
  { key: 'enrollments.manage', label: 'Manage enrollments', group: 'LMS' },
  { key: 'orders.view', label: 'View orders', group: 'LMS' },
  { key: 'reviews.moderate', label: 'Moderate reviews', group: 'LMS' },
  { key: 'categories.manage', label: 'Manage course categories', group: 'LMS' },
  { key: 'edusuite.access', label: 'Access EduSuite', group: 'EduSuite' },
  { key: 'edusuite.manage', label: 'Manage EduSuite schools', group: 'EduSuite' },
] as const satisfies readonly CapabilityDef[]

export type CapabilityKey = (typeof ALL_CAPABILITIES)[number]['key']

export const ALL_CAPABILITY_KEYS: CapabilityKey[] = ALL_CAPABILITIES.map((c) => c.key)

export function isCapabilityKey(k: string): k is CapabilityKey {
  return (ALL_CAPABILITY_KEYS as readonly string[]).includes(k)
}

export function toCapabilityPayload(keys: string[]): { key: CapabilityKey }[] {
  return keys.filter(isCapabilityKey).map((key) => ({ key }))
}

export type DashboardMenuChild = {
  label: string
  path: string
  capability: string
}

export type DashboardMenuItem = {
  id: string
  label: string
  path: string
  capabilities: string[]
  children?: DashboardMenuChild[]
}

export const DASHBOARD_MENU: DashboardMenuItem[] = [
  { id: 'home', label: 'Dashboard', path: '/dashboard', capabilities: ['dashboard.home'] },
  { id: 'analytics', label: 'Analytics', path: '/dashboard/analytics', capabilities: ['analytics.view'] },
  { id: 'contacts', label: 'Contacts', path: '/dashboard/contacts', capabilities: ['contacts.manage'] },
  {
    id: 'consultations',
    label: 'Consultations',
    path: '/dashboard/consultations',
    capabilities: ['consultations.manage'],
  },
  { id: 'team', label: 'Team', path: '/dashboard/team', capabilities: ['team.view'] },
  { id: 'careers', label: 'Careers', path: '/dashboard/careers', capabilities: ['careers.manage'] },
  {
    id: 'applications',
    label: 'Applications',
    path: '/dashboard/applications',
    capabilities: ['applications.manage'],
  },
  {
    id: 'cms',
    label: 'CMS',
    path: '/dashboard/cms',
    capabilities: [
      'cms.view',
      'cms.pages.view',
      'cms.media.manage',
      'cms.seo.manage',
      'cms.header.manage',
      'cms.footer.manage',
      'cms.home.manage',
    ],
    children: [
      { label: 'Overview', path: '/dashboard/cms', capability: 'cms.view' },
      { label: 'Pages', path: '/dashboard/cms/pages', capability: 'cms.pages.view' },
      { label: 'Media Library', path: '/dashboard/cms/media', capability: 'cms.media.manage' },
      { label: 'SEO Settings', path: '/dashboard/cms/seo', capability: 'cms.seo.manage' },
      { label: 'Header', path: '/dashboard/cms/header', capability: 'cms.header.manage' },
      { label: 'Footer', path: '/dashboard/cms/footer', capability: 'cms.footer.manage' },
    ],
  },
  { id: 'users', label: 'Users', path: '/dashboard/users', capabilities: ['users.manage'] },
  { id: 'roles', label: 'Roles', path: '/dashboard/roles', capabilities: ['roles.manage'] },
  { id: 'settings', label: 'Settings', path: '/dashboard/settings', capabilities: ['settings.manage'] },
  { id: 'audit', label: 'Audit trail', path: '/dashboard/audit', capabilities: ['audit.view'] },
  {
    id: 'lms',
    label: 'LMS',
    path: '/dashboard/lms',
    capabilities: ['lms.manage', 'orders.view', 'reviews.moderate', 'categories.manage'],
    children: [
      { label: 'Overview', path: '/dashboard/lms', capability: 'lms.manage' },
      { label: 'Courses', path: '/dashboard/lms/courses', capability: 'lms.manage' },
      { label: 'Categories', path: '/dashboard/lms/categories', capability: 'categories.manage' },
      { label: 'Orders', path: '/dashboard/lms/orders', capability: 'orders.view' },
      { label: 'Reviews', path: '/dashboard/lms/reviews', capability: 'reviews.moderate' },
    ],
  },
  {
    id: 'edusuite',
    label: 'EduSuite',
    path: '/edusuite',
    capabilities: ['edusuite.access', 'edusuite.manage'],
  },
]

export const ROUTE_CAPABILITIES: Record<string, string | string[]> = {
  '/dashboard': 'dashboard.home',
  '/dashboard/analytics': 'analytics.view',
  '/dashboard/contacts': 'contacts.manage',
  '/dashboard/consultations': 'consultations.manage',
  '/dashboard/team': 'team.view',
  '/dashboard/careers': 'careers.manage',
  '/dashboard/applications': 'applications.manage',
  '/dashboard/cms': 'cms.view',
  '/dashboard/cms/pages': 'cms.pages.view',
  '/dashboard/cms/media': 'cms.media.manage',
  '/dashboard/cms/seo': 'cms.seo.manage',
  '/dashboard/cms/header': 'cms.header.manage',
  '/dashboard/cms/footer': 'cms.footer.manage',
  '/dashboard/users': 'users.manage',
  '/dashboard/roles': 'roles.manage',
  '/dashboard/settings': 'settings.manage',
  '/dashboard/audit': 'audit.view',
  '/dashboard/lms': 'lms.manage',
  '/dashboard/lms/courses': 'lms.manage',
  '/dashboard/lms/categories': 'categories.manage',
  '/dashboard/lms/orders': 'orders.view',
  '/dashboard/lms/reviews': 'reviews.moderate',
  '/instructor/courses': 'courses.author',
  '/instructor/students': 'courses.author',
  '/instructor/analytics': 'courses.author',
  '/edusuite': ['edusuite.access', 'edusuite.manage'],
}

export const DEFAULT_ROLE_CAPABILITIES: Record<string, string[]> = {
  super_admin: [...ALL_CAPABILITY_KEYS],
  admin: [
    ...ALL_CAPABILITY_KEYS.filter((k) => !['roles.manage', 'settings.manage'].includes(k)),
  ],
  consultant: ['dashboard.home', 'consultations.manage', 'settings.view'],
  student: ['dashboard.home', 'settings.view', 'courses.learn'],
  instructor: ['dashboard.home', 'settings.view', 'courses.author'],
  client: ['dashboard.home', 'settings.view'],
  subscriber: ['dashboard.home', 'settings.view'],
  /** ICMS / EduSuite staff without Hyperion product dashboard */
  tenant_member: [],
}

export function hasCapability(capabilities: string[], required: string): boolean {
  if (capabilities.includes('*')) return true
  if (capabilities.includes(required)) return true
  const wildcard = `${required.split('.')[0]}.*`
  if (capabilities.includes(wildcard)) return true
  return false
}

export function hasAnyCapability(capabilities: string[], required: string[]): boolean {
  return required.some((cap) => hasCapability(capabilities, cap))
}

export function capabilitiesForRoleSlug(roleSlug: string | undefined | null): string[] {
  if (!roleSlug) return []
  if (Object.prototype.hasOwnProperty.call(DEFAULT_ROLE_CAPABILITIES, roleSlug)) {
    return DEFAULT_ROLE_CAPABILITIES[roleSlug] ?? []
  }
  return []
}

export function getRequiredCapabilityForPath(pathname: string): string | string[] | null {
  if (ROUTE_CAPABILITIES[pathname]) return ROUTE_CAPABILITIES[pathname]
  const sorted = Object.keys(ROUTE_CAPABILITIES).sort((a, b) => b.length - a.length)
  for (const route of sorted) {
    if (pathname.startsWith(route + '/') || pathname === route) {
      return ROUTE_CAPABILITIES[route]
    }
  }
  return null
}

export function canAccessPath(capabilities: string[], pathname: string): boolean {
  const required = getRequiredCapabilityForPath(pathname)
  if (!required) return true
  if (Array.isArray(required)) return hasAnyCapability(capabilities, required)
  return hasCapability(capabilities, required)
}
