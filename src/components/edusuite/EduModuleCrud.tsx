'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import InvoicePayButton from '@/components/edusuite/InvoicePayButton'
import NoticePublishButton from '@/components/edusuite/NoticePublishButton'

type Row = Record<string, unknown> & { id: string | number }

export default function EduModuleCrud({
  schoolId,
  schoolSlug,
  collection,
  title,
  fields,
  titleField = 'title',
  filterKeys = ['className', 'year', 'groupName'],
}: {
  schoolId: string | number
  schoolSlug: string
  collection: string
  title: string
  fields: Array<{ name: string; label: string; type?: 'text' | 'number' | 'date' | 'textarea' }>
  titleField?: string
  filterKeys?: string[]
}) {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [saving, setSaving] = useState(false)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `/api/edusuite/records?collection=${encodeURIComponent(collection)}&schoolId=${encodeURIComponent(String(schoolId))}&schoolSlug=${encodeURIComponent(schoolSlug)}`,
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load')
      setRows(data.docs || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [collection, schoolId, schoolSlug])

  useEffect(() => {
    void load()
  }, [load])

  const visibleFields = useMemo(
    () => fields.filter((f) => filterKeys.includes(f.name)),
    [fields, filterKeys],
  )

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      for (const key of filterKeys) {
        const fv = filters[key]
        if (fv && String(row[key] ?? '').toLowerCase() !== fv.toLowerCase()) return false
      }
      if (search) {
        const q = search.toLowerCase()
        const hay = fields.map((f) => String(row[f.name] ?? '')).join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [rows, filters, filterKeys, search, fields])

  function startEdit(row: Row) {
    setEditingId(row.id)
    const next: Record<string, string> = {}
    for (const f of fields) {
      const v = row[f.name]
      next[f.name] = v == null ? '' : String(v)
    }
    setForm(next)
  }

  function cancelEdit() {
    setEditingId(null)
    setForm({})
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload: Record<string, unknown> = {}
      for (const f of fields) {
        const v = form[f.name]
        if (v === undefined || v === '') continue
        payload[f.name] = f.type === 'number' ? Number(v) : v
      }
      if (!payload[titleField] && form[titleField]) payload[titleField] = form[titleField]

      if (editingId != null) {
        const res = await fetch('/api/edusuite/records', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collection, id: editingId, data: payload, schoolSlug }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Update failed')
      } else {
        payload.school = Number(schoolId) || schoolId
        const res = await fetch('/api/edusuite/records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collection, data: payload, schoolSlug }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Create failed')
      }
      cancelEdit()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(id: string | number) {
    if (!confirm('Delete this record?')) return
    const res = await fetch('/api/edusuite/records', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection, id, schoolSlug }),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Delete failed')
      return
    }
    await load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#1B1C1E]">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {editingId != null ? 'Editing record' : 'Add, edit, filter school-scoped records.'}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3 items-end">
        <label className="text-sm">
          <span className="text-gray-600">Search</span>
          <input
            className="mt-1 block border border-gray-300 rounded-lg px-3 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, roll…"
          />
        </label>
        {visibleFields.map((f) => (
          <label key={f.name} className="text-sm">
            <span className="text-gray-600">{f.label}</span>
            <input
              className="mt-1 block border border-gray-300 rounded-lg px-3 py-2"
              value={filters[f.name] || ''}
              onChange={(e) => setFilters((s) => ({ ...s, [f.name]: e.target.value }))}
              placeholder="Filter"
            />
          </label>
        ))}
      </div>

      <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-xl p-5 grid md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <label key={f.name} className="block text-sm">
            <span className="text-gray-600">{f.label}</span>
            {f.type === 'textarea' ? (
              <textarea
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                value={form[f.name] || ''}
                onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                rows={3}
              />
            ) : (
              <input
                type={f.type || 'text'}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                value={form[f.name] || ''}
                onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                required={f.name === titleField}
              />
            )}
          </label>
        ))}
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1A2BC2] text-white px-5 py-2 rounded-lg hover:bg-[#0D0D52] disabled:opacity-60"
          >
            {saving ? 'Saving…' : editingId != null ? 'Update record' : 'Add record'}
          </button>
          {editingId != null && (
            <button type="button" onClick={cancelEdit} className="px-4 py-2 border rounded-lg text-sm">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <p className="p-6 text-gray-500">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-gray-500">No records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Details</th>
                <th className="px-4 py-3 font-medium w-40"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={String(row.id)} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-[#1B1C1E]">
                    {String(row[titleField] ?? row.id)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 truncate max-w-md">
                    {fields
                      .filter((f) => f.name !== titleField && row[f.name] != null && row[f.name] !== '')
                      .slice(0, 4)
                      .map((f) => `${f.label}: ${String(row[f.name])}`)
                      .join(' · ')}
                  </td>
                  <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                    {collection === 'edu-invoices' && (
                      <InvoicePayButton
                        schoolSlug={schoolSlug}
                        invoiceId={row.id}
                        status={String(row.status || '')}
                      />
                    )}
                    {collection === 'edu-notices' && (
                      <NoticePublishButton schoolSlug={schoolSlug} noticeId={row.id} />
                    )}
                    <button type="button" onClick={() => startEdit(row)} className="text-[#1A2BC2] hover:underline">
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void onDelete(row.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  )
}
