import type { TenantColors } from '@/lib/icms/types'

/** Canonical Hyperion ICMS brand palette — defaults for every tenant. */
export const DEFAULT_TENANT_COLORS: TenantColors = {
  emerald: '#0F5A43',
  forest: '#07382B',
  gold: '#C79A2C',
  ivory: '#FAF8F2',
  charcoal: '#1E1E1E',
  warmGray: '#6F6F6F',
}

export type BrandTokenDef = {
  key: keyof TenantColors
  name: string
  hex: string
  cssVar: string
  usage: string
  ratioHint: string
}

export const BRAND_TOKEN_DEFS: BrandTokenDef[] = [
  {
    key: 'emerald',
    name: 'Emerald',
    hex: DEFAULT_TENANT_COLORS.emerald,
    cssVar: '--icms-emerald',
    usage: 'Primary actions, links, key UI emphasis',
    ratioHint: '~25% with Forest',
  },
  {
    key: 'forest',
    name: 'Forest',
    hex: DEFAULT_TENANT_COLORS.forest,
    cssVar: '--icms-forest',
    usage: 'Dark sections, footer, sidebar, headings',
    ratioHint: '~25% with Emerald',
  },
  {
    key: 'gold',
    name: 'Gold',
    hex: DEFAULT_TENANT_COLORS.gold,
    cssVar: '--icms-gold',
    usage: 'Accents, rules, secondary emphasis, eyebrows',
    ratioHint: '~10%',
  },
  {
    key: 'ivory',
    name: 'Ivory',
    hex: DEFAULT_TENANT_COLORS.ivory,
    cssVar: '--icms-ivory',
    usage: 'Page background and light surfaces',
    ratioHint: '~60%',
  },
  {
    key: 'charcoal',
    name: 'Charcoal',
    hex: DEFAULT_TENANT_COLORS.charcoal,
    cssVar: '--icms-charcoal',
    usage: 'Body text',
    ratioHint: '~5% with Warm gray',
  },
  {
    key: 'warmGray',
    name: 'Warm gray',
    hex: DEFAULT_TENANT_COLORS.warmGray,
    cssVar: '--icms-warm-gray',
    usage: 'Muted labels, captions, secondary copy',
    ratioHint: '~5% with Charcoal',
  },
]

export const BRAND_RATIO_COPY =
  'Ratio: ~60% ivory, 25% emerald/forest, 10% gold, 5% gray/black.'

export const BRAND_TYPOGRAPHY = [
  {
    id: 'display',
    role: 'Display / headings',
    family: 'Cinzel',
    weights: 'Bold for H1, SemiBold for H2',
    className: 'icms-display',
    sample: 'Heading — Islamic Center',
  },
  {
    id: 'body',
    role: 'UI / body',
    family: 'Montserrat',
    weights: 'Regular, Medium, SemiBold',
    className: '',
    sample: 'Body copy for forms, navigation, and paragraphs.',
  },
  {
    id: 'arabic',
    role: 'Arabic verses',
    family: 'Amiri',
    weights: 'Regular, Bold',
    className: 'icms-arabic',
    sample: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  },
] as const

/** Normalize user input to #RRGGBB when possible. */
export function normalizeHex(input: string, fallback: string): string {
  const raw = input.trim()
  const withHash = raw.startsWith('#') ? raw : `#${raw}`
  if (/^#[0-9A-Fa-f]{6}$/.test(withHash)) return withHash.toUpperCase()
  if (/^#[0-9A-Fa-f]{3}$/.test(withHash)) {
    const [, r, g, b] = withHash
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
  }
  return fallback
}
