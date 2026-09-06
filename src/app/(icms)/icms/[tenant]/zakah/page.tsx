import { notFound } from 'next/navigation'
import TopicPage from '@/components/icms/TopicPage'
import { getDonateFunds, getPageContent } from '@/lib/icms/content'
import { getPublicBaseFromHeaders } from '@/lib/icms/public-base-server'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'

type Props = { params: Promise<{ tenant: string }> }

export default async function ZakahPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const [page, funds, base] = await Promise.all([
    getPageContent(doc.id, 'zakah'),
    getDonateFunds(doc.id),
    getPublicBaseFromHeaders(tenant.slug),
  ])
  return <TopicPage tenant={tenant} base={base} page={page} kind="zakah" funds={funds.filter((fund) => fund.key.toLowerCase().includes('zakat'))} />
}
