import { useState } from 'react'
import { C, F } from '@/tokens'
import { GoldRule, SectionLabel, SectionHeading, PageHero } from '@/components/Shared'

type Event = {
  id: number
  date: string
  month: string
  year: string
  title: string
  category: string
  venue: string
  blurb: string
  status: 'upcoming' | 'past'
  featured?: boolean
}

const EVENTS: Event[] = [
  {
    id: 1,
    date: '23', month: 'Aug', year: '2026',
    title: 'Annual Eid al-Adha Congregation & Community Feast',
    category: 'Eid',
    venue: 'Main Prayer Hall & Grounds',
    blurb: "Join the Centre's Eid congregation led by Sheikh Ibrahim al-Amin, followed by a communal meal for all families. Children's activities and welfare gift distribution included.",
    status: 'upcoming',
    featured: true,
  },
  {
    id: 2,
    date: '09', month: 'Aug', year: '2026',
    title: 'Weekly Quran Tafsir Circle',
    category: 'Education',
    venue: 'Main Prayer Hall',
    blurb: 'Continuing study of Surah al-Kahf with Sheikh Musa Abdullahi. Open to all adults. Arabic text and English commentary provided.',
    status: 'upcoming',
  },
  {
    id: 3,
    date: '16', month: 'Aug', year: '2026',
    title: "Special Jumuah Khutbah — The Rights of the Neighbour in Islam",
    category: 'Friday Prayer',
    venue: 'Main Prayer Hall',
    blurb: "Sheikh Abdullahi Umar delivers a thematic Khutbah on neighbourly rights and community obligations — a topic of particular relevance in a growing urban district.",
    status: 'upcoming',
  },
  {
    id: 4,
    date: '30', month: 'Aug', year: '2026',
    title: 'Youth Workshop: Fiqh of Fasting & Spiritual Discipline',
    category: 'Youth',
    venue: 'Education Centre, Room 3',
    blurb: 'A half-day workshop for ages 14–25 on the jurisprudence and spiritual dimensions of voluntary fasting. Facilitated by Hajia Fatimah Yusuf.',
    status: 'upcoming',
  },
  {
    id: 5,
    date: '12', month: 'Jul', year: '2026',
    title: 'Islamiyyah End-of-Term Prize Giving',
    category: 'Education',
    venue: 'Main Prayer Hall',
    blurb: "Celebration of the Islamiyyah school's second term results. Awards presented by the Director of Education. Parents and community members welcome.",
    status: 'past',
  },
]

const FILTERS = ['All', 'Upcoming', 'Past'] as const
type Filter = typeof FILTERS[number]

function FeaturedEvent({ event }: { event: Event }) {
  return (
    <div style={{ background: C.forest, borderRadius: 4, overflow: 'hidden', marginBottom: '3.5rem', display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 260 }}>
      {/* Date column */}
      <div style={{ background: C.emerald, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', gap: '0.5rem' }}>
        <p style={{ fontFamily: F.display, fontWeight: 700, fontSize: '3.5rem', color: C.ivory, margin: 0, lineHeight: 1 }}>{event.date}</p>
        <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gold, margin: 0 }}>{event.month}</p>
        <p style={{ fontFamily: F.body, fontSize: '0.75rem', color: `${C.ivory}66`, margin: 0 }}>{event.year}</p>
      </div>

      {/* Content */}
      <div style={{ padding: '2.5rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: F.body, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.75rem' }}>
            Featured Event · {event.category}
          </p>
          <h2 style={{ fontFamily: F.display, fontWeight: 700, fontSize: 'clamp(1.1rem, 2.5vw, 1.65rem)', color: C.ivory, margin: '0 0 1rem', lineHeight: 1.25 }}>
            {event.title}
          </h2>
          <p style={{ fontFamily: F.body, fontSize: '0.88rem', color: `${C.ivory}BB`, lineHeight: 1.75, margin: '0 0 0.75rem', maxWidth: 560 }}>
            {event.blurb}
          </p>
          <p style={{ fontFamily: F.body, fontSize: '0.75rem', color: C.gold, margin: 0 }}>
            📍 {event.venue}
          </p>
        </div>
        <div style={{ marginTop: '1.75rem' }}>
          <a href="#" style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.76rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.75rem 1.75rem', background: C.gold, color: C.forest, borderRadius: 4, textDecoration: 'none', display: 'inline-block' }}>
            Register Attendance
          </a>
        </div>
      </div>
    </div>
  )
}

