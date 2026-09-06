import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { cache } from 'react'
import type { IcmsRole } from './roles'
import type {
  CustomDomainStatus,
  IcmsUiVariant,
  TenantConfig,
  TenantColors,
} from './types'

const UI_VARIANTS: IcmsUiVariant[] = [
  'classic',
  'modern',
  'community',
  'scholarly',
  'compact',
]

function normalizeUiVariant(value: unknown): IcmsUiVariant {
  if (typeof value === 'string' && UI_VARIANTS.includes(value as IcmsUiVariant)) {
    return value as IcmsUiVariant
  }
  return 'classic'
}
import { DEFAULT_TENANT_COLORS } from './brand-tokens'
import { ANAS_TENANT } from './fallback'
import {
  ABUJA_PRAYER_LOCATION,
  type PrayerCalculationMethod,
  type PrayerLocationConfig,
  type PrayerMadhab,
} from './prayer-calc'

export type IcmsTenantDoc = {
  id: number | string
  name: string
  slug: string
  shortName: string
  motto?: string | null
  address?: string | null
  phones?: { number?: string | null }[] | null
  email?: string | null
  facebookUrl?: string | null
  instagramUrl?: string | null
  logo?: number | string | { id?: number | string; url?: string | null } | null
  logoUrl?: string | null
  colors?: Partial<TenantColors> | null
  status?: string | null
  planTier?: string | null
  domainLabel?: string | null
  uiVariant?: string | null
  homeSectionOrder?: unknown
  customDomain?: string | null
  customDomainStatus?: string | null
  customDomainError?: string | null
  roleCapabilityOverrides?: { role?: string | null; capabilities?: string[] | null }[] | null
  prayer?: {
    latitude?: number | null
    longitude?: number | null
    timezone?: string | null
    locationLabel?: string | null
    calculationMethod?: string | null
    madhab?: string | null
  } | null
  bank?: {
    bankName?: string | null
    accountName?: string | null
    accountNumber?: string | null
    transferNote?: string | null
  } | null
  paystack?: {
    secretKey?: string | null
    publicKey?: string | null
  } | null
}

export type IcmsMembershipDoc = {
  id: number | string
  role: IcmsRole
  status?: string
  tenant: number | string | IcmsTenantDoc
  user: number | string
}

/** Prefer relative paths so next/image uses localPatterns (avoids localhost hostname errors). */
function toLocalImageSrc(url: string): string {
  try {
    if (url.startsWith('/')) return url
    const parsed = new URL(url)
    if (parsed.pathname.startsWith('/api/media/') || parsed.pathname.startsWith('/tenants/')) {
      return `${parsed.pathname}${parsed.search}`
    }
  } catch {
    // keep original
  }
  return url
}

/** Payload disk media and local /icms/uploads are not durable on Vercel without object storage. */
function isUndurableImagePath(url: string): boolean {
  if (process.env.VERCEL !== '1') return false
  if (url.startsWith('/icms/uploads/')) return true
  if (!url.startsWith('/api/media/')) return false
  return !(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID)
}

function logoUrl(doc: IcmsTenantDoc): string {
  const fallback = `/tenants/${doc.slug}/logo.png`
  if (doc.logoUrl?.trim()) {
    const src = toLocalImageSrc(doc.logoUrl.trim())
    return isUndurableImagePath(src) ? fallback : src
  }
  if (doc.logo && typeof doc.logo === 'object' && doc.logo.url) {
    const src = toLocalImageSrc(doc.logo.url)
    return isUndurableImagePath(src) ? fallback : src
  }
  return fallback
}

export function mapTenantDoc(doc: IcmsTenantDoc): TenantConfig {
  const prayer = resolvePrayerLocation(doc)
  return {
    slug: doc.slug,
    name: doc.name,
    shortName: doc.shortName || doc.name,
    motto: doc.motto || '',
    address: doc.address || '',
    phones: (doc.phones || []).map((p) => p.number).filter(Boolean) as string[],
    email: doc.email || '',
    facebookUrl: doc.facebookUrl?.trim() || undefined,
    instagramUrl: doc.instagramUrl?.trim() || undefined,
    logo: logoUrl(doc),
    colors: { ...DEFAULT_TENANT_COLORS, ...(doc.colors || {}) },
    domainLabel: doc.domainLabel || `${doc.slug}.hyperiontechhub.com`,
    uiVariant: normalizeUiVariant(doc.uiVariant),
    homeSectionOrder: Array.isArray(doc.homeSectionOrder)
      ? (doc.homeSectionOrder as string[])
      : undefined,
    customDomain: doc.customDomain?.trim() || undefined,
    customDomainStatus: (doc.customDomainStatus as CustomDomainStatus) || 'none',
    customDomainError: doc.customDomainError || undefined,
    prayer: {
      latitude: prayer.latitude,
      longitude: prayer.longitude,
      timezone: prayer.timezone,
      calculationMethod: prayer.calculationMethod,
      madhab: prayer.madhab,
      locationLabel: prayer.locationLabel,
    },
    bank: {
      bankName: doc.bank?.bankName || '',
      accountName: doc.bank?.accountName || '',
      accountNumber: doc.bank?.accountNumber || '',
      transferNote: doc.bank?.transferNote || '',
    },
    paystackEnabled: Boolean(doc.paystack?.secretKey?.trim()),
  }
}

