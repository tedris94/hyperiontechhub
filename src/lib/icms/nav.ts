import type { IcmsNavItem } from './types'

export const DEFAULT_ICMS_NAVIGATION: IcmsNavItem[] = [
  { label: 'About', href: 'about', placement: 'primary' },
  { label: 'Mosque', href: 'mosque', placement: 'primary' },
  { label: 'Islamiya', href: 'islamiyyah', placement: 'primary' },
  { label: 'Events', href: 'events', placement: 'primary' },
  { label: 'Articles', href: 'articles', placement: 'primary' },
  { label: 'Contact Us', href: 'contact', placement: 'primary' },
  { label: 'Khutba', href: 'khutba', placement: 'more' },
  { label: 'Dawah', href: 'dawah', placement: 'more' },
  { label: 'Zakah', href: 'zakah', placement: 'more' },
  { label: 'Ramadan', href: 'ramadan', placement: 'more' },
  { label: 'Waqf', href: 'waqf', placement: 'more' },
  { label: 'Shurah', href: 'committee', placement: 'more' },
]

/** Anas bn Malik has no Shurah; Islamiya spelling; same structure otherwise. */
export const ANAS_ICMS_NAVIGATION: IcmsNavItem[] = DEFAULT_ICMS_NAVIGATION.filter(
  (item) => item.href !== 'committee',
)

function normalizeNavigation(
  value: unknown,
  fallback: IcmsNavItem[] = DEFAULT_ICMS_NAVIGATION,
): IcmsNavItem[] {
  if (!Array.isArray(value)) return fallback
  const items = value
    .map((item) => {
      const record = item as Record<string, unknown>
      const label = typeof record.label === 'string' ? record.label.trim() : ''
      const href =
        typeof record.href === 'string' ? record.href.trim().replace(/^\/+|\/+$/g, '') : ''
      const placement = record.placement === 'more' ? 'more' : 'primary'
      return label && href ? { label, href, placement } : null
    })
    .filter(Boolean) as IcmsNavItem[]
  return items.length ? items : fallback
}

/** Tenant-aware nav: Anas never shows Shurah; Islamiyyah labels become Islamiya. */
export function resolveTenantNavigation(slug: string, value: unknown): IcmsNavItem[] {
  const isAnas = slug === 'anas-bn-malik'
  const fallback = isAnas ? ANAS_ICMS_NAVIGATION : DEFAULT_ICMS_NAVIGATION
  let items = normalizeNavigation(value, fallback)
  if (isAnas) {
    items = items
      .filter((item) => item.href !== 'committee')
      .map((item) =>
        item.href === 'islamiyyah' || /^islamiy+ah$/i.test(item.label)
          ? { ...item, label: 'Islamiya' }
          : item,
      )
  } else {
    items = items.map((item) =>
      item.href === 'islamiyyah' && /islamiyyah|islamia/i.test(item.label)
        ? { ...item, label: 'Islamiya' }
        : item,
    )
  }
  return items
}