function EventRow({ event }: { event: Event }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '1.5rem', alignItems: 'center', padding: '1.5rem 0' }}>
      {/* Date */}
      <div style={{ textAlign: 'center', border: `1px solid ${C.gold}44`, borderRadius: 4, padding: '0.65rem 0.5rem', opacity: event.status === 'past' ? 0.55 : 1 }}>
        <p style={{ fontFamily: F.display, fontWeight: 700, fontSize: '1.5rem', color: C.charcoal, margin: 0, lineHeight: 1 }}>{event.date}</p>
        <p style={{ fontFamily: F.body, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold, margin: '0.2rem 0 0' }}>{event.month}</p>
      </div>

      {/* Info */}
      <div style={{ opacity: event.status === 'past' ? 0.65 : 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
          <p style={{ fontFamily: F.body, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, margin: 0 }}>{event.category}</p>
          {event.status === 'past' && (
            <span style={{ fontFamily: F.body, fontSize: '0.58rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gray, background: `${C.gray}18`, padding: '0.1rem 0.45rem', borderRadius: 2 }}>Past</span>
          )}
        </div>
        <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)', color: C.charcoal, margin: '0 0 0.3rem' }}>{event.title}</p>
        <p style={{ fontFamily: F.body, fontSize: '0.78rem', color: C.gray, margin: '0 0 0.4rem', lineHeight: 1.5 }}>{event.blurb}</p>
        <p style={{ fontFamily: F.body, fontSize: '0.72rem', color: C.gold, margin: 0 }}>📍 {event.venue}</p>
      </div>

      {/* CTA */}
      {event.status === 'upcoming' ? (
        <a href="#" style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.55rem 1.1rem', border: `1px solid ${C.emerald}`, color: C.emerald, borderRadius: 4, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, transition: 'background 0.2s' }}>
          Register
        </a>
      ) : (
        <span style={{ fontFamily: F.body, fontSize: '0.7rem', color: `${C.gray}66`, whiteSpace: 'nowrap' }}>Concluded</span>
      )}
    </div>
  )
}

export default function Events() {
  const [filter, setFilter] = useState<Filter>('All')

  const featured = EVENTS.find(e => e.featured)
  const rest = EVENTS.filter(e => !e.featured && (filter === 'All' ? true : e.status === filter.toLowerCase()))

  return (
    <>
      <PageHero
        title="Events"
        subtitle="Programmes, lectures, and community occasions at the Centre."
      />

      <section style={{ background: C.ivory, padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem' }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  fontFamily: F.body, fontWeight: 500, fontSize: '0.75rem', letterSpacing: '0.08em',
                  padding: '0.45rem 1.1rem', borderRadius: 3,
                  border: `1px solid ${filter === f ? C.gold : `${C.gold}44`}`,
                  background: filter === f ? C.gold : 'transparent',
                  color: filter === f ? C.forest : C.gray,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Featured — always shown */}
          {featured && filter !== 'Past' && <FeaturedEvent event={featured} />}

          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {rest.map((ev, i) => (
              <div key={ev.id}>
                <EventRow event={ev} />
                {i < rest.length - 1 && <div style={{ height: 1, background: C.gold, opacity: 0.15 }} />}
              </div>
            ))}
            {rest.length === 0 && (
              <p style={{ fontFamily: F.body, fontSize: '0.88rem', color: C.gray, padding: '2rem 0' }}>No events match this filter.</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
