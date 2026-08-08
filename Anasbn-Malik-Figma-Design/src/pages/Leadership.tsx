import { C, F } from '@/tokens'
import { GoldRule, SectionLabel, SectionHeading, PageHero } from '@/components/Shared'

type Person = {
  name: string
  role: string
  group: string
  bio: string
}

const PEOPLE: Person[] = [
  {
    name: 'Sheikh Ibrahim al-Amin',
    role: 'Chief Imam',
    group: 'Imams',
    bio: 'Graduate of the Islamic University of Madinah. Leads the five daily prayers, Friday Khutbah, and scholarly counsel at the Centre since its founding.',
  },
  {
    name: 'Sheikh Musa Abdullahi',
    role: 'Deputy Imam & Tafsir Lecturer',
    group: 'Imams',
    bio: 'Specialist in Quranic exegesis. Leads the weekly Tafsir circle and the Islamiyyah curriculum in Fiqh and Aqeedah.',
  },
  {
    name: 'Alhaji Sulaiman Danladi',
    role: 'Executive Director',
    group: 'Directors',
    bio: 'Oversees day-to-day administration, strategic planning, and donor relations. Brings twenty years of nonprofit governance experience to the Centre.',
  },
  {
    name: 'Hajia Fatimah Yusuf',
    role: 'Director of Education',
    group: 'Directors',
    bio: 'Leads the Islamiyyah school, adult learning programme, and youth tarbiyah initiatives. Former principal at a Lagos Islamic secondary school.',
  },
  {
    name: 'Alhaji Umar Bello',
    role: 'Director of Finance &amp; Waqf',
    group: 'Directors',
    bio: 'Chartered accountant. Manages endowment investments, annual accounts, and Zakat distribution with full transparency reporting.',
  },
  {
    name: 'Dr. Aisha Muhammad-Bello',
    role: 'Chair, Welfare Committee',
    group: 'Committee',
    bio: "Medical doctor and community volunteer. Coordinates the Centre's health outreach, widow support, and student scholarship programmes.",
  },
  {
    name: 'Engr. Kabir Idris',
    role: 'Chair, Facilities Committee',
    group: 'Committee',
    bio: 'Civil engineer. Supervises mosque maintenance, expansion planning, and oversight of capital projects funded through the Waqf.',
  },
  {
    name: 'Mallam Ridwan Suleiman',
    role: 'Secretary-General',
    group: 'Committee',
    bio: 'Manages official correspondence, board minutes, and community communications. Qualified in law and Islamic studies.',
  },
]

const GROUPS = ['Imams', 'Directors', 'Committee']

function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter(w => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map(w => w[0])
    .join('')

  return (
    <div style={{
      width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
      background: C.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: `2px solid ${C.gold}55`,
    }}>
      <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: '1.1rem', color: C.ivory }}>{initials}</span>
    </div>
  )
}

function DirectoryGroup({ group, people }: { group: string; people: Person[] }) {
  return (
    <div style={{ marginBottom: '3.5rem' }}>
      {/* Group header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, margin: 0, whiteSpace: 'nowrap' }}>
          {group}
        </p>
        <div style={{ flex: 1, height: 1, background: C.gold, opacity: 0.25 }} />
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {people.map((person, i) => (
          <div key={person.name}>
            <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: '1.5rem', alignItems: 'center', padding: '1.25rem 0' }}>
              <AvatarPlaceholder name={person.name} />

              <div>
                <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '1rem', color: C.charcoal, margin: '0 0 0.2rem' }}
                   dangerouslySetInnerHTML={{ __html: person.name }} />
                <p style={{ fontFamily: F.body, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.5rem' }}
                   dangerouslySetInnerHTML={{ __html: person.role }} />
                <p style={{ fontFamily: F.body, fontSize: '0.83rem', color: C.gray, lineHeight: 1.65, margin: 0 }}>{person.bio}</p>
              </div>

              <a
                href="#"
                style={{
                  fontFamily: F.body, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em',
                  color: C.emerald, textDecoration: 'none', whiteSpace: 'nowrap',
                  borderBottom: `1px solid ${C.emerald}55`, paddingBottom: '0.1rem',
                  flexShrink: 0,
                }}
              >
                View profile
              </a>
            </div>
            {i < people.length - 1 && <div style={{ height: 1, background: C.gold, opacity: 0.12 }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Leadership() {
  return (
    <>
      <PageHero
        title="Leadership"
        subtitle="Those entrusted with the governance, scholarship, and welfare of the Centre."
      />

      <section style={{ background: C.ivory, padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: '3.5rem' }}>
            <SectionLabel>Directory</SectionLabel>
            <GoldRule />
            <SectionHeading style={{ marginTop: '0.75rem' }}>Imams, Directors &amp; Committee</SectionHeading>
          </div>

          {GROUPS.map(group => (
            <DirectoryGroup
              key={group}
              group={group}
              people={PEOPLE.filter(p => p.group === group)}
            />
          ))}
        </div>
      </section>
    </>
  )
}
