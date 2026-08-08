import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getDonateFunds } from '@/lib/icms/content'
import CrudResourcePanel from '@/components/icms/CrudResourcePanel'

type Props = { params: Promise<{ tenant: string }> }

const FIELDS = [
  { name: 'key', label: 'Key (e.g. Sadaqah)' },
  { name: 'label', label: 'Label' },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'sortOrder', label: 'Sort order', type: 'number' as const },
  { name: 'active', label: 'Active', type: 'checkbox' as const },
]

export default async function AdminDonateFundsPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const funds = await getDonateFunds(doc.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">Donate funds</h1>
        <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
          Fund purposes and impact lines on the public Donate page.
        </p>
      </div>

      <CrudResourcePanel
        tenantSlug={tenant.slug}
        collection="icms-donate-funds"
        addTitle="Add donate fund"
        editTitle="Edit donate fund"
        fields={FIELDS}
        rows={funds.map((f) => ({
          id: f.id,
          key: f.key,
          label: f.label,
          description: f.description,
          sortOrder: '',
          active: true,
        }))}
        columns={[
          { key: 'key', label: 'Key' },
          { key: 'label', label: 'Label' },
          { key: 'description', label: 'Description', className: 'max-w-md truncate' },
        ]}
        deleteIdPrefix="d"
        coerceActive
      />
    </div>
  )
}
