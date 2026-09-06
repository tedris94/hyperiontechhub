import type { IcmsUiVariant } from './types'

export type HomeSectionId = 'hero' | 'prayer' | 'events' | 'waqf' | 'articles' | 'findUs'

export const HOME_SECTION_IDS: HomeSectionId[] = [
  'hero',
  'prayer',
  'events',
  'articles',
  'waqf',
  'findUs',
]

export const HOME_SECTION_LABELS: Record<HomeSectionId, { title: string; hint: string }> = {
  hero: { title: 'Hero', hint: 'Opening banner, motto, and donate / prayer buttons' },
  prayer: { title: 'Prayer times', hint: "Today's salah strip" },
  events: { title: 'Upcoming events', hint: "What's happening at the centre" },
  articles: { title: 'Articles', hint: 'Knowledge & Reflection' },
  waqf: { title: 'Waqf & endowments', hint: 'Legacy / campaign block' },
  findUs: { title: 'Find us / Support', hint: 'Location, contact, and donate CTA' },
}

export type HeaderStyle = 'classic' | 'slim' | 'quiet' | 'minimal'
export type FooterStyle = 'classic' | 'compact' | 'centered'
export type HeroStyle = 'forest' | 'split' | 'light' | 'centered' | 'compact'

export type UiVariantDef = {
  id: IcmsUiVariant
  label: string
  description: string
  homeSectionOrder: HomeSectionId[]
  headerStyle: HeaderStyle
  footerStyle: FooterStyle
  heroStyle: HeroStyle
  /** Extra class on .icms-root (beyond data-ui-variant) */
  rootClassName?: string
}

export const UI_VARIANT_DEFS: Record<IcmsUiVariant, UiVariantDef> = {
  classic: {
    id: 'classic',
    label: 'Classic',
    description: 'Forest hero, gold rules, traditional centre presentation.',
    homeSectionOrder: ['hero', 'prayer', 'events', 'articles', 'waqf', 'findUs'],
    headerStyle: 'classic',
    footerStyle: 'classic',
    heroStyle: 'forest',
  },
  modern: {
    id: 'modern',
    label: 'Modern',
    description: 'Slim nav, light/split hero, cleaner chrome.',
    homeSectionOrder: ['hero', 'prayer', 'events', 'articles', 'waqf', 'findUs'],
    headerStyle: 'slim',
    footerStyle: 'compact',
    heroStyle: 'split',
    rootClassName: 'icms-variant-modern',
  },
  community: {
    id: 'community',
    label: 'Community',
    description: 'Prayer-first home, denser sections, warmer emphasis.',
    homeSectionOrder: ['prayer', 'hero', 'events', 'articles', 'waqf', 'findUs'],
    headerStyle: 'classic',
    footerStyle: 'classic',
    heroStyle: 'light',
    rootClassName: 'icms-variant-community',
  },
  scholarly: {
    id: 'scholarly',
    label: 'Scholarly',
    description: 'Centered serif-forward heroes, quieter nav, long-read spacing.',
    homeSectionOrder: ['hero', 'articles', 'events', 'prayer', 'waqf', 'findUs'],
    headerStyle: 'quiet',
    footerStyle: 'centered',
    heroStyle: 'centered',
    rootClassName: 'icms-variant-scholarly',
  },
  compact: {
    id: 'compact',
    label: 'Compact',
    description: 'Minimal header, tighter rhythm, stacked CTAs.',
    homeSectionOrder: ['hero', 'prayer', 'events', 'findUs', 'waqf', 'articles'],
    headerStyle: 'minimal',
    footerStyle: 'compact',
    heroStyle: 'compact',
    rootClassName: 'icms-variant-compact',
  },
}

export const UI_VARIANT_LIST = Object.values(UI_VARIANT_DEFS)

export function getUiVariant(id?: string | null): UiVariantDef {
  if (id && id in UI_VARIANT_DEFS) return UI_VARIANT_DEFS[id as IcmsUiVariant]
  return UI_VARIANT_DEFS.classic
}

const SECTION_SET = new Set<string>(HOME_SECTION_IDS)

/** Accept saved tenant JSON / arrays; fill any missing sections from the layout-pack default. */
export function normalizeHomeSectionOrder(
  saved: unknown,
  fallback: HomeSectionId[] = HOME_SECTION_IDS,
): HomeSectionId[] {
  const fromSaved: HomeSectionId[] = []
  const seen = new Set<HomeSectionId>()
  const raw = Array.isArray(saved)
    ? saved
    : typeof saved === 'string'
      ? saved.split(',')
      : []
  for (const item of raw) {
    const id = (typeof item === 'string' ? item : (item as { section?: string })?.section)?.trim()
    if (!id || !SECTION_SET.has(id) || seen.has(id as HomeSectionId)) continue
    const section = id as HomeSectionId
    fromSaved.push(section)
    seen.add(section)
  }
  for (const id of fallback) {
    if (!seen.has(id)) {
      fromSaved.push(id)
      seen.add(id)
    }
  }
  return fromSaved
}

export function resolveHomeSectionOrder(
  saved: unknown,
  uiVariant?: string | null,
): HomeSectionId[] {
  const pack = getUiVariant(uiVariant).homeSectionOrder
  if (saved == null || (Array.isArray(saved) && saved.length === 0)) return [...pack]
  return normalizeHomeSectionOrder(saved, pack)
}

export function tenantSubdomainHost(slug: string): string {
  return `${slug}.hyperiontechhub.com`
}
