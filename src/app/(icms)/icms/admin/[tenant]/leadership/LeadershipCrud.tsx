'use client'

import CrudResourcePanel from '@/components/icms/CrudResourcePanel'
import type { RecordFieldDef } from '@/components/icms/RecordForm'

type Row = {
  id: string
  name: string
  roleTitle: string
  category: string
  bio: string
  photoUrl: string
  sortOrder: string
}

export default function LeadershipCrud({
  tenantSlug,
  rows,
  fields,
}: {
  tenantSlug: string
  rows: Row[]
  fields: RecordFieldDef[]
}) {
  return (
    <CrudResourcePanel
      tenantSlug={tenantSlug}
      collection="icms-leaders"
      addTitle="Add leader"
      editTitle="Edit leader"
      fields={fields}
      rows={rows}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'roleTitle', label: 'Role' },
        { key: 'category', label: 'Category', className: 'capitalize' },
      ]}
    />
  )
}
