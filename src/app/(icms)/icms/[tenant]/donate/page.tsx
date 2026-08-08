import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getDonateFunds, getPageContent } from '@/lib/icms/content'
import DonateClient from './DonateClient'

type Props = { params: Promise<{ tenant: string }> }

export default async function DonatePage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const [funds, page] = await Promise.all([
    getDonateFunds(doc.id),
    getPageContent(doc.id, 'donate'),
  ])

  return (
    <Suspense
      fallback={
        <div className="bg-[color:var(--icms-ivory)] px-8 py-20 text-center text-[0.9rem] text-[color:var(--icms-warm-gray)]">
          Loading…
        </div>
      }
    >
      <DonateClient tenant={tenant} funds={funds} page={page} />
    </Suspense>
  )
}
