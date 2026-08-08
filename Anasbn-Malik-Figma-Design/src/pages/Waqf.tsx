import { C, F } from '@/tokens'
import { GoldRule, SectionLabel, SectionHeading, PageHero } from '@/components/Shared'
import { Link } from 'react-router'

type Project = {
  title: string
  description: string
  goal: string
  raised: string
  pct: number
  status: string
  updates: string[]
}

const PROJECTS: Project[] = [
  {
    title: 'Mosque Endowment Fund',
    description: "A permanent endowment to fund the running costs of the mosque — electricity, maintenance, wudhu' facilities, and the Imam's honorarium — without reliance on weekly collections. Once the target is reached, returns from invested principal sustain operations indefinitely.",
    goal: '₦50,000,000',
    raised: '₦28,200,000',
    pct: 56,
    status: 'Active — accepting contributions',
    updates: [
      'Electrical rewiring of the main hall completed — March 2026',
      'Air conditioning serviced and refrigerant recharged — May 2026',
      'Investment of first tranche into CBN-compliant instrument — June 2026',
    ],
  },
  {
    title: 'Islamiyyah School Support',
    description: 'Endowment to fund teacher salaries, learning materials, and building maintenance for the Islamiyyah school — ensuring education continues regardless of enrolment fluctuations. Includes a scholarship sub-fund for students from low-income households.',
    goal: '₦20,000,000',
    raised: '₦6,400,000',
    pct: 32,
    status: 'Active — accepting contributions',
    updates: [
      'Four new classrooms furnished with desks and whiteboards — January 2026',
      'Twelve scholarship awards issued for the 2025–2026 academic year',
      'Curriculum development for the new Aqeedah module — ongoing',
    ],
  },
]

