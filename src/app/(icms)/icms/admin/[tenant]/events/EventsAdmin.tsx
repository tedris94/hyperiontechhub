'use client'

import { useEffect, useState } from 'react'
import type { EventItem } from '@/lib/icms/types'
import DeleteRecordButton from '@/components/icms/DeleteRecordButton'
import { useIcmsToast } from '@/components/icms/toast'

/** Convert stored display time (e.g. "1:00 PM" or "13:00") → HTML time input value "HH:mm". */
function toTimeInputValue(display: string): string {
  const raw = display.trim()
  if (!raw) return ''
  const match24 = raw.match(/^(\d{1,2}):(\d{2})$/)
  if (match24) {
    const h = Math.min(23, Number(match24[1]))
    const m = Math.min(59, Number(match24[2]))
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }
  const match12 = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match12) return ''
  let h = Number(match12[1])
  const m = Number(match12[2])
  const ampm = match12[3].toUpperCase()
  if (ampm === 'PM' && h < 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Convert HTML time input "HH:mm" → friendly display e.g. "1:00 PM". */
function fromTimeInputValue(value: string): string {
  if (!value) return ''
  const [hs, ms] = value.split(':')
  let h = Number(hs)
  const m = Number(ms)
  if (Number.isNaN(h) || Number.isNaN(m)) return value
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`
}

function mapDocToEvent(doc: Record<string, unknown>, fallback?: EventItem): EventItem {
  return {
    id: String(doc.id ?? fallback?.id ?? ''),
    title: String(doc.title ?? fallback?.title ?? ''),
    date: String(doc.eventDate ?? doc.date ?? fallback?.date ?? '').slice(0, 10),
    time: String(doc.time ?? fallback?.time ?? ''),
    venue: String(doc.venue ?? fallback?.venue ?? ''),
    blurb: String(doc.blurb ?? fallback?.blurb ?? ''),
    featured: Boolean(doc.featured ?? fallback?.featured),
    category: doc.category ? String(doc.category) : fallback?.category,
  }
}

export default function EventsAdmin({
  tenantSlug,
  events: initialEvents,
}: {
  tenantSlug: string
  events: EventItem[]
}) {
  const toast = useIcmsToast()
  const [events, setEvents] = useState(initialEvents)
  const [editing, setEditing] = useState<EventItem | null>(null)
  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [time, setTime] = useState('')
  const [venue, setVenue] = useState('')
  const [blurb, setBlurb] = useState('')
  const [featured, setFeatured] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setEvents(initialEvents)
  }, [initialEvents])

  useEffect(() => {
    if (!editing) {
      setTitle('')
      setEventDate('')
      setTime('')
      setVenue('')
      setBlurb('')
      setFeatured(false)
      return
    }
    setTitle(editing.title)
    setEventDate(editing.date)
    setTime(editing.time)
    setVenue(editing.venue)
    setBlurb(editing.blurb)
    setFeatured(Boolean(editing.featured))
  }, [editing])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const data = { title, eventDate, time, venue, blurb, featured }
      const res = await fetch('/api/icms/records', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editing
            ? { collection: 'icms-events', tenantSlug, id: editing.id, data }
            : { collection: 'icms-events', tenantSlug, data },
        ),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      const mapped = mapDocToEvent(json.doc || {}, editing || undefined)
      if (editing) {
        setEvents((prev) => prev.map((ev) => (String(ev.id) === String(mapped.id) ? mapped : ev)))
        toast.success('Event updated')
      } else {
        setEvents((prev) => [mapped, ...prev])
        toast.success('Event created')
      }
      setEditing(null)
      setTitle('')
      setEventDate('')
      setTime('')
      setVenue('')
      setBlurb('')
      setFeatured(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed'
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="border border-black/10 bg-white">
        <ul className="divide-y divide-black/5">
          {events.length === 0 ? (
            <li className="px-5 py-8 text-sm text-[color:var(--icms-warm-gray)]">No events yet.</li>
          ) : null}
          {events.map((e) => (
            <li
              key={e.id}
              className="flex flex-col gap-2 px-5 py-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium text-[color:var(--icms-charcoal)]">{e.title}</p>
                <p className="text-xs text-[color:var(--icms-warm-gray)]">
                  {e.date} · {e.time} · {e.venue}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--icms-emerald)]">
                  {e.featured ? 'Featured' : 'Published'}
                </span>
                <button
                  type="button"
                  className="text-xs font-medium text-[color:var(--icms-emerald)] hover:underline"
                  onClick={() => setEditing(e)}
                >
                  Edit
                </button>
                <DeleteRecordButton
                  collection="icms-events"
                  id={e.id}
                  tenantSlug={tenantSlug}
                  onSuccess={() =>
                    setEvents((prev) => prev.filter((ev) => String(ev.id) !== String(e.id)))
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 border border-black/10 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="icms-display text-xl text-[color:var(--icms-forest)]">
            {editing ? 'Edit event' : 'Create event'}
          </h2>
          {editing ? (
            <button
              type="button"
              className="text-xs text-[color:var(--icms-warm-gray)] hover:underline"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          ) : null}
        </div>
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
              type="time"
              className="icms-input mt-1.5"
              value={toTimeInputValue(time)}
              onChange={(e) => setTime(fromTimeInputValue(e.target.value))}
            />
            {time ? (
              <span className="mt-1 block text-xs font-normal text-[color:var(--icms-warm-gray)]">
                Shown as {time}
              </span>
            ) : null}
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
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Save event'}
        </button>
      </form>
    </div>
  )
}
