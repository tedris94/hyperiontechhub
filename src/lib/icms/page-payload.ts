import type { PageContent } from './types'

/** Normalise page content for the admin form (always defined arrays). */
export function mergePageContent(p?: PageContent, pageKey = 'home'): PageContent {
  return {
    pageKey: p?.pageKey || pageKey,
    heroTitle: p?.heroTitle || '',
    heroSubtitle: p?.heroSubtitle || '',
    introHeading: p?.introHeading || '',
    introBody: p?.introBody || '',
    blocks: p?.blocks?.length ? [...p.blocks] : [],
    missionHeading: p?.missionHeading || '',
    missionItems: p?.missionItems?.length ? [...p.missionItems] : [],
    visionItems: p?.visionItems?.length ? [...p.visionItems] : [],
    imageUrl: p?.imageUrl || '',
    arabicText: p?.arabicText || '',
    arabicCaption: p?.arabicCaption || '',
    officeHours: p?.officeHours?.length ? [...p.officeHours] : [],
    jumuahNote: p?.jumuahNote || '',
    supportBlurb: p?.supportBlurb || '',
    waqfGoalAmount: p?.waqfGoalAmount,
    formSubjects: p?.formSubjects?.length ? [...p.formSubjects] : [],
    ctaPrimaryLabel: p?.ctaPrimaryLabel || '',
    ctaSecondaryLabel: p?.ctaSecondaryLabel || '',
    prayerHeading: p?.prayerHeading || '',
    eventsEyebrow: p?.eventsEyebrow || '',
    eventsHeading: p?.eventsHeading || '',
    eventsCtaLabel: p?.eventsCtaLabel || '',
    waqfEyebrow: p?.waqfEyebrow || '',
    waqfHeading: p?.waqfHeading || '',
    waqfBody: p?.waqfBody || '',
    waqfCtaLabel: p?.waqfCtaLabel || '',
    articlesEyebrow: p?.articlesEyebrow || '',
    articlesHeading: p?.articlesHeading || '',
    articlesCtaLabel: p?.articlesCtaLabel || '',
    findUsEyebrow: p?.findUsEyebrow || '',
    findUsHeading: p?.findUsHeading || '',
    contactEyebrow: p?.contactEyebrow || '',
    contactHeading: p?.contactHeading || '',
    supportEyebrow: p?.supportEyebrow || '',
    supportHeading: p?.supportHeading || '',
    supportCtaLabel: p?.supportCtaLabel || '',
    storyEyebrow: p?.storyEyebrow || '',
    purposeEyebrow: p?.purposeEyebrow || '',
    mapCtaLabel: p?.mapCtaLabel || '',
  }
}

/** Serialize admin form state for Payload upsert. */
export function pageContentToPayload(form: PageContent): Record<string, unknown> {
  const data: Record<string, unknown> = {
    pageKey: form.pageKey,
    heroTitle: form.heroTitle || undefined,
    heroSubtitle: form.heroSubtitle || undefined,
    introHeading: form.introHeading || undefined,
    introBody: form.introBody || undefined,
    blocks: form.blocks?.map((b) => ({ title: b.title, body: b.body })),
    missionHeading: form.missionHeading || undefined,
    missionItems: form.missionItems?.map((text) => ({ text })),
    visionItems: form.visionItems?.map((text) => ({ text })),
    imageUrl: form.imageUrl || undefined,
    arabicText: form.arabicText || undefined,
    arabicCaption: form.arabicCaption || undefined,
    officeHours: form.officeHours?.map((h) => ({ label: h.label, value: h.value })),
    jumuahNote: form.jumuahNote || undefined,
    supportBlurb: form.supportBlurb || undefined,
    formSubjects: form.formSubjects?.map((label) => ({ label })),
    ctaPrimaryLabel: form.ctaPrimaryLabel || undefined,
    ctaSecondaryLabel: form.ctaSecondaryLabel || undefined,
    prayerHeading: form.prayerHeading || undefined,
    eventsEyebrow: form.eventsEyebrow || undefined,
    eventsHeading: form.eventsHeading || undefined,
    eventsCtaLabel: form.eventsCtaLabel || undefined,
    waqfEyebrow: form.waqfEyebrow || undefined,
    waqfHeading: form.waqfHeading || undefined,
    waqfBody: form.waqfBody || undefined,
    waqfCtaLabel: form.waqfCtaLabel || undefined,
    articlesEyebrow: form.articlesEyebrow || undefined,
    articlesHeading: form.articlesHeading || undefined,
    articlesCtaLabel: form.articlesCtaLabel || undefined,
    findUsEyebrow: form.findUsEyebrow || undefined,
    findUsHeading: form.findUsHeading || undefined,
    contactEyebrow: form.contactEyebrow || undefined,
    contactHeading: form.contactHeading || undefined,
    supportEyebrow: form.supportEyebrow || undefined,
    supportHeading: form.supportHeading || undefined,
    supportCtaLabel: form.supportCtaLabel || undefined,
    storyEyebrow: form.storyEyebrow || undefined,
    purposeEyebrow: form.purposeEyebrow || undefined,
    mapCtaLabel: form.mapCtaLabel || undefined,
  }

  if (form.waqfGoalAmount != null && !Number.isNaN(form.waqfGoalAmount)) {
    data.waqfGoalAmount = form.waqfGoalAmount
  }

  return data
}
