'use client'

import { useState } from 'react'
import { useIcmsToast } from '@/components/icms/toast'

export default function EventCreateForm({ tenantSlug }: { tenantSlug: string }) {
  const toast = useIcmsToast()
  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [time, setTime] = useState('')
  const [venue, setVenue] = useState('')
  const [blurb, setBlurb] = useState('')
  const [featured, setFeatured] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/icms/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'icms-events',
          tenantSlug,
          data: { title, eventDate, time, venue, blurb, featured },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setTitle('')
      setEventDate('')
      setTime('')
      setVenue('')
      setBlurb('')
      setFeatured(false)
      toast.success('Event created')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed'
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-black/10 bg-white p-6">
      <h2 className="icms-display text-xl text-[color:var(--icms-forest)]">Create event</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <label className="block text-sm font-medium">
        Title
        <input
          required
          className="icms-input mt-1.5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Date
          <input
            required
            type="date"
            className="icms-input mt-1.5"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </label>
        <label className="text-sm font-medium">
          Time
          <input
            className="icms-input mt-1.5"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="1:00 PM"
          />
        </label>
      </div>
      <label className="block text-sm font-medium">
        Venue
        <input
          className="icms-input mt-1.5"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />
      </label>
      <label className="block text-sm font-medium">
        Description
        <textarea
          className="icms-input mt-1.5 min-h-28"
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Featured
      </label>
      <button type="submit" className="icms-btn-primary" disabled={saving}>
        {saving ? 'Saving…' : 'Save event'}
      </button>
    </form>
  )
}
