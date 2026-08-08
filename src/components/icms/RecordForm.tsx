'use client'

import { useEffect, useState } from 'react'
import ImageUploadField from '@/components/icms/ImageUploadField'
import { useIcmsToast } from '@/components/icms/toast'

export type RecordFieldDef =
  | {
      name: string
      label: string
      type?: 'text' | 'textarea' | 'number' | 'checkbox' | 'date' | 'email' | 'image'
      hint?: string
    }
  | {
      name: string
      label: string
      type: 'select'
      options: { label: string; value: string }[]
      hint?: string
    }

function emptyValues(fields: RecordFieldDef[]): Record<string, string | boolean> {
  const init: Record<string, string | boolean> = {}
  for (const f of fields) init[f.name] = f.type === 'checkbox' ? false : ''
  return init
}

export default function RecordForm({
  tenantSlug,
  collection,
  fields,
  title = 'Add new',
  recordId,
  initial,
  onCancel,
  onSaved,
  transform,
  submitLabel,
}: {
  tenantSlug: string
  collection: string
  fields: RecordFieldDef[]
  title?: string
  recordId?: string | number
  initial?: Record<string, string | boolean | number>
  onCancel?: () => void
  /** Called with API doc after successful create/update (no full page reload). */
  onSaved?: (doc: Record<string, unknown>, mode: 'create' | 'update') => void
  transform?: (raw: Record<string, string | boolean | number>) => Record<string, unknown>
  submitLabel?: string
}) {
  const toast = useIcmsToast()
  const isEdit = recordId != null
  const [values, setValues] = useState<Record<string, string | boolean>>(() => {
    const base = emptyValues(fields)
    if (!initial) return base
    for (const f of fields) {
      const v = initial[f.name]
      if (v != null) base[f.name] = f.type === 'checkbox' ? Boolean(v) : String(v)
    }
    return base
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const base = emptyValues(fields)
    if (initial) {
      for (const f of fields) {
        const v = initial[f.name]
        if (v != null) base[f.name] = f.type === 'checkbox' ? Boolean(v) : String(v)
      }
    }
    setValues(base)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once per record
  }, [recordId])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const raw: Record<string, string | boolean | number> = { ...values }
      for (const f of fields) {
        if (f.type === 'number' && typeof raw[f.name] === 'string') {
          raw[f.name] = Number(raw[f.name]) || 0
        }
      }
      const data = transform ? transform(raw) : raw
      const id =
        recordId != null && !Number.isNaN(Number(recordId)) ? Number(recordId) : recordId
      const res = await fetch('/api/icms/records', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isEdit
            ? { collection, tenantSlug, id, data }
            : { collection, tenantSlug, data },
        ),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      const doc = (json.doc || {}) as Record<string, unknown>
      if (!isEdit) setValues(emptyValues(fields))
      toast.success(isEdit ? 'Changes saved' : 'Record created')
      onSaved?.(doc, isEdit ? 'update' : 'create')
      onCancel?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed'
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 border border-black/10 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
          {title}
        </h2>
        {onCancel ? (
          <button
            type="button"
            className="text-xs text-[color:var(--icms-warm-gray)] hover:underline"
            onClick={onCancel}
          >
            Cancel
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {fields.map((f) =>
        f.type === 'image' ? (
          <ImageUploadField
            key={f.name}
            label={f.label}
            hint={f.hint}
            value={String(values[f.name] ?? '')}
            onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))}
            tenantSlug={tenantSlug}
          />
        ) : (
          <label key={f.name} className="block text-sm font-medium">
            {f.label}
            {'hint' in f && f.hint ? (
              <span className="mt-0.5 block text-xs font-normal text-[color:var(--icms-warm-gray)]">
                {f.hint}
              </span>
            ) : null}
            {f.type === 'textarea' ? (
              <textarea
                className="icms-input mt-1.5"
                rows={3}
                value={String(values[f.name] ?? '')}
                onChange={(e) => setValues((s) => ({ ...s, [f.name]: e.target.value }))}
              />
            ) : f.type === 'checkbox' ? (
              <input
                type="checkbox"
                className="ml-2 mt-2"
                checked={Boolean(values[f.name])}
                onChange={(e) => setValues((s) => ({ ...s, [f.name]: e.target.checked }))}
              />
            ) : f.type === 'select' ? (
              <select
                className="icms-input mt-1.5"
                value={String(values[f.name] ?? '')}
                onChange={(e) => setValues((s) => ({ ...s, [f.name]: e.target.value }))}
              >
                <option value="">Select…</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="icms-input mt-1.5"
                type={
                  f.type === 'number'
                    ? 'number'
                    : f.type === 'date'
                      ? 'date'
                      : f.type === 'email'
                        ? 'email'
                        : 'text'
                }
                value={String(values[f.name] ?? '')}
                onChange={(e) => setValues((s) => ({ ...s, [f.name]: e.target.value }))}
              />
            )}
          </label>
        ),
      )}
      <button type="submit" className="icms-btn-primary" disabled={saving}>
        {saving ? 'Saving…' : submitLabel || (isEdit ? 'Save changes' : 'Create')}
      </button>
    </form>
  )
}
