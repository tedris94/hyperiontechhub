import fs from 'node:fs'
import path from 'node:path'
import type { Payload } from 'payload'
import {
  articles,
  committeeMembers,
  donations,
  events,
  leaders,
  prayerTimesToday,
  waqfProjects,
  islamiyyahClasses,
  islamiyyahStudents,
} from './demo-data'
import { ANAS_TENANT } from './fallback'

const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

const WEEK_TIMES: Record<(typeof WEEK_DAYS)[number], Record<string, string>> = {
  Monday: { Fajr: '5:14', Dhuhr: '12:41', Asr: '4:08', Maghrib: '6:53', Isha: '8:07' },
  Tuesday: { Fajr: '5:14', Dhuhr: '12:41', Asr: '4:08', Maghrib: '6:53', Isha: '8:07' },
  Wednesday: { Fajr: '5:13', Dhuhr: '12:41', Asr: '4:07', Maghrib: '6:54', Isha: '8:08' },
  Thursday: { Fajr: '5:13', Dhuhr: '12:40', Asr: '4:07', Maghrib: '6:54', Isha: '8:08' },
  Friday: { Fajr: '5:12', Dhuhr: '12:40', Asr: '4:06', Maghrib: '6:54', Isha: '8:08' },
  Saturday: { Fajr: '5:12', Dhuhr: '12:40', Asr: '4:06', Maghrib: '6:55', Isha: '8:09' },
  Sunday: { Fajr: '5:12', Dhuhr: '12:40', Asr: '4:05', Maghrib: '6:55', Isha: '8:09' },
}

async function clearTenantContent(payload: Payload, tenantId: string | number) {
  const collections = [
    'icms-articles',
    'icms-events',
    'icms-leaders',
    'icms-committee-members',
    'icms-prayer-times',
    'icms-donations',
    'icms-waqf-projects',
    'icms-islamiyyah-students',
    'icms-islamiyyah-classes',
    'icms-pages',
    'icms-facilities',
    'icms-donate-funds',
    'icms-contact-messages',
  ] as const
  for (const collection of collections) {
    const existing = await payload.find({
      collection,
      where: { tenant: { equals: tenantId } },
      limit: 500,
      overrideAccess: true,
    })
    for (const doc of existing.docs) {
      await payload.delete({ collection, id: doc.id, overrideAccess: true })
    }
  }
}

