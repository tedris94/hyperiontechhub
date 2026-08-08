'use client'

import { useEffect, useState } from 'react'
import RecordForm, { type RecordFieldDef } from '@/components/icms/RecordForm'
import DeleteRecordButton from '@/components/icms/DeleteRecordButton'

type Row = { id: string | number } & Record<string, unknown>

function defaultToInitial(
  row: Row,
  fields: RecordFieldDef[],
): Record<string, string | boolean | number> {
  const out: Record<string, string | boolean | number> = {}
  for (const f of fields) {
    const v = row[f.name]
    const isCheckbox = f.type === 'checkbox'
    if (isCheckbox) {
      out[f.name] = v !== false && v !== '' && v != null
    } else if (v != null) {
      out[f.name] = typeof v === 'boolean' || typeof v === 'number' ? v : String(v)
    } else {
      out[f.name] = ''
    }
  }
  return out
}

function docToRow(
  doc: Record<string, unknown>,
  fields: RecordFieldDef[],
  prev?: Row,
): Row {
  const row: Row = { id: (doc.id as string | number) ?? prev?.id ?? '' }
  for (const f of fields) {
    const fromDoc = doc[f.name]
    if (fromDoc != null) {
      row[f.name] = fromDoc
    } else if (prev && prev[f.name] != null) {
      row[f.name] = prev[f.name]
    } else {
      row[f.name] = f.type === 'checkbox' ? false : ''
    }
  }
  // Preserve any extra display columns from previous row
  if (prev) {
    for (const [k, v] of Object.entries(prev)) {
      if (!(k in row)) row[k] = v
    }
  }
  return row
}

export default function CrudResourcePanel({
  tenantSlug,
  collection,
  addTitle,
  editTitle = 'Edit record',
  fields,
  rows: initialRows,
  columns,
  deleteIdPrefix,
  coerceActive,
  transform: transformProp,
}: {
  tenantSlug: string
  collection: string
  addTitle: string
  editTitle?: string
  fields: RecordFieldDef[]
  rows: Row[]
  columns: { key: string; label: string; className?: string }[]
  deleteIdPrefix?: string
  coerceActive?: boolean
  transform?: (raw: Record<string, string | boolean | number>) => Record<string, unknown>
}) {
  const [rows, setRows] = useState<Row[]>(initialRows)
  const [editing, setEditing] = useState<Row | null>(null)

  useEffect(() => {
    setRows(initialRows)
  }, [initialRows])

  function transform(raw: Record<string, string | boolean | number>) {
    let data: Record<string, unknown> = { ...raw }
    if (coerceActive) {
      data = {
        ...data,
        active: raw.active !== false && raw.active !== '',
      }
    }
    return transformProp ? transformProp(data as Record<string, string | boolean | number>) : data
  }

  const needsTransform = Boolean(coerceActive || transformProp)

  function handleSaved(doc: Record<string, unknown>, mode: 'create' | 'update') {
    if (mode === 'create') {
      setRows((prev) => [docToRow(doc, fields), ...prev])
    } else {
      setRows((prev) =>
        prev.map((r) =>
          String(r.id) === String(doc.id) ? docToRow(doc, fields, r) : r,
        ),
      )
    }
    setEditing(null)
  }

  function handleDeleted(id: string | number) {
    setRows((prev) => prev.filter((r) => String(r.id) !== String(id)))
    if (editing && String(editing.id) === String(id)) setEditing(null)
  }

  return (
    <div className="space-y-8">
      <div className="overflow-x-auto border border-black/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[color:var(--icms-ivory)] text-xs uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={`px-4 py-3 ${c.className || ''}`}>
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-8 text-sm text-[color:var(--icms-warm-gray)]"
                >
                  No records yet.
                </td>
              </tr>
            ) : null}
            {rows.map((row) => {
              const allowDelete =
                !deleteIdPrefix || !String(row.id).startsWith(deleteIdPrefix)
              return (
                <tr key={String(row.id)} className="border-t border-black/5">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-3 ${c.className || ''}`}>
                      {String(row[c.key] ?? '')}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="text-xs font-medium text-[color:var(--icms-emerald)] hover:underline"
                        onClick={() => setEditing(row)}
                      >
                        Edit
                      </button>
                      {allowDelete ? (
                        <DeleteRecordButton
                          collection={collection}
                          id={row.id}
                          tenantSlug={tenantSlug}
                          onSuccess={() => handleDeleted(row.id)}
                        />
                      ) : null}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {editing ? (
        <RecordForm
          key={`edit-${String(editing.id)}`}
          tenantSlug={tenantSlug}
          collection={collection}
          title={editTitle}
          recordId={editing.id}
          initial={defaultToInitial(editing, fields)}
          fields={fields}
          transform={needsTransform ? transform : undefined}
          onCancel={() => setEditing(null)}
          onSaved={handleSaved}
        />
      ) : (
        <RecordForm
          key="create"
          tenantSlug={tenantSlug}
          collection={collection}
          title={addTitle}
          fields={fields}
          transform={needsTransform ? transform : undefined}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
