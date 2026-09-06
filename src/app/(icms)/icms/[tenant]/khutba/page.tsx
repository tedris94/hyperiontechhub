import { notFound } from 'next/navigation'
import TopicPage from '@/components/icms/TopicPage'
import { getEvents, getPageContent, getPublishedArticles } from '@/lib/icms/content'
import { getPublicBaseFromHeaders } from '@/lib/icms/public-base-server'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'

type Props = { params: Promise<{ tenant: string }> }

export default async function KhutbaPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const [page, events, articles, base] = await Promise.all([
    getPageContent(doc.id, 'khutba'),
    getEvents(doc.id),
    getPublishedArticles(doc.id),
    getPublicBaseFromHeaders(tenant.slug),
  ])
  return <TopicPage tenant={tenant} base={base} page={page} kind="khutba" events={events} articles={articles} />
}
