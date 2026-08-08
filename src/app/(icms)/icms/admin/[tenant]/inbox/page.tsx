import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getContactMessages } from '@/lib/icms/content'
import InboxAdmin from './InboxAdmin'

type Props = { params: Promise<{ tenant: string }> }

export default async function AdminInboxPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const messages = await getContactMessages(doc.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">Contact inbox</h1>
        <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
          Messages submitted from the public Contact form.
        </p>
      </div>

      <InboxAdmin tenantSlug={tenant.slug} messages={messages} />
    </div>
  )
}
