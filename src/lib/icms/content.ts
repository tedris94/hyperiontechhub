import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import type {
  Article,
  CommitteeMember,
  ContactMessage,
  DonateFund,
  DonationTxn,
  EventItem,
  FacilityItem,
  IslamiyyahClass,
  IslamiyyahStudent,
  Leader,
  PageContent,
  PrayerTime,
  WaqfProject,
} from './types'
import {
  articles as fallbackArticles,
  committeeMembers as fallbackCommitteeMembers,
  donations as fallbackDonations,
  events as fallbackEvents,
  leaders as fallbackLeaders,
  waqfProjects as fallbackWaqf,
  islamiyyahClasses as fallbackClasses,
  islamiyyahStudents as fallbackStudents,
  publishedArticles as fallbackPublished,
  getArticleBySlug as fallbackGetArticle,
  formatNaira,
  formatDisplayDate,
} from './demo-data'
import {
  ABUJA_PRAYER_LOCATION,
  calculatePrayerTimesForDate,
  calculateWeeklyPrayerRows,
  type PrayerLocationConfig,
  type WeeklyPrayerRow,
} from './prayer-calc'
import { resolvePrayerLocation, type IcmsTenantDoc } from './tenants'

export { formatNaira, formatDisplayDate }
export type { WeeklyPrayerRow }

function tenantId(id: string | number) {
  return id
}

/** Load tenant prayer location settings (coords + method). Times are never stored. */
export async function getPrayerLocationForTenant(
  tenantIdValue: string | number,
): Promise<PrayerLocationConfig> {
  if (!isPayloadEnabled() || String(tenantIdValue).startsWith('fallback')) {
    return ABUJA_PRAYER_LOCATION
  }
  try {
    const payload = await getPayloadSingleton()
    const doc = await payload.findByID({
      collection: 'icms-tenants',
      id: tenantIdValue,
      overrideAccess: true,
    })
    return resolvePrayerLocation(doc as IcmsTenantDoc)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getPrayerLocationForTenant]', error)
    }
    return ABUJA_PRAYER_LOCATION
  }
}

/** Live Adhan calculation for today (Al-Moazin-style) */
export async function getPrayerTimesToday(tenantIdValue: string | number): Promise<PrayerTime[]> {
  const loc = await getPrayerLocationForTenant(tenantIdValue)
  return calculatePrayerTimesForDate(loc, new Date())
}

/** Live weekly matrix Mon–Sun from location settings */
export async function getWeeklyPrayerRows(
  tenantIdValue: string | number,
): Promise<WeeklyPrayerRow[]> {
  const loc = await getPrayerLocationForTenant(tenantIdValue)
  return calculateWeeklyPrayerRows(loc, new Date())
}

export async function getLeaders(tenantIdValue: string | number): Promise<Leader[]> {
  if (!isPayloadEnabled() || String(tenantIdValue).startsWith('fallback')) {
    return fallbackLeaders
  }
  const payload = await getPayloadSingleton()
  const result = await payload.find({
    collection: 'icms-leaders',
    where: { tenant: { equals: tenantId(tenantIdValue) } },
    sort: 'sortOrder',
    limit: 100,
    overrideAccess: true,
  })
  return result.docs.map((d) => ({
    id: String(d.id),
    name: String(d.name),
    role: String(d.roleTitle),
    bio: String(d.bio || ''),
    category: d.category as Leader['category'],
    photoUrl: d.photoUrl ? String(d.photoUrl) : undefined,
    sortOrder: d.sortOrder != null ? Number(d.sortOrder) : undefined,
  }))
}

function mapCommitteeDoc(d: Record<string, unknown>): CommitteeMember {
  return {
    id: String(d.id),
    name: String(d.name),
    roleTitle: String(d.roleTitle),
    committeeType: d.committeeType as CommitteeMember['committeeType'],
    status: d.status as CommitteeMember['status'],
    phone: d.phone ? String(d.phone) : undefined,
    email: d.email ? String(d.email) : undefined,
    termStart: d.termStart ? String(d.termStart).slice(0, 10) : undefined,
    termEnd: d.termEnd ? String(d.termEnd).slice(0, 10) : undefined,
    bio: d.bio ? String(d.bio) : undefined,
    photoUrl: d.photoUrl ? String(d.photoUrl) : undefined,
    notes: d.notes ? String(d.notes) : undefined,
    sortOrder: d.sortOrder != null ? Number(d.sortOrder) : undefined,
    showOnPublic: d.showOnPublic !== false,
  }
}