/** Server-only — never send this value to the browser */
export function getTenantPaystackSecret(doc: IcmsTenantDoc | null | undefined): string | null {
  const key = doc?.paystack?.secretKey?.trim()
  return key || null
}

/** Resolve calculation config from tenant doc (defaults to Abuja) */
export function resolvePrayerLocation(doc?: IcmsTenantDoc | null): PrayerLocationConfig {
  const p = doc?.prayer
  if (
    p &&
    typeof p.latitude === 'number' &&
    typeof p.longitude === 'number' &&
    Number.isFinite(p.latitude) &&
    Number.isFinite(p.longitude)
  ) {
    return {
      latitude: p.latitude,
      longitude: p.longitude,
      timezone: p.timezone || ABUJA_PRAYER_LOCATION.timezone,
      locationLabel: p.locationLabel || ABUJA_PRAYER_LOCATION.locationLabel,
      calculationMethod: (p.calculationMethod ||
        ABUJA_PRAYER_LOCATION.calculationMethod) as PrayerCalculationMethod,
      madhab: (p.madhab || ABUJA_PRAYER_LOCATION.madhab) as PrayerMadhab,
    }
  }
  return { ...ABUJA_PRAYER_LOCATION }
}

export const getTenantBySlug = cache(async (slug: string): Promise<IcmsTenantDoc | null> => {
  if (!isPayloadEnabled()) {
    if (slug === ANAS_TENANT.slug) {
      return {
        id: 'fallback-anas',
        name: ANAS_TENANT.name,
        slug: ANAS_TENANT.slug,
        shortName: ANAS_TENANT.shortName,
        motto: ANAS_TENANT.motto,
        address: ANAS_TENANT.address,
        phones: ANAS_TENANT.phones.map((number) => ({ number })),
        email: ANAS_TENANT.email,
        logo: null,
        colors: ANAS_TENANT.colors,
        status: 'active',
        planTier: 'professional',
        domainLabel: ANAS_TENANT.domainLabel,
        uiVariant: ANAS_TENANT.uiVariant,
        customDomainStatus: ANAS_TENANT.customDomainStatus || 'none',
        prayer: ANAS_TENANT.prayer,
        bank: ANAS_TENANT.bank,
      }
    }
    return null
  }

  const payload = await getPayloadSingleton()
  const result = await payload.find({
    collection: 'icms-tenants',
    where: {
      and: [
        { slug: { equals: slug } },
        { status: { not_equals: 'suspended' } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return (result.docs[0] as IcmsTenantDoc | undefined) || null
})

export async function getTenantConfig(slug: string): Promise<TenantConfig | null> {
  const doc = await getTenantBySlug(slug)
  if (!doc) return null
  return mapTenantDoc(doc)
}

export async function listTenants(): Promise<TenantConfig[]> {
  if (!isPayloadEnabled()) return [ANAS_TENANT]

  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'icms-tenants',
      where: { status: { not_equals: 'suspended' } },
      limit: 100,
      depth: 0,
      sort: 'name',
      overrideAccess: true,
    })
    return (result.docs as IcmsTenantDoc[]).map(mapTenantDoc)
  } catch {
    return [ANAS_TENANT]
  }
}

export async function listTenantDocs(): Promise<IcmsTenantDoc[]> {
  if (!isPayloadEnabled()) return []
  const payload = await getPayloadSingleton()
  const result = await payload.find({
    collection: 'icms-tenants',
    limit: 100,
    depth: 0,
    sort: 'name',
    overrideAccess: true,
  })
  return result.docs as IcmsTenantDoc[]
}

/** Sync helper for pages that previously used getTenant(slug) */
export function getTenant(slug: string): TenantConfig | null {
  // Sync fallback only — prefer getTenantConfig in async server components
  if (slug === ANAS_TENANT.slug) return ANAS_TENANT
  return null
}

export { ANAS_TENANT }