function WaqfExplainer() {
  return (
    <section style={{ background: C.ivory, padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)', gap: '5rem', alignItems: 'start' }}>
        <div>
          <SectionLabel>Understanding Waqf</SectionLabel>
          <GoldRule />
          <SectionHeading style={{ marginTop: '0.75rem' }}>An Institution as Old as Islam Itself</SectionHeading>

          <p style={{ fontFamily: F.arabic, fontSize: '1.3rem', color: C.gold, margin: '1.75rem 0 0.5rem', direction: 'rtl', textAlign: 'right', lineHeight: 1.8 }}>
            إِذَا مَاتَ الْإِنسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: صَدَقَةٌ جَارِيَةٌ
          </p>
          <p style={{ fontFamily: F.body, fontSize: '0.72rem', fontStyle: 'italic', color: C.gray, margin: '0 0 1.5rem' }}>
            "When a person dies his deeds cease, except for three: a continuing charity…" — Sahih Muslim
          </p>
          <p style={{ fontFamily: F.body, fontSize: '0.88rem', color: C.charcoal, lineHeight: 1.85, opacity: 0.85, margin: '0 0 1rem' }}>
            A Waqf (pl. Awqaf) is an Islamic endowment — a portion of wealth set aside permanently in the name of Allah, whose benefit flows continuously to the community. The principal is preserved; only its returns are spent.
          </p>
          <p style={{ fontFamily: F.body, fontSize: '0.88rem', color: C.charcoal, lineHeight: 1.85, opacity: 0.85, margin: '0 0 1rem' }}>
            Historically, Awqaf funded universities (including al-Azhar), hospitals, libraries, and public infrastructure across the Muslim world. The institution ensured that critical services were never held hostage to political cycles or donor fatigue.
          </p>
          <p style={{ fontFamily: F.body, fontSize: '0.88rem', color: C.charcoal, lineHeight: 1.85, opacity: 0.85 }}>
            At Anas bn Malik Islamic Centre, we are rebuilding this tradition in Abuja — starting with our mosque and school, with the intention of expanding as the endowment grows.
          </p>
        </div>

        {/* How it works */}
        <div>
          <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, margin: '0 0 1.5rem' }}>
            How a Waqf contribution works
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { step: '01', title: 'You contribute', body: 'You donate any amount to a named Waqf project. The contribution is recorded in your name as a Sadaqah Jariyah — a continuous charity.' },
              { step: '02', title: 'The principal is preserved', body: "Your contribution is pooled with others and invested in Shari'ah-compliant instruments. The principal itself is never spent." },
              { step: '03', title: 'Returns fund the purpose', body: 'Annual returns from the investment are used exclusively for the stated purpose — mosque running costs, teacher salaries, scholarships.' },
              { step: '04', title: 'Reward continues', body: 'As long as the endowment is active and the community benefits, your reward accumulates — even long after your passing.' },
            ].map(({ step, title, body }, i, arr) => (
              <div key={step}>
                <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: '1.25rem', padding: '1.5rem 0', alignItems: 'start' }}>
                  <div style={{ textAlign: 'center', paddingTop: '0.1rem' }}>
                    <p style={{ fontFamily: F.display, fontWeight: 700, fontSize: '1.25rem', color: C.gold, margin: 0, opacity: 0.6, lineHeight: 1 }}>{step}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.95rem', color: C.charcoal, margin: '0 0 0.4rem' }}>{title}</p>
                    <p style={{ fontFamily: F.body, fontSize: '0.83rem', color: C.gray, lineHeight: 1.7, margin: 0 }}>{body}</p>
                  </div>
                </div>
                {i < arr.length - 1 && <div style={{ height: 1, background: C.gold, opacity: 0.14 }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectBlock({ project }: { project: Project }) {
  return (
    <div style={{ borderTop: `2px solid ${C.gold}`, paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,0.7fr)', gap: '4rem', alignItems: 'start' }}>
        {/* Left */}
        <div>
          <p style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.6rem' }}>
            Waqf Project
          </p>
          <h3 style={{ fontFamily: F.display, fontWeight: 700, fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: C.charcoal, margin: '0 0 1rem', lineHeight: 1.25 }}>
            {project.title}
          </h3>
          <p style={{ fontFamily: F.body, fontSize: '0.88rem', color: C.charcoal, lineHeight: 1.85, opacity: 0.85, margin: '0 0 1.5rem' }}>
            {project.description}
          </p>

          {/* Progress */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: F.body, fontSize: '0.75rem', color: C.gray }}>Raised: <strong style={{ color: C.charcoal }}>{project.raised}</strong></span>
              <span style={{ fontFamily: F.body, fontSize: '0.75rem', color: C.gray }}>Goal: <strong style={{ color: C.charcoal }}>{project.goal}</strong></span>
            </div>
            <div style={{ height: 4, background: `${C.gold}28`, borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${project.pct}%`, background: C.gold, borderRadius: 2, transition: 'width 0.6s ease' }} />
            </div>
            <p style={{ fontFamily: F.body, fontSize: '0.7rem', color: C.gray, margin: '0.4rem 0 0' }}>
              {project.pct}% of target reached
            </p>
          </div>

          <p style={{ fontFamily: F.body, fontSize: '0.72rem', color: C.emerald, fontWeight: 500, margin: '0 0 1.25rem' }}>
            ● {project.status}
          </p>

          <Link to="/donate" style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.76rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.75rem 1.75rem', background: C.emerald, color: C.ivory, borderRadius: 4, textDecoration: 'none', display: 'inline-block' }}>
            Contribute to this Waqf
          </Link>
        </div>

        {/* Right — updates */}
        <div style={{ background: C.ivoryDim, borderRadius: 4, padding: '1.5rem', border: `1px solid ${C.gold}22` }}>
          <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.75rem' }}>
            Recent Updates
          </p>
          <div style={{ height: 1, background: C.gold, opacity: 0.25, marginBottom: '1rem' }} />
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {project.updates.map(u => (
              <li key={u} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <span style={{ color: C.gold, flexShrink: 0, marginTop: '0.2rem' }}>—</span>
                <span style={{ fontFamily: F.body, fontSize: '0.82rem', color: C.charcoal, lineHeight: 1.65, opacity: 0.85 }}>{u}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function Waqf() {
  return (
    <>
      <PageHero
        title="Waqf &amp; Endowments"
        subtitle="Leave a legacy that serves the community long after your lifetime — through the Islamic tradition of permanent endowment."
      />
      <WaqfExplainer />

      <section style={{ background: C.ivoryDim, padding: '5rem 2rem', borderTop: `1px solid ${C.gold}22` }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <SectionLabel>Current Projects</SectionLabel>
            <GoldRule />
            <SectionHeading style={{ marginTop: '0.75rem' }}>Active Waqf Funds</SectionHeading>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PROJECTS.map(p => <ProjectBlock key={p.title} project={p} />)}
          </div>
        </div>
      </section>
    </>
  )
}
