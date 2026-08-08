import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import {
  getEvents,
  getPageContent,
  getPrayerTimesToday,
  getPublishedArticles,
  getWaqfProjects,
} from '@/lib/icms/content'
import { getUiVariant } from '@/lib/icms/ui-variants'
import { getPublicBaseFromHeaders } from '@/lib/icms/public-base-server'
import HomePageSections from '@/components/icms/HomePageSections'

type Props = { params: Promise<{ tenant: string }> }

export default async function TenantHomePage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const variant = getUiVariant(tenant.uiVariant)
  const base = await getPublicBaseFromHeaders(tenant.slug)

  const [events, prayerTimesToday, waqfProjects, page, articles] = await Promise.all([
    getEvents(doc.id),
    getPrayerTimesToday(doc.id),
    getWaqfProjects(doc.id),
    getPageContent(doc.id, 'home'),
    getPublishedArticles(doc.id),
  ])

  const upcoming = events.slice(0, 3)
  const featuredWaqf = waqfProjects[0]
  const avgProgress =
    waqfProjects.length > 0
      ? Math.round(waqfProjects.reduce((s, p) => s + p.progress, 0) / waqfProjects.length)
      : 0
  const campaignProgress = featuredWaqf?.progress ?? avgProgress
  const campaignGoal = page.waqfGoalAmount || featuredWaqf?.goalAmount || 50_000_000
  const campaignRaised =
    featuredWaqf?.raisedAmount != null
      ? featuredWaqf.raisedAmount
      : Math.round((campaignGoal * campaignProgress) / 100)

  return (
    <HomePageSections
      tenant={tenant}
      base={base}
      page={page}
      prayerTimesToday={prayerTimesToday}
      upcoming={upcoming}
      waqfProjects={waqfProjects}
      articles={articles}
      campaignProgress={campaignProgress}
      campaignGoal={campaignGoal}
      campaignRaised={campaignRaised}
      featuredWaqf={featuredWaqf}
      sectionOrder={variant.homeSectionOrder}
      heroStyle={variant.heroStyle}
    />
  )
}