export async function seedTenantDemoContent(
  payload: Payload,
  tenantId: string | number,
  opts?: { clear?: boolean },
) {
  const dbTenantId = Number(tenantId)
  if (opts?.clear !== false) {
    await clearTenantContent(payload, tenantId)
  }

  for (const [i, leader] of leaders.entries()) {
    await payload.create({
      collection: 'icms-leaders',
      data: {
        tenant: dbTenantId,
        name: leader.name,
        roleTitle: leader.role,
        category: leader.category,
        bio: leader.bio,
        sortOrder: i,
      },
      overrideAccess: true,
    })
  }

  for (const [i, member] of committeeMembers.entries()) {
    await payload.create({
      collection: 'icms-committee-members',
      data: {
        tenant: dbTenantId,
        name: member.name,
        roleTitle: member.roleTitle,
        committeeType: member.committeeType,
        status: member.status,
        phone: member.phone || undefined,
        email: member.email || undefined,
        termStart: member.termStart || undefined,
        termEnd: member.termEnd || undefined,
        bio: member.bio || undefined,
        notes: member.notes || undefined,
        sortOrder: member.sortOrder ?? i,
        showOnPublic: member.showOnPublic !== false,
      },
      overrideAccess: true,
    })
  }

  for (const pt of prayerTimesToday) {
    await payload.create({
      collection: 'icms-prayer-times',
      data: {
        tenant: dbTenantId,
        day: 'Today',
        prayer: pt.name,
        time: pt.time,
      },
      overrideAccess: true,
    })
  }

  for (const day of WEEK_DAYS) {
    for (const [prayer, time] of Object.entries(WEEK_TIMES[day])) {
      if (prayer === 'Sunrise') continue
      await payload.create({
        collection: 'icms-prayer-times',
        data: {
          tenant: dbTenantId,
          day,
          prayer,
          time,
        },
        overrideAccess: true,
      })
    }
  }

  for (const event of events) {
    await payload.create({
      collection: 'icms-events',
      data: {
        tenant: dbTenantId,
        title: event.title,
        eventDate: event.date,
        time: event.time,
        venue: event.venue,
        blurb: event.blurb,
        featured: Boolean(event.featured),
      },
      overrideAccess: true,
    })
  }

  for (const article of articles) {
    await payload.create({
      collection: 'icms-articles',
      data: {
        tenant: dbTenantId,
        title: article.title,
        slug: article.slug,
        category: article.category,
        author: article.author,
        excerpt: article.excerpt,
        body: article.body.map((paragraph) => ({ paragraph })),
        publishedAt: article.date,
        status: article.status,
      },
      overrideAccess: true,
    })
  }

  for (const project of waqfProjects) {
    await payload.create({
      collection: 'icms-waqf-projects',
      data: {
        tenant: dbTenantId,
        title: project.title,
        summary: project.summary,
        status: project.status,
        progress: project.progress,
      },
      overrideAccess: true,
    })
  }

  for (const donation of donations) {
    await payload.create({
      collection: 'icms-donations',
      data: {
        tenant: dbTenantId,
        reference: donation.id,
        donor: donation.donor,
        amount: donation.amount,
        fund: donation.fund,
        status: donation.status as 'Completed' | 'Pending' | 'Failed',
        donatedAt: donation.date,
      },
      overrideAccess: true,
    })
  }

  const classIdByTitle = new Map<string, string | number>()
  for (const cls of islamiyyahClasses) {
    const created = await payload.create({
      collection: 'icms-islamiyyah-classes',
      data: {
        tenant: dbTenantId,
        title: cls.title,
        schedule: cls.schedule,
        ageGroup: cls.ageGroup,
        teacher: cls.teacher,
        capacity: cls.capacity,
        enrolled: cls.enrolled,
        status: cls.status as 'Open' | 'Full' | 'Closed',
        summary: cls.summary,
      },
      overrideAccess: true,
    })
    classIdByTitle.set(cls.title, Number(created.id))
  }

  for (const student of islamiyyahStudents) {
    await payload.create({
      collection: 'icms-islamiyyah-students',
      data: {
        tenant: dbTenantId,
        name: student.name,
        guardian: student.guardian,
        phone: student.phone,
        status: student.status as 'Pending' | 'Active' | 'Graduated' | 'Withdrawn',
        classRef: Number(classIdByTitle.get(student.classTitle)) || undefined,
      },
      overrideAccess: true,
    })
  }

  const { DEFAULT_PAGES, DEFAULT_FACILITIES, DEFAULT_DONATE_FUNDS } = await import('./site-defaults')

  for (const page of Object.values(DEFAULT_PAGES)) {
    await payload.create({
      collection: 'icms-pages',
      data: {
        tenant: dbTenantId,
        pageKey: page.pageKey as
          | 'committee'
          | 'waqf'
          | 'home'
          | 'about'
          | 'mosque'
          | 'leadership'
          | 'events'
          | 'articles'
          | 'donate'
          | 'contact'
          | 'islamiyyah'
          | 'khutba'
          | 'zakah'
          | 'ramadan',
        heroTitle: page.heroTitle,
        heroSubtitle: page.heroSubtitle,
        introHeading: page.introHeading,
        introBody: page.introBody,
        blocks: page.blocks,
        missionHeading: page.missionHeading,
        missionItems: page.missionItems?.map((text) => ({ text })),
        visionItems: page.visionItems?.map((text) => ({ text })),
        imageUrl: page.imageUrl,
        arabicText: page.arabicText,
        arabicCaption: page.arabicCaption,
        officeHours: page.officeHours,
        jumuahNote: page.jumuahNote,
        supportBlurb: page.supportBlurb,
        waqfGoalAmount: page.waqfGoalAmount,
        formSubjects: page.formSubjects?.map((label) => ({ label })),
        ctaPrimaryLabel: page.ctaPrimaryLabel,
        ctaSecondaryLabel: page.ctaSecondaryLabel,
        prayerHeading: page.prayerHeading,
        eventsEyebrow: page.eventsEyebrow,
        eventsHeading: page.eventsHeading,
        eventsCtaLabel: page.eventsCtaLabel,
        waqfEyebrow: page.waqfEyebrow,
        waqfHeading: page.waqfHeading,
        waqfBody: page.waqfBody,
        waqfCtaLabel: page.waqfCtaLabel,
        articlesEyebrow: page.articlesEyebrow,
        articlesHeading: page.articlesHeading,
        articlesCtaLabel: page.articlesCtaLabel,
        findUsEyebrow: page.findUsEyebrow,
        findUsHeading: page.findUsHeading,
        contactEyebrow: page.contactEyebrow,
        contactHeading: page.contactHeading,
        supportEyebrow: page.supportEyebrow,
        supportHeading: page.supportHeading,
        supportCtaLabel: page.supportCtaLabel,
        storyEyebrow: page.storyEyebrow,
        purposeEyebrow: page.purposeEyebrow,
        mapCtaLabel: page.mapCtaLabel,
      },
      overrideAccess: true,
    })
  }

  for (const [i, facility] of DEFAULT_FACILITIES.entries()) {
    await payload.create({
      collection: 'icms-facilities',
      data: {
        tenant: dbTenantId,
        title: facility.title,
        description: facility.description,
        sortOrder: i,
      },
      overrideAccess: true,
    })
  }

  for (const [i, fund] of DEFAULT_DONATE_FUNDS.entries()) {
    await payload.create({
      collection: 'icms-donate-funds',
      data: {
        tenant: dbTenantId,
        key: fund.key,
        label: fund.label,
        description: fund.description,
        impactLines: fund.impactLines,
        sortOrder: i,
        active: true,
      },
      overrideAccess: true,
    })
  }
}