/** Full roster for admin (includes inactive / past / private). */
export async function getCommitteeMembers(
  tenantIdValue: string | number,
): Promise<CommitteeMember[]> {
  if (!isPayloadEnabled() || String(tenantIdValue).startsWith('fallback')) {
    return fallbackCommitteeMembers
  }
  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'icms-committee-members',
      where: { tenant: { equals: tenantId(tenantIdValue) } },
      sort: 'sortOrder',
      limit: 200,
      overrideAccess: true,
    })
    if (!result.docs.length) return fallbackCommitteeMembers
    return result.docs.map((d) => mapCommitteeDoc(d as unknown as Record<string, unknown>))
  } catch {
    return fallbackCommitteeMembers
  }
}

/** Public Shurah page — active members marked showOnPublic. */
export async function getPublicCommitteeMembers(
  tenantIdValue: string | number,
): Promise<CommitteeMember[]> {
  const all = await getCommitteeMembers(tenantIdValue)
  return all.filter((m) => m.status === 'active' && m.showOnPublic !== false)
}

export async function getEvents(tenantIdValue: string | number): Promise<EventItem[]> {
  if (!isPayloadEnabled() || String(tenantIdValue).startsWith('fallback')) {
    return fallbackEvents
  }
  const payload = await getPayloadSingleton()
  const result = await payload.find({
    collection: 'icms-events',
    where: { tenant: { equals: tenantId(tenantIdValue) } },
    sort: 'eventDate',
    limit: 50,
    overrideAccess: true,
  })
  return result.docs.map((d) => ({
    id: String(d.id),
    title: String(d.title),
    date: String(d.eventDate).slice(0, 10),
    time: String(d.time || ''),
    venue: String(d.venue || ''),
    blurb: String(d.blurb || ''),
    featured: Boolean(d.featured),
    category: d.category ? String(d.category) : undefined,
  }))
}

export async function getPublishedArticles(tenantIdValue: string | number): Promise<Article[]> {
  if (!isPayloadEnabled() || String(tenantIdValue).startsWith('fallback')) {
    return fallbackPublished()
  }
  const payload = await getPayloadSingleton()
  const result = await payload.find({
    collection: 'icms-articles',
    where: {
      and: [
        { tenant: { equals: tenantId(tenantIdValue) } },
        { status: { equals: 'published' } },
      ],
    },
    sort: '-publishedAt',
    limit: 50,
    overrideAccess: true,
  })
  return result.docs.map(mapArticle)
}

export async function getAllArticles(tenantIdValue: string | number): Promise<Article[]> {
  if (!isPayloadEnabled() || String(tenantIdValue).startsWith('fallback')) {
    return fallbackArticles
  }
  const payload = await getPayloadSingleton()
  const result = await payload.find({
    collection: 'icms-articles',
    where: { tenant: { equals: tenantId(tenantIdValue) } },
    sort: '-updatedAt',
    limit: 100,
    overrideAccess: true,
  })
  return result.docs.map(mapArticle)
}

