import type { IcmsUiVariant } from './types'

export type HomeSectionId = 'hero' | 'prayer' | 'events' | 'waqf' | 'articles' | 'findUs'

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
    homeSectionOrder: ['hero', 'prayer', 'events', 'waqf', 'articles', 'findUs'],
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
    homeSectionOrder: ['prayer', 'hero', 'events', 'waqf', 'findUs', 'articles'],
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

export function tenantSubdomainHost(slug: string): string {
  return `${slug}.hyperiontechhub.com`
}
