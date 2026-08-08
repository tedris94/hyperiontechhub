import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getFacilities } from '@/lib/icms/content'
import CrudResourcePanel from '@/components/icms/CrudResourcePanel'

type Props = { params: Promise<{ tenant: string }> }

const FIELDS = [
  { name: 'title', label: 'Title' },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'sortOrder', label: 'Sort order', type: 'number' as const },
]

export default async function AdminFacilitiesPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const facilities = await getFacilities(doc.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">Facilities</h1>
        <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
          Mosque facilities listed on the public Mosque page.
        </p>
      </div>

      <CrudResourcePanel
        tenantSlug={tenant.slug}
        collection="icms-facilities"
        addTitle="Add facility"
        editTitle="Edit facility"
        fields={FIELDS}
        rows={facilities.map((f) => ({
          id: f.id,
          title: f.title,
          description: f.description,
          sortOrder: '',
        }))}
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'description', label: 'Description' },
        ]}
        deleteIdPrefix="f"
      />
    </div>
  )
}