export async function getArticleBySlug(
  tenantIdValue: string | number,
  slug: string,
): Promise<Article | undefined> {
  if (!isPayloadEnabled() || String(tenantIdValue).startsWith('fallback')) {
    return fallbackGetArticle(slug)
  }
  const payload = await getPayloadSingleton()
  const result = await payload.find({
    collection: 'icms-articles',
    where: {
      and: [
        { tenant: { equals: tenantId(tenantIdValue) } },
        { slug: { equals: slug } },
        { status: { equals: 'published' } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  })
  const doc = result.docs[0]
  return doc ? mapArticle(doc) : undefined
}

function mapArticle(d: Record<string, unknown>): Article {
  const body = Array.isArray(d.body)
    ? (d.body as { paragraph?: string }[]).map((b) => String(b.paragraph || '')).filter(Boolean)
    : []
  return {
    id: String(d.id),
    slug: String(d.slug),
    title: String(d.title),
    category: String(d.category || ''),
    date: String(d.publishedAt || d.updatedAt || '').slice(0, 10),
    author: String(d.author || ''),
    excerpt: String(d.excerpt || ''),
    body,
    status: (d.status as Article['status']) || 'draft',
    coverImageUrl: d.coverImageUrl ? String(d.coverImageUrl) : undefined,
  }
}

export async function getWaqfProjects(tenantIdValue: string | number): Promise<WaqfProject[]> {
  if (!isPayloadEnabled() || String(tenantIdValue).startsWith('fallback')) {
    return fallbackWaqf
  }
  const payload = await getPayloadSingleton()
  const result = await payload.find({
    collection: 'icms-waqf-projects',
    where: { tenant: { equals: tenantId(tenantIdValue) } },
    limit: 50,
    overrideAccess: true,
  })
  return result.docs.map((d) => ({
    id: String(d.id),
    title: String(d.title),
    summary: String(d.summary || ''),
    status: String(d.status || 'Active'),
    progress: Number(d.progress || 0),
    description: d.description ? String(d.description) : undefined,
    goalAmount: d.goalAmount != null ? Number(d.goalAmount) : undefined,
    raisedAmount: d.raisedAmount != null ? Number(d.raisedAmount) : undefined,
    updates: Array.isArray(d.updates)
      ? (d.updates as { date?: string; note?: string }[]).map((u) => ({
          date: u.date ? String(u.date).slice(0, 10) : undefined,
          note: String(u.note || ''),
        }))
      : undefined,
  }))
}

export async function getDonations(tenantIdValue: string | number): Promise<DonationTxn[]> {
  if (!isPayloadEnabled() || String(tenantIdValue).startsWith('fallback')) {
    return fallbackDonations
  }
  const payload = await getPayloadSingleton()
  const result = await payload.find({
    collection: 'icms-donations',
    where: { tenant: { equals: tenantId(tenantIdValue) } },
    sort: '-donatedAt',
    limit: 100,
    overrideAccess: true,
  })
  return result.docs.map((d) => ({
    // Always use Payload document id for React keys — reference may be duplicated across seeds
    id: String(d.id),
    reference: String(d.reference || d.id),
    donor: String(d.donor),
    amount: Number(d.amount),
    fund: String(d.fund),
    status: String(d.status || 'Completed'),
    date: String(d.donatedAt).slice(0, 10),
  }))
}

export async function getIslamiyyahClasses(
  tenantIdValue: string | number,
): Promise<IslamiyyahClass[]> {
  if (!isPayloadEnabled() || String(tenantIdValue).startsWith('fallback')) {
    return fallbackClasses
  }
  const payload = await getPayloadSingleton()
  const result = await payload.find({
    collection: 'icms-islamiyyah-classes',
    where: { tenant: { equals: tenantId(tenantIdValue) } },
    sort: 'title',
    limit: 100,
    overrideAccess: true,
  })
  return result.docs.map((d) => ({
    id: String(d.id),
    title: String(d.title),
    schedule: String(d.schedule || ''),
    ageGroup: String(d.ageGroup || ''),
    teacher: String(d.teacher || ''),
    capacity: Number(d.capacity || 0),
    enrolled: Number(d.enrolled || 0),
    status: String(d.status || 'Open'),
    summary: String(d.summary || ''),
  }))
}

export async function getIslamiyyahStudents(
  tenantIdValue: string | number,
): Promise<IslamiyyahStudent[]> {
  if (!isPayloadEnabled() || String(tenantIdValue).startsWith('fallback')) {
    return fallbackStudents
  }
  const payload = await getPayloadSingleton()
  const result = await payload.find({
    collection: 'icms-islamiyyah-students',
    where: { tenant: { equals: tenantId(tenantIdValue) } },
    sort: 'name',
    limit: 200,
    depth: 1,
    overrideAccess: true,
  })
  return result.docs.map((d) => {
    const classRef = d.classRef
    let classTitle = ''
    if (classRef && typeof classRef === 'object' && 'title' in classRef) {
      classTitle = String((classRef as { title?: string }).title || '')
    }
    return {
      id: String(d.id),
      name: String(d.name),
      guardian: String(d.guardian || ''),
      phone: String(d.phone || ''),
      classTitle,
      status: String(d.status || 'Active'),
    }
  })
}

export async function getDashboardCounts(tenantIdValue: string | number) {
  const [dons, evts, arts, classes] = await Promise.all([
    getDonations(tenantIdValue),
    getEvents(tenantIdValue),
    getPublishedArticles(tenantIdValue),
    getIslamiyyahClasses(tenantIdValue),
  ])
  return {
    donationTotal: dons.reduce((s, d) => s + d.amount, 0),
    eventCount: evts.length,
    articleCount: arts.length,
    classCount: classes.length,
    donations: dons,
    events: evts,
  }
}

function mapPageDoc(d: Record<string, unknown>): PageContent {
  const blocks = Array.isArray(d.blocks)
    ? (d.blocks as { title?: string; body?: string }[]).map((b) => ({
        title: String(b.title || ''),
        body: String(b.body || ''),
      }))
    : []
  const missionItems = Array.isArray(d.missionItems)
    ? (d.missionItems as { text?: string }[]).map((i) => String(i.text || '')).filter(Boolean)
    : []
  const visionItems = Array.isArray(d.visionItems)
    ? (d.visionItems as { text?: string }[]).map((i) => String(i.text || '')).filter(Boolean)
    : []
  const officeHours = Array.isArray(d.officeHours)
    ? (d.officeHours as { label?: string; value?: string }[]).map((h) => ({
        label: String(h.label || ''),
        value: String(h.value || ''),
      }))
    : []
  const formSubjects = Array.isArray(d.formSubjects)
    ? (d.formSubjects as { label?: string }[]).map((s) => String(s.label || '')).filter(Boolean)
    : []

  return {
    pageKey: String(d.pageKey),
    heroTitle: d.heroTitle ? String(d.heroTitle) : undefined,
    heroSubtitle: d.heroSubtitle ? String(d.heroSubtitle) : undefined,
    introHeading: d.introHeading ? String(d.introHeading) : undefined,
    introBody: d.introBody ? String(d.introBody) : undefined,
    blocks,
    missionHeading: d.missionHeading ? String(d.missionHeading) : undefined,
    missionItems,
    visionItems,
    imageUrl: d.imageUrl ? String(d.imageUrl) : undefined,
    arabicText: d.arabicText ? String(d.arabicText) : undefined,
    arabicCaption: d.arabicCaption ? String(d.arabicCaption) : undefined,
    officeHours,
    jumuahNote: d.jumuahNote ? String(d.jumuahNote) : undefined,
    supportBlurb: d.supportBlurb ? String(d.supportBlurb) : undefined,
    waqfGoalAmount: d.waqfGoalAmount != null ? Number(d.waqfGoalAmount) : undefined,
    formSubjects,
    ctaPrimaryLabel: d.ctaPrimaryLabel ? String(d.ctaPrimaryLabel) : undefined,
    ctaSecondaryLabel: d.ctaSecondaryLabel ? String(d.ctaSecondaryLabel) : undefined,
    prayerHeading: d.prayerHeading ? String(d.prayerHeading) : undefined,
    eventsEyebrow: d.eventsEyebrow ? String(d.eventsEyebrow) : undefined,
    eventsHeading: d.eventsHeading ? String(d.eventsHeading) : undefined,
    eventsCtaLabel: d.eventsCtaLabel ? String(d.eventsCtaLabel) : undefined,
    waqfEyebrow: d.waqfEyebrow ? String(d.waqfEyebrow) : undefined,
    waqfHeading: d.waqfHeading ? String(d.waqfHeading) : undefined,
    waqfBody: d.waqfBody ? String(d.waqfBody) : undefined,
    waqfCtaLabel: d.waqfCtaLabel ? String(d.waqfCtaLabel) : undefined,
    articlesEyebrow: d.articlesEyebrow ? String(d.articlesEyebrow) : undefined,
    articlesHeading: d.articlesHeading ? String(d.articlesHeading) : undefined,
    articlesCtaLabel: d.articlesCtaLabel ? String(d.articlesCtaLabel) : undefined,
    findUsEyebrow: d.findUsEyebrow ? String(d.findUsEyebrow) : undefined,
    findUsHeading: d.findUsHeading ? String(d.findUsHeading) : undefined,
    contactEyebrow: d.contactEyebrow ? String(d.contactEyebrow) : undefined,
    contactHeading: d.contactHeading ? String(d.contactHeading) : undefined,
    supportEyebrow: d.supportEyebrow ? String(d.supportEyebrow) : undefined,
    supportHeading: d.supportHeading ? String(d.supportHeading) : undefined,
    supportCtaLabel: d.supportCtaLabel ? String(d.supportCtaLabel) : undefined,
    storyEyebrow: d.storyEyebrow ? String(d.storyEyebrow) : undefined,
    purposeEyebrow: d.purposeEyebrow ? String(d.purposeEyebrow) : undefined,
    mapCtaLabel: d.mapCtaLabel ? String(d.mapCtaLabel) : undefined,
  }
}

export async function getPageContent(
  tenantIdValue: string | number,
  pageKey: string,
): Promise<PageContent> {
  const { DEFAULT_PAGES } = await import('./site-defaults')
  const fallback = DEFAULT_PAGES[pageKey] || { pageKey }

  if (!isPayloadEnabled() || String(tenantIdValue).startsWith('fallback')) {
    return fallback
  }

  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'icms-pages',
      where: {
        and: [
          { tenant: { equals: tenantId(tenantIdValue) } },
          { pageKey: { equals: pageKey } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })
    const doc = result.docs[0]
    if (!doc) return fallback
    return { ...fallback, ...mapPageDoc(doc as unknown as Record<string, unknown>) }
  } catch {
    return fallback
  }
}

export async function getAllPageContents(
  tenantIdValue: string | number,
): Promise<PageContent[]> {
  const { DEFAULT_PAGES } = await import('./site-defaults')
  if (!isPayloadEnabled() || String(tenantIdValue).startsWith('fallback')) {
    return Object.values(DEFAULT_PAGES)
  }
  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'icms-pages',
      where: { tenant: { equals: tenantId(tenantIdValue) } },
      limit: 50,
      overrideAccess: true,
    })
    if (!result.docs.length) return Object.values(DEFAULT_PAGES)
    return result.docs.map((d) => {
      const key = String(d.pageKey)
      const fallback = DEFAULT_PAGES[key] || { pageKey: key }
      return { ...fallback, ...mapPageDoc(d as unknown as Record<string, unknown>) }
    })
  } catch {
    return Object.values(DEFAULT_PAGES)
  }
}

