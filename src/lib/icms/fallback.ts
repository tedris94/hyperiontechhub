import type { TenantConfig } from './types'
import { DEFAULT_TENANT_COLORS } from './brand-tokens'

/** Static fallback when Payload/DB is unavailable (local without DATABASE_URI). */
export const ANAS_TENANT: TenantConfig = {
  slug: 'anas-bn-malik',
  name: 'Anas Bin Malik Islamic School',
  shortName: 'Anas Bin Malik',
  motto: 'KNOWLEDGE. CHARACTER. QUR’AN.',
  address: 'AMMSSCO Platinum City, Galadimawa, Abuja',
  phones: ['08063237993', '09018909640'],
  email: 'info@anasbnmalik.org',
  logo: '/tenants/anas-bn-malik/logo.png',
  colors: { ...DEFAULT_TENANT_COLORS },
  domainLabel: 'anas-bn-malik.hyperiontechhub.com',
  uiVariant: 'classic',
  homeSectionOrder: ['hero', 'prayer', 'events', 'articles', 'waqf', 'findUs'],
  customDomainStatus: 'none',
  prayer: {
    latitude: 9.0145,
    longitude: 7.3986,
    timezone: 'Africa/Lagos',
    calculationMethod: 'MuslimWorldLeague',
    madhab: 'Shafi',
    locationLabel: 'Abuja, FCT',
  },
  bank: {
    bankName: 'Guaranty Trust Bank',
    accountName: 'Anas Bin Malik Islamic School',
    accountNumber: '0123456789',
    transferNote:
      'Use your full name and donation purpose (e.g. Zakat / Sadaqah) as the transfer narration.',
  },
  paystackEnabled: false,
}
