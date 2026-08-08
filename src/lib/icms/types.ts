export type TenantColors = {
  emerald: string
  forest: string
  gold: string
  ivory: string
  charcoal: string
  warmGray: string
}

export type IcmsUiVariant =
  | 'classic'
  | 'modern'
  | 'community'
  | 'scholarly'
  | 'compact'

export type CustomDomainStatus =
  | 'none'
  | 'pending_dns'
  | 'pending_ssl'
  | 'active'
  | 'error'

export type TenantConfig = {
  slug: string
  name: string
  shortName: string
  motto: string
  address: string
  phones: string[]
  email: string
  logo: string
  colors: TenantColors
  /** Primary public host display string */
  domainLabel: string
  /** Public layout pack */
  uiVariant: IcmsUiVariant
  /** Connected custom hostname (normalized), if any */
  customDomain?: string
  customDomainStatus?: CustomDomainStatus
  customDomainError?: string
  /** Prayer calculation — user sets location; times are computed live */
  prayer?: {
    latitude: number
    longitude: number
    timezone: string
    calculationMethod: string
    madhab: string
    locationLabel: string
  }
  /** Manual transfer account for donations */
  bank?: {
    bankName: string
    accountName: string
    accountNumber: string
    transferNote?: string
  }
  /** True when this tenant has its own Paystack secret configured (never expose the secret) */
  paystackEnabled?: boolean
}

export type IslamiyyahClass = {
  id: string
  title: string
  schedule: string
  ageGroup: string
  teacher: string
  capacity: number
  enrolled: number
  status: string
  summary: string
}

export type IslamiyyahStudent = {
  id: string
  name: string
  guardian: string
  phone: string
  classTitle: string
  status: string
}

export type PrayerTime = {
  name: string
  time: string
}

export type Leader = {
  id: string
  name: string
  role: string
  bio: string
  category: 'imam' | 'director' | 'committee'
  photoUrl?: string
  sortOrder?: number
}

export type CommitteeType =
  | 'shurah'
  | 'hr'
  | 'waqf'
  | 'education'
  | 'outreach'
  | 'finance'
  | 'other'

export type CommitteeMemberStatus = 'active' | 'inactive' | 'past'

export type CommitteeMember = {
  id: string
  name: string
  roleTitle: string
  committeeType: CommitteeType
  status: CommitteeMemberStatus
  phone?: string
  email?: string
  termStart?: string
  termEnd?: string
  bio?: string
  photoUrl?: string
  notes?: string
  sortOrder?: number
  showOnPublic?: boolean
}

export type EventItem = {
  id: string
  title: string
  date: string
  time: string
  venue: string
  blurb: string
  featured?: boolean
  category?: string
}

export type Article = {
  id: string
  slug: string
  title: string
  category: string
  date: string
  author: string
  excerpt: string
  body: string[]
  status: 'published' | 'draft'
  coverImageUrl?: string
}

export type WaqfProject = {
  id: string
  title: string
  summary: string
  status: string
  progress: number
  description?: string
  goalAmount?: number
  raisedAmount?: number
  updates?: { date?: string; note: string }[]
}

export type DonationTxn = {
  id: string
  reference?: string
  donor: string
  amount: number
  fund: string
  status: string
  date: string
}

export type PageContent = {
  pageKey: string
  heroTitle?: string
  heroSubtitle?: string
  introHeading?: string
  introBody?: string
  blocks?: { title: string; body: string }[]
  missionHeading?: string
  missionItems?: string[]
  visionItems?: string[]
  imageUrl?: string
  arabicText?: string
  arabicCaption?: string
  officeHours?: { label: string; value: string }[]
  jumuahNote?: string
  supportBlurb?: string
  waqfGoalAmount?: number
  formSubjects?: string[]
  /** Home (+ reusable) section labels */
  ctaPrimaryLabel?: string
  ctaSecondaryLabel?: string
  prayerHeading?: string
  eventsEyebrow?: string
  eventsHeading?: string
  eventsCtaLabel?: string
  waqfEyebrow?: string
  waqfHeading?: string
  waqfBody?: string
  waqfCtaLabel?: string
  articlesEyebrow?: string
  articlesHeading?: string
  articlesCtaLabel?: string
  findUsEyebrow?: string
  findUsHeading?: string
  contactEyebrow?: string
  contactHeading?: string
  supportEyebrow?: string
  supportHeading?: string
  supportCtaLabel?: string
  /** About page section labels */
  storyEyebrow?: string
  purposeEyebrow?: string
  mapCtaLabel?: string
}

export type FacilityItem = {
  id: string
  title: string
  description: string
}

export type DonateFund = {
  id: string
  key: string
  label: string
  description: string
  impactLines: { amountLabel: string; effect: string }[]
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  status: string
  createdAt?: string
}
