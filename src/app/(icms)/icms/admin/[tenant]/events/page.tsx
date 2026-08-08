import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getEvents } from '@/lib/icms/content'
import EventsAdmin from './EventsAdmin'

type Props = { params: Promise<{ tenant: string }> }

export default async function AdminEventsPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const events = await getEvents(doc.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">Events</h1>
        <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
          Manage programs and community gatherings
        </p>
      </div>

      <EventsAdmin tenantSlug={tenant.slug} events={events} />
    </div>
  )
}
