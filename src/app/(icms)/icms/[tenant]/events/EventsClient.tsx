'use client'

import { useMemo, useState } from 'react'

export type EventsViewItem = {
  id: string
  day: string
  month: string
  year: string
  title: string
  category: string
  venue: string
  blurb: string
  status: 'upcoming' | 'past'
  featured?: boolean
}

const FILTERS = ['All', 'Upcoming', 'Past'] as const
type Filter = (typeof FILTERS)[number]

function FeaturedEvent({ event }: { event: EventsViewItem }) {
  return (
    <div className="mb-14 grid min-h-[260px] overflow-hidden rounded bg-[color:var(--icms-forest)] md:grid-cols-[200px_1fr]">
      <div className="flex flex-col items-center justify-center gap-2 bg-[color:var(--icms-emerald)] px-4 py-8">
        <p className="icms-display text-[3.5rem] font-bold leading-none text-[color:var(--icms-ivory)]">
          {event.day}
        </p>
        <p className="icms-display text-base font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-gold)]">
          {event.month}
        </p>
        <p className="text-xs text-[color:var(--icms-ivory)]/40">{event.year}</p>
      </div>
      <div className="flex flex-col justify-between px-8 py-10 md:px-12">
        <div>
          <p className="mb-3 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
            Featured Event · {event.category}
          </p>
          <h2 className="icms-display mb-4 text-[clamp(1.1rem,2.5vw,1.65rem)] font-bold leading-snug text-[color:var(--icms-ivory)]">
            {event.title}
          </h2>
          <p className="mb-3 max-w-[560px] text-[0.88rem] leading-relaxed text-[color:var(--icms-ivory)]/73">
            {event.blurb}
          </p>
          <p className="text-xs text-[color:var(--icms-gold)]">📍 {event.venue}</p>
        </div>
        <div className="mt-7">
          <button
            type="button"
            className="inline-block rounded bg-[color:var(--icms-gold)] px-7 py-3 text-[0.76rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-forest)] transition-colors hover:bg-white"
          >
            Register Attendance
          </button>
        </div>
      </div>
    </div>
  )
}

function EventRow({ event }: { event: EventsViewItem }) {
  const dimmed = event.status === 'past'
  return (
    <div className="grid grid-cols-1 items-center gap-4 py-6 sm:grid-cols-[80px_1fr_auto] sm:gap-6">
      <div
        className={`rounded border border-[color:var(--icms-gold)]/27 px-2 py-2.5 text-center ${
          dimmed ? 'opacity-55' : ''
        }`}
      >
        <p className="icms-display text-2xl font-bold leading-none text-[color:var(--icms-charcoal)]">
          {event.day}
        </p>
        <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--icms-gold)]">
          {event.month}
        </p>
      </div>

      <div className={dimmed ? 'opacity-65' : ''}>
        <div className="mb-1 flex flex-wrap items-center gap-3">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-[color:var(--icms-gold)]">
            {event.category}
          </p>
          {event.status === 'past' && (
            <span className="rounded-sm bg-[color:var(--icms-warm-gray)]/10 px-1.5 py-0.5 text-[0.58rem] font-medium uppercase tracking-[0.1em] text-[color:var(--icms-warm-gray)]">
              Past
            </span>
          )}
        </div>
        <p className="icms-display mb-1 text-[clamp(0.9rem,1.8vw,1.05rem)] font-semibold text-[color:var(--icms-charcoal)]">
          {event.title}
        </p>
        <p className="mb-1.5 text-[0.78rem] leading-relaxed text-[color:var(--icms-warm-gray)]">
          {event.blurb}
        </p>
        <p className="text-[0.72rem] text-[color:var(--icms-gold)]">📍 {event.venue}</p>
      </div>

      {event.status === 'upcoming' ? (
        <button
          type="button"
          className="shrink-0 whitespace-nowrap rounded border border-[color:var(--icms-emerald)] px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[color:var(--icms-emerald)] transition-colors hover:bg-[color:var(--icms-emerald)]/5"
        >
          Register
        </button>
      ) : (
        <span className="whitespace-nowrap text-[0.7rem] text-[color:var(--icms-warm-gray)]/40">
          Concluded
        </span>
      )}
    </div>
  )
}

export default function EventsClient({ events }: { events: EventsViewItem[] }) {
  const [filter, setFilter] = useState<Filter>('All')

  const featured = useMemo(() => events.find((e) => e.featured), [events])
  const rest = useMemo(
    () =>
      events.filter((e) => {
        if (e.featured) return false
        if (filter === 'All') return true
        return e.status === filter.toLowerCase()
      }),
    [events, filter],
  )

  return (
    <section className="bg-[color:var(--icms-ivory)] px-8 py-20">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mb-12 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const active = filter === f
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-[3px] px-4 py-1.5 text-xs font-medium tracking-[0.08em] transition-all ${
                  active
                    ? 'border border-[color:var(--icms-gold)] bg-[color:var(--icms-gold)] text-[color:var(--icms-forest)]'
                    : 'border border-[color:var(--icms-gold)]/27 bg-transparent text-[color:var(--icms-warm-gray)]'
                }`}
              >
                {f}
              </button>
            )
          })}
        </div>

        {featured && filter !== 'Past' && <FeaturedEvent event={featured} />}

        <div className="flex flex-col">
          {rest.map((ev, i) => (
            <div key={ev.id}>
              <EventRow event={ev} />
              {i < rest.length - 1 && (
                <div className="h-px w-full bg-[color:var(--icms-gold)] opacity-15" aria-hidden />
              )}
            </div>
          ))}
          {rest.length === 0 && (
            <p className="py-8 text-[0.88rem] text-[color:var(--icms-warm-gray)]">
              No events match this filter.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
