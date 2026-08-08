'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateSchoolForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    slug: '',
    schoolType: 'private',
    city: '',
    state: 'FCT',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/edusuite/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'schools',
          data: {
            ...form,
            status: 'active',
            currentTerm: 'First Term',
            currentSession: '2025/2026',
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Create failed')
      router.refresh()
      setForm({ name: '', slug: '', schoolType: 'private', city: '', state: 'FCT' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <h2 className="font-semibold text-[#1B1C1E]">Create school tenant</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        <label className="text-sm block">
          Name
          <input
            required
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={form.name}
            onChange={(e) =>
              setForm((s) => ({
                ...s,
                name: e.target.value,
                slug:
                  s.slug ||
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, ''),
              }))
            }
          />
        </label>
        <label className="text-sm block">
          Slug
          <input
            required
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={form.slug}
            onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
          />
        </label>
        <label className="text-sm block">
          Type
          <select
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={form.schoolType}
            onChange={(e) => setForm((s) => ({ ...s, schoolType: e.target.value }))}
          >
            <option value="private">Private</option>
            <option value="islamic">Islamic</option>
            <option value="public">Public</option>
          </select>
        </label>
        <label className="text-sm block">
          City
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={form.city}
            onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
          />
        </label>
        <label className="text-sm block">
          State
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={form.state}
            onChange={(e) => setForm((s) => ({ ...s, state: e.target.value }))}
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="bg-[#1A2BC2] text-white px-5 py-2 rounded-lg disabled:opacity-60"
      >
        {saving ? 'Creating…' : 'Create school'}
      </button>
    </form>
  )
}
