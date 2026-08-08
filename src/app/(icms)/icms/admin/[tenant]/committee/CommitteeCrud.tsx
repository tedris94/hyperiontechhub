'use client'

import CrudResourcePanel from '@/components/icms/CrudResourcePanel'
import type { RecordFieldDef } from '@/components/icms/RecordForm'

type Row = {
  id: string
  name: string
  roleTitle: string
  committeeType: string
  status: string
  phone: string
  email: string
  termStart: string
  termEnd: string
  bio: string
  photoUrl: string
  notes: string
  sortOrder: string
  showOnPublic: boolean
}

function transformCommittee(raw: Record<string, string | boolean | number>) {
  const data: Record<string, unknown> = { ...raw }
  for (const key of ['termStart', 'termEnd', 'phone', 'email', 'bio', 'notes', 'photoUrl']) {
    if (data[key] === '') data[key] = null
  }
  data.showOnPublic = raw.showOnPublic !== false && raw.showOnPublic !== ''
  return data
}

export default function CommitteeCrud({
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
      collection="icms-committee-members"
      addTitle="Add committee member"
      editTitle="Edit committee member"
      fields={fields}
      rows={rows}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'roleTitle', label: 'Role' },
        { key: 'committeeType', label: 'Committee', className: 'capitalize' },
        { key: 'status', label: 'Status', className: 'capitalize' },
        { key: 'termStart', label: 'Term start' },
        { key: 'termEnd', label: 'Term end' },
      ]}
      deleteIdPrefix="cm"
      transform={transformCommittee}
    />
  )
}
