'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function SchoolSettingsPage() {
  const params = useParams()
  const schoolSlug = String(params.schoolSlug || '')
  const [school, setSchool] = useState<Record<string, unknown> | null>(null)
  const [form, setForm] = useState({
    currentTerm: '',
    currentSession: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    settingsNotes: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/edusuite/schools/${encodeURIComponent(schoolSlug)}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to load school')
        return
      }
      setSchool(data.school)
      setForm({
        currentTerm: data.school.currentTerm || '',
        currentSession: data.school.currentSession || '',
        city: data.school.city || '',
        state: data.school.state || '',
        phone: data.school.phone || '',
        email: data.school.email || '',
        settingsNotes: data.school.settingsNotes || '',
      })
    })()
  }, [schoolSlug])

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setError('')
    const res = await fetch(`/api/edusuite/schools/${encodeURIComponent(schoolSlug)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Save failed')
      return
    }
    setSchool(data.school)
    setMessage('Settings saved.')
  }

  if (!school && !error) {
    return <p className="text-gray-500">Loading settings…</p>
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-semibold text-[#1B1C1E]">Settings & config</h2>
        <p className="text-gray-600 mt-1">Term, session, contact, and school notes.</p>
      </div>
      {error && <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>}
      {message && (
        <div className="rounded-lg bg-green-50 text-green-700 px-4 py-3 text-sm">{message}</div>
      )}
      <form onSubmit={onSave} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        {(
          [
            ['currentTerm', 'Current term'],
            ['currentSession', 'Current session'],
            ['city', 'City'],
            ['state', 'State'],
            ['phone', 'Phone'],
            ['email', 'Email'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="text-gray-600">{label}</span>
            <input
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
              value={form[key]}
              onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
            />
          </label>
        ))}
        <label className="block text-sm">
          <span className="text-gray-600">Notes</span>
          <textarea
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
            rows={4}
            value={form.settingsNotes}
            onChange={(e) => setForm((s) => ({ ...s, settingsNotes: e.target.value }))}
          />
        </label>
        <button
          type="submit"
          className="bg-[#1A2BC2] text-white px-5 py-2 rounded-lg hover:bg-[#0D0D52]"
        >
          Save settings
        </button>
      </form>
    </div>
  )
}
