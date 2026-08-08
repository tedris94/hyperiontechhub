import type { TenantConfig } from './types'
import { DEFAULT_TENANT_COLORS } from './brand-tokens'

/** Static fallback when Payload/DB is unavailable (local without DATABASE_URI). */
export const ANAS_TENANT: TenantConfig = {
  slug: 'anas-bn-malik',
  name: 'Anas bn Malik Islamic Center',
  shortName: 'Anas bn Malik',
  motto: 'STRIVING IN THE CAUSE OF ALLAH',
  address: 'AMSSCO Platinum City Estate, Plot 312 Galadimawa District, Abuja FCT',
  phones: ['08062252510', '08034416661'],
  email: 'info@anasbnmalik.org',
  logo: '/tenants/anas-bn-malik/logo.png',
  colors: { ...DEFAULT_TENANT_COLORS },
  domainLabel: 'anas-bn-malik.hyperiontechhub.com',
  uiVariant: 'classic',
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
    accountName: 'Anas bn Malik Islamic Center',
    accountNumber: '0123456789',
    transferNote:
      'Use your full name and donation purpose (e.g. Zakat / Sadaqah) as the transfer narration.',
  },
  paystackEnabled: false,
}
