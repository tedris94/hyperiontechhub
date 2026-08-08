import { C, F } from '@/tokens'
import { GoldRule, SectionLabel, SectionHeading, PageHero } from '@/components/Shared'

// Illustrative prayer times for Abuja — one week
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TABLE_DATA: Record<string, string[]> = {
  Fajr:    ['5:12', '5:12', '5:11', '5:11', '5:10', '5:10', '5:11'],
  Shuruq:  ['6:38', '6:38', '6:37', '6:37', '6:36', '6:36', '6:37'],
  Dhuhr:   ['12:48','12:48','12:48','12:47','12:47','12:47','12:48'],
  Asr:     ['4:05', '4:05', '4:04', '4:04', '4:03', '4:03', '4:04'],
  Maghrib: ['6:52', '6:51', '6:51', '6:50', '6:50', '6:50', '6:51'],
  Isha:    ['8:10', '8:10', '8:09', '8:09', '8:08', '8:08', '8:09'],
}
const PRAYER_NAMES = Object.keys(TABLE_DATA)

const TODAY_IDX = 0 // Monday

const FACILITIES = [
  { label: 'Main Prayer Hall', desc: "Capacity for 800 worshippers. Separate sisters' gallery on the upper level." },
  { label: "Wudhu' Facilities", desc: "Ablution areas for brothers and sisters, maintained to a high standard of cleanliness." },
  { label: 'Islamiyyah Classrooms', desc: "Six classrooms for children's Islamic education, operated weekday evenings and Saturday mornings." },
  { label: 'Library', desc: 'A growing collection of classical and contemporary Islamic texts, open to members.' },
  { label: 'Welfare Office', desc: 'Administers Zakat distributions, widow support, and emergency assistance referrals.' },
  { label: 'Parking', desc: 'On-site parking within the AMSSCO Platinum City Estate for Friday congregation and events.' },
]

