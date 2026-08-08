'use client'

import RecordForm, { type RecordFieldDef } from '@/components/icms/RecordForm'

type FieldDef = RecordFieldDef

/** @deprecated Prefer RecordForm or CrudResourcePanel directly */
export default function SimpleCreateForm({
  tenantSlug,
  collection,
  fields,
  title = 'Add new',
  transform,
}: {
  tenantSlug: string
  collection: string
  fields: FieldDef[]
  title?: string
  transform?: (raw: Record<string, string | boolean | number>) => Record<string, unknown>
}) {
  return (
    <RecordForm
      tenantSlug={tenantSlug}
      collection={collection}
      fields={fields}
      title={title}
      transform={transform}
    />
  )
}

export type { FieldDef }
