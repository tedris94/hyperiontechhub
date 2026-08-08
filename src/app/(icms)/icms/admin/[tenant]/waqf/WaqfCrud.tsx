'use client'

import CrudResourcePanel from '@/components/icms/CrudResourcePanel'

const FIELDS = [
  { name: 'title', label: 'Title' },
  { name: 'summary', label: 'Summary', type: 'textarea' as const },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'status', label: 'Status' },
  { name: 'progress', label: 'Progress %', type: 'number' as const },
  { name: 'goalAmount', label: 'Goal (₦)', type: 'number' as const },
  { name: 'raisedAmount', label: 'Raised (₦)', type: 'number' as const },
]

export default function WaqfCrud({
  tenantSlug,
  rows,
}: {
  tenantSlug: string
  rows: Record<string, unknown>[]
}) {
  return (
    <CrudResourcePanel
      tenantSlug={tenantSlug}
      collection="icms-waqf-projects"
      addTitle="Add Waqf project"
      editTitle="Edit Waqf project"
      fields={FIELDS}
      rows={rows}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'progressLabel', label: 'Progress' },
        { key: 'raisedLabel', label: 'Raised / Goal' },
        { key: 'status', label: 'Status' },
      ]}
    />
  )
}