export async function upsertAnasTenant(payload: Payload): Promise<string | number> {
  const slug = ANAS_TENANT.slug
  const existing = await payload.find({
    collection: 'icms-tenants',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })

  let logoId: string | number | undefined
  const logoPath = path.join(process.cwd(), 'public', 'tenants', slug, 'logo.png')
  if (fs.existsSync(logoPath)) {
    const buffer = fs.readFileSync(logoPath)
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: `${ANAS_TENANT.name} logo`,
      },
      file: {
        data: buffer,
        mimetype: 'image/png',
        name: `${slug}-logo.png`,
        size: buffer.length,
      },
      overrideAccess: true,
    })
    logoId = media.id
  }

  const tenantData = {
    name: ANAS_TENANT.name,
    slug,
    shortName: ANAS_TENANT.shortName,
    motto: ANAS_TENANT.motto,
    address: ANAS_TENANT.address,
    phones: ANAS_TENANT.phones.map((number) => ({ number })),
    email: ANAS_TENANT.email,
    facebookUrl: ANAS_TENANT.facebookUrl || '',
    instagramUrl: ANAS_TENANT.instagramUrl || '',
    colors: ANAS_TENANT.colors,
    status: 'active' as const,
    planTier: 'professional' as const,
    domainLabel: ANAS_TENANT.domainLabel,
    uiVariant: ANAS_TENANT.uiVariant,
    homeSectionOrder: ANAS_TENANT.homeSectionOrder,
    customDomainStatus: 'none' as const,
    prayer: ANAS_TENANT.prayer,
    bank: ANAS_TENANT.bank,
    ...(logoId ? { logo: logoId } : {}),
  }

  if (existing.totalDocs > 0) {
    const id = existing.docs[0].id
    await payload.update({
      collection: 'icms-tenants',
      id,
      data: tenantData as any,
      overrideAccess: true,
    })
    return id
  }

  const created = await payload.create({
    collection: 'icms-tenants',
    data: tenantData as any,
    overrideAccess: true,
  })
  return created.id
}

export async function ensureOwnerMembership(
  payload: Payload,
  tenantId: string | number,
  email?: string,
) {
  const adminEmail = email || process.env.SEED_SUPER_ADMIN_EMAIL || 'superadmin@hyperiontechhub.com'
  const admin = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
    overrideAccess: true,
  })
  if (admin.totalDocs === 0) return

  const userId = admin.docs[0].id
  const mem = await payload.find({
    collection: 'icms-memberships',
    where: {
      and: [{ user: { equals: userId } }, { tenant: { equals: tenantId } }],
    },
    limit: 1,
    overrideAccess: true,
  })
  if (mem.totalDocs === 0) {
    await payload.create({
      collection: 'icms-memberships',
      data: { user: userId, tenant: Number(tenantId), role: 'owner', status: 'active' },
      overrideAccess: true,
    })
  }
}

const ICMS_DEMO_USERS = [
  ['owner', 'icms.owner@hyperiontechhub.com'],
  ['director', 'icms.director@hyperiontechhub.com'],
  ['imam', 'icms.imam@hyperiontechhub.com'],
  ['content_editor', 'icms.editor@hyperiontechhub.com'],
  ['waqf_manager', 'icms.waqf@hyperiontechhub.com'],
  ['secretary', 'icms.secretary@hyperiontechhub.com'],
  ['finance', 'icms.finance@hyperiontechhub.com'],
  ['viewer', 'icms.viewer@hyperiontechhub.com'],
] as const

export async function ensureIcmsDemoMemberships(
  payload: Payload,
  tenantId: string | number,
) {
  const dbTenantId = Number(tenantId)
  for (const [role, email] of ICMS_DEMO_USERS) {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    })
    const user = existing.docs[0] || (await payload.create({
      collection: 'users',
      data: { email, password: 'demo1234', fullName: `ICMS ${role.replace(/_/g, ' ')}`, role: 'tenant_member' },
      overrideAccess: true,
    }))
    const membership = await payload.find({
      collection: 'icms-memberships',
      where: { and: [{ user: { equals: user.id } }, { tenant: { equals: tenantId } }] },
      limit: 1,
      overrideAccess: true,
    })
    if (!membership.docs[0]) {
      await payload.create({
        collection: 'icms-memberships',
        data: { user: user.id, tenant: dbTenantId, role, status: 'active' },
        overrideAccess: true,
      })
    }
  }
}