export async function getFacilities(tenantIdValue: string | number): Promise<FacilityItem[]> {
  const { DEFAULT_FACILITIES } = await import('./site-defaults')
  if (!isPayloadEnabled() || String(tenantIdValue).startsWith('fallback')) {
    return DEFAULT_FACILITIES
  }
  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'icms-facilities',
      where: { tenant: { equals: tenantId(tenantIdValue) } },
      sort: 'sortOrder',
      limit: 50,
      overrideAccess: true,
    })
    if (!result.docs.length) return DEFAULT_FACILITIES
    return result.docs.map((d) => ({
      id: String(d.id),
      title: String(d.title),
      description: String(d.description || ''),
    }))
  } catch {
    return DEFAULT_FACILITIES
  }
}

export async function getDonateFunds(tenantIdValue: string | number): Promise<DonateFund[]> {
  const { DEFAULT_DONATE_FUNDS } = await import('./site-defaults')
  if (!isPayloadEnabled() || String(tenantIdValue).startsWith('fallback')) {
    return DEFAULT_DONATE_FUNDS
  }
  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'icms-donate-funds',
      where: {
        and: [
          { tenant: { equals: tenantId(tenantIdValue) } },
          { active: { equals: true } },
        ],
      },
      sort: 'sortOrder',
      limit: 50,
      overrideAccess: true,
    })
    if (!result.docs.length) return DEFAULT_DONATE_FUNDS
    return result.docs.map((d) => ({
      id: String(d.id),
      key: String(d.key),
      label: String(d.label),
      description: String(d.description || ''),
      impactLines: Array.isArray(d.impactLines)
        ? (d.impactLines as { amountLabel?: string; effect?: string }[]).map((i) => ({
            amountLabel: String(i.amountLabel || ''),
            effect: String(i.effect || ''),
          }))
        : [],
    }))
  } catch {
    return DEFAULT_DONATE_FUNDS
  }
}

export async function getContactMessages(
  tenantIdValue: string | number,
): Promise<ContactMessage[]> {
  if (!isPayloadEnabled() || String(tenantIdValue).startsWith('fallback')) {
    return []
  }
  const payload = await getPayloadSingleton()
  const result = await payload.find({
    collection: 'icms-contact-messages',
    where: { tenant: { equals: tenantId(tenantIdValue) } },
    sort: '-createdAt',
    limit: 100,
    overrideAccess: true,
  })
  return result.docs.map((d) => ({
    id: String(d.id),
    name: String(d.name),
    email: String(d.email),
    phone: d.phone ? String(d.phone) : undefined,
    subject: d.subject ? String(d.subject) : undefined,
    message: String(d.message),
    status: String(d.status || 'new'),
    createdAt: d.createdAt ? String(d.createdAt) : undefined,
  }))
}