function OverviewSection() {
  return (
    <section style={{ background: C.ivory, padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '5rem', alignItems: 'start' }}>
        <div>
          <SectionLabel>The Mosque</SectionLabel>
          <GoldRule />
          <SectionHeading style={{ marginTop: '0.75rem' }}>A Place of Prayer, Remembrance &amp; Community</SectionHeading>

          <p style={{ fontFamily: F.body, fontSize: '0.9rem', color: C.charcoal, lineHeight: 1.85, opacity: 0.85, margin: '1.5rem 0 1rem' }}>
            The mosque at Anas bn Malik Islamic Centre is the heart of community life in Galadimawa. Five times every day, believers gather here to stand before Allah in prayer — a rhythm of remembrance that anchors individual and family life alike.
          </p>
          <p style={{ fontFamily: F.body, fontSize: '0.9rem', color: C.charcoal, lineHeight: 1.85, opacity: 0.85, margin: '0 0 1rem' }}>
            On Fridays, the congregation swells for Salat al-Jum'uah. The Khutbah addresses matters of faith, community welfare, and contemporary Islamic life — delivered with scholarship and care. Visitors are always welcome.
          </p>
          <p style={{ fontFamily: F.body, fontSize: '0.9rem', color: C.charcoal, lineHeight: 1.85, opacity: 0.85, margin: 0 }}>
            Beyond the daily prayers, the mosque building houses our Islamiyyah school, library, and welfare office — making it a centre for the whole of life, not only its spiritual dimension.
          </p>

          <div style={{ marginTop: '2rem', padding: '1.5rem', borderLeft: `3px solid ${C.gold}`, background: C.ivoryDim }}>
            <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.5rem' }}>Jum'uah</p>
            <p style={{ fontFamily: F.body, fontSize: '0.88rem', color: C.charcoal, margin: '0 0 0.25rem', lineHeight: 1.6 }}>
              First Adhan: <strong>12:30 PM</strong> &nbsp;·&nbsp; Khutbah begins: <strong>1:00 PM</strong>
            </p>
            <p style={{ fontFamily: F.body, fontSize: '0.82rem', color: C.gray, margin: 0 }}>
              Sisters' congregation accommodated in the upper gallery. Entry from the eastern staircase.
            </p>
          </div>
        </div>

        {/* Facilities */}
        <div>
          <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, margin: '0 0 1.25rem' }}>
            Facilities
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {FACILITIES.map((f, i) => (
              <div key={f.label}>
                <div style={{ padding: '1.1rem 0', display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1.5rem' }}>
                  <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.85rem', color: C.charcoal, margin: 0 }}>{f.label}</p>
                  <p style={{ fontFamily: F.body, fontSize: '0.83rem', color: C.gray, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
                {i < FACILITIES.length - 1 && <div style={{ height: 1, background: C.gold, opacity: 0.15 }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TodayStrip() {
  return (
    <section style={{ background: C.emerald, padding: '0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 0 0', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, margin: 0 }}>
            Today — Monday 4 August 2026
          </p>
          <p style={{ fontFamily: F.body, fontSize: '0.7rem', color: `${C.ivory}66`, margin: 0 }}>
            Abuja, FCT · Illustrative demo times
          </p>
        </div>
        <GoldRule style={{ margin: '0.75rem 0' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', paddingBottom: '1.2rem' }}>
          {PRAYER_NAMES.map((name, i) => (
            <div key={name} style={{ padding: '0.4rem 0', borderRight: i < PRAYER_NAMES.length - 1 ? `1px solid ${C.gold}28` : 'none', textAlign: 'center' }}>
              <p style={{ fontFamily: F.body, fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.2rem' }}>{name}</p>
              <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.95rem', color: C.ivory, margin: 0 }}>{TABLE_DATA[name][TODAY_IDX]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PrayerTable() {
  return (
    <section style={{ background: C.ivoryDim, padding: '5rem 2rem', borderTop: `1px solid ${C.gold}22` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <SectionLabel>Weekly Timetable</SectionLabel>
          <GoldRule />
          <SectionHeading style={{ marginTop: '0.75rem' }}>Prayer Times — August 2026</SectionHeading>
          <p style={{ fontFamily: F.body, fontSize: '0.78rem', color: C.gray, marginTop: '0.75rem' }}>
            All times are illustrative demo data for Abuja, FCT. Verify locally before reliance.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.body }}>
            <thead>
              <tr>
                <th style={{ ...TH, textAlign: 'left', width: 100 }}>Prayer</th>
                {DAYS.map((day, i) => (
                  <th key={day} style={{ ...TH, background: i === TODAY_IDX ? `${C.emerald}18` : 'transparent', color: i === TODAY_IDX ? C.emerald : C.gray }}>
                    {day}
                    {i === TODAY_IDX && (
                      <span style={{ display: 'block', fontFamily: F.body, fontSize: '0.55rem', fontWeight: 500, color: C.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.15rem' }}>Today</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRAYER_NAMES.map((prayer, ri) => (
                <tr key={prayer} style={{ background: ri % 2 === 0 ? C.ivory : C.ivoryDim }}>
                  <td style={{ ...TD, fontFamily: F.display, fontWeight: 600, fontSize: '0.82rem', color: C.charcoal }}>
                    {prayer}
                  </td>
                  {TABLE_DATA[prayer].map((time, ci) => (
                    <td key={ci} style={{ ...TD, background: ci === TODAY_IDX ? `${C.emerald}10` : 'transparent', color: ci === TODAY_IDX ? C.emerald : C.charcoal, fontWeight: ci === TODAY_IDX ? 600 : 400 }}>
                      {time}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

const TH: React.CSSProperties = {
  fontFamily: F.body,
  fontWeight: 600,
  fontSize: '0.7rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: C.gray,
  padding: '0.75rem 1rem',
  borderBottom: `2px solid ${C.gold}33`,
  textAlign: 'center',
}

const TD: React.CSSProperties = {
  fontFamily: F.body,
  fontSize: '0.88rem',
  color: C.charcoal,
  padding: '0.75rem 1rem',
  textAlign: 'center',
  borderBottom: `1px solid ${C.gold}18`,
}

export default function Mosque() {
  return (
    <>
      <PageHero
        title="The Mosque &amp; Prayer Times"
        subtitle="The house of Allah at Galadimawa — open for worship, learning, and community five times every day."
      />
      <TodayStrip />
      <OverviewSection />
      <PrayerTable />
    </>
  )
}
