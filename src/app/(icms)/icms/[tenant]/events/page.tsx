import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getEvents, getPageContent } from '@/lib/icms/content'
import PageHero from '@/components/icms/PageHero'
import EventsClient, { type EventsViewItem } from './EventsClient'

type Props = { params: Promise<{ tenant: string }> }

/** Figma presentation fallback when CMS has no events */
const FIGMA_EVENTS: EventsViewItem[] = [
  {
    id: 'demo-1',
    day: '23',
    month: 'Aug',
    year: '2026',
    title: 'Annual Eid al-Adha Congregation & Community Feast',
    category: 'Eid',
    venue: 'Main Prayer Hall & Grounds',
    blurb:
      "Join the Centre's Eid congregation led by Sheikh Ibrahim al-Amin, followed by a communal meal for all families. Children's activities and welfare gift distribution included.",
    status: 'upcoming',
    featured: true,
  },
  {
    id: 'demo-2',
    day: '09',
    month: 'Aug',
    year: '2026',
    title: 'Weekly Quran Tafsir Circle',
    category: 'Education',
    venue: 'Main Prayer Hall',
    blurb:
      'Continuing study of Surah al-Kahf with Sheikh Musa Abdullahi. Open to all adults. Arabic text and English commentary provided.',
    status: 'upcoming',
  },
  {
    id: 'demo-3',
    day: '16',
    month: 'Aug',
    year: '2026',
    title: 'Special Jumuah Khutbah — The Rights of the Neighbour in Islam',
    category: 'Friday Prayer',
    venue: 'Main Prayer Hall',
    blurb:
      'Sheikh Abdullahi Umar delivers a thematic Khutbah on neighbourly rights and community obligations — a topic of particular relevance in a growing urban district.',
    status: 'upcoming',
  },
  {
    id: 'demo-4',
    day: '30',
    month: 'Aug',
    year: '2026',
    title: 'Youth Workshop: Fiqh of Fasting & Spiritual Discipline',
    category: 'Youth',
    venue: 'Education Centre, Room 3',
    blurb:
      'A half-day workshop for ages 14–25 on the jurisprudence and spiritual dimensions of voluntary fasting. Facilitated by Hajia Fatimah Yusuf.',
    status: 'upcoming',
  },
  {
    id: 'demo-5',
    day: '12',
    month: 'Jul',
    year: '2026',
    title: 'Islamiyyah End-of-Term Prize Giving',
    category: 'Education',
    venue: 'Main Prayer Hall',
    blurb:
      "Celebration of the Islamiyyah school's second term results. Awards presented by the Director of Education. Parents and community members welcome.",
    status: 'past',
  },
]

function eventCategory(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('eid')) return 'Eid'
  if (t.includes('jum') || t.includes('khutbah') || t.includes('friday') || t.includes('jumu'))
    return 'Friday Prayer'
  if (t.includes('youth')) return 'Youth'
  if (
    t.includes('study') ||
    t.includes('tafsir') ||
    t.includes('workshop') ||
    t.includes('qur') ||
    t.includes('islamiyyah') ||
    t.includes('education') ||
    t.includes('circle')
  )
    return 'Education'
  return 'Community'
}

function toViewItem(
  event: {
    id: string
    title: string
    date: string
    venue: string
    blurb: string
    featured?: boolean
  },
  todayIso: string,
): EventsViewItem {
  const d = new Date(`${event.date}T12:00:00`)
  const status: 'upcoming' | 'past' = event.date >= todayIso ? 'upcoming' : 'past'
  return {
    id: event.id,
    day: d.toLocaleDateString('en-NG', { day: '2-digit' }),
    month: d.toLocaleDateString('en-NG', { month: 'short' }),
    year: String(d.getFullYear()),
    title: event.title,
    category: eventCategory(event.title),
    venue: event.venue || 'Centre grounds',
    blurb: event.blurb || '',
    status,
    featured: Boolean(event.featured),
  }
}

export default async function EventsPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const [live, page] = await Promise.all([getEvents(doc.id), getPageContent(doc.id, 'events')])

  const todayIso = new Date().toISOString().slice(0, 10)
  const events: EventsViewItem[] =
    live.length > 0 ? live.map((e) => toViewItem(e, todayIso)) : FIGMA_EVENTS

  return (
    <>
      <PageHero
        tenant={tenant}
        patterned
        title={page.heroTitle || 'Events'}
        subtitle={
          page.heroSubtitle || 'Programmes, lectures, and community occasions at the Centre.'
        }
      />
      <EventsClient events={events} />
    </>
  )
}
