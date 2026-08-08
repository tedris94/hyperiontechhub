import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { formatNaira, getWaqfProjects } from '@/lib/icms/content'
import { getPublicBaseFromHeaders } from '@/lib/icms/public-base-server'
import PageHero from '@/components/icms/PageHero'

type Props = { params: Promise<{ tenant: string }> }

const MOSQUE_ENRICHMENT = {
  description:
    "A permanent endowment to fund the running costs of the mosque — electricity, maintenance, wudhu' facilities, and the Imam's honorarium — without reliance on weekly collections. Once the target is reached, returns from invested principal sustain operations indefinitely.",
  updates: [
    'Electrical rewiring of the main hall completed — March 2026',
    'Air conditioning serviced and refrigerant recharged — May 2026',
    'Investment of first tranche into CBN-compliant instrument — June 2026',
  ],
}

const ISLAMIYYAH_ENRICHMENT = {
  description:
    'Endowment to fund teacher salaries, learning materials, and building maintenance for the Islamiyyah school — ensuring education continues regardless of enrolment fluctuations. Includes a scholarship sub-fund for students from low-income households.',
  updates: [
    'Four new classrooms furnished with desks and whiteboards — January 2026',
    'Twelve scholarship awards issued for the 2025–2026 academic year',
    'Curriculum development for the new Aqeedah module — ongoing',
  ],
}

const GENERIC_UPDATES = [
  'Project governance and reporting cadence established',
  'Community briefing held for prospective contributors',
  'Stewardship review scheduled for the current quarter',
]

const WAQF_STEPS = [
  {
    step: '01',
    title: 'You contribute',
    body: 'You donate any amount to a named Waqf project. The contribution is recorded in your name as a Sadaqah Jariyah — a continuous charity.',
  },
  {
    step: '02',
    title: 'The principal is preserved',
    body: "Your contribution is pooled with others and invested in Shari'ah-compliant instruments. The principal itself is never spent.",
  },
  {
    step: '03',
    title: 'Returns fund the purpose',
    body: 'Annual returns from the investment are used exclusively for the stated purpose — mosque running costs, teacher salaries, scholarships.',
  },
  {
    step: '04',
    title: 'Reward continues',
    body: 'As long as the endowment is active and the community benefits, your reward accumulates — even long after your passing.',
  },
]

function GoldRule({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-px w-full bg-[color:var(--icms-gold)] opacity-55 ${className}`}
      aria-hidden
    />
  )
}

function enrichProject(title: string, summary: string) {
  const t = title.toLowerCase()
  if (t.includes('mosque') || t.includes('facility')) {
    return {
      description: MOSQUE_ENRICHMENT.description,
      updates: MOSQUE_ENRICHMENT.updates,
    }
  }
  if (t.includes('islamiyyah') || t.includes('school') || t.includes('learning')) {
    return {
      description: ISLAMIYYAH_ENRICHMENT.description,
      updates: ISLAMIYYAH_ENRICHMENT.updates,
    }
  }
  return {
    description:
      summary ||
      'A permanent endowment dedicated to continuous community benefit, with principal preserved and returns applied to the stated purpose.',
    updates: GENERIC_UPDATES,
  }
}

export default async function WaqfPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const waqfProjects = await getWaqfProjects(doc.id)
  const base = await getPublicBaseFromHeaders(tenant.slug)

  const projects = waqfProjects.map((project, index) => {
    const goal = index === 0 ? 50_000_000 : 20_000_000
    const pct = Math.min(100, Math.max(0, Number(project.progress) || 0))
    const raised = Math.round((goal * pct) / 100)
    const enriched = enrichProject(project.title, project.summary)
    return {
      id: project.id,
      title: project.title,
      description: enriched.description,
      updates: enriched.updates,
      goal,
      raised,
      pct,
      status: 'Active — accepting contributions',
    }
  })

  return (
    <>
      <PageHero
        tenant={tenant}
        patterned
        title="Waqf & Endowments"
        subtitle="Leave a legacy that serves the community long after your lifetime — through the Islamic tradition of permanent endowment."
      />

      {/* Understanding Waqf */}
      <section className="bg-[color:var(--icms-ivory)] px-8 py-20">
        <div className="mx-auto grid w-full max-w-[1280px] items-start gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-20">
          <div>
            <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
              Understanding Waqf
            </p>
            <GoldRule />
            <h2 className="icms-display mt-3 text-3xl uppercase leading-snug text-[color:var(--icms-forest)] md:text-4xl">
              An Institution as Old as Islam Itself
            </h2>

            <p
              className="icms-arabic mt-7 text-right text-[1.3rem] leading-relaxed text-[color:var(--icms-gold)]"
              dir="rtl"
            >
              إِذَا مَاتَ الْإِنسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: صَدَقَةٌ جَارِيَةٌ
            </p>
            <p className="mb-6 mt-2 text-[0.72rem] italic text-[color:var(--icms-warm-gray)]">
              &ldquo;When a person dies his deeds cease, except for three: a continuing
              charity…&rdquo; — Sahih Muslim
            </p>
            <p className="mb-4 text-[0.88rem] leading-[1.85] text-[color:var(--icms-charcoal)]/85">
              A Waqf (pl. Awqaf) is an Islamic endowment — a portion of wealth set aside
              permanently in the name of Allah, whose benefit flows continuously to the
              community. The principal is preserved; only its returns are spent.
            </p>
            <p className="mb-4 text-[0.88rem] leading-[1.85] text-[color:var(--icms-charcoal)]/85">
              Historically, Awqaf funded universities (including al-Azhar), hospitals,
              libraries, and public infrastructure across the Muslim world. The institution
              ensured that critical services were never held hostage to political cycles or
              donor fatigue.
            </p>
            <p className="text-[0.88rem] leading-[1.85] text-[color:var(--icms-charcoal)]/85">
              At {tenant.shortName}, we are rebuilding this tradition in Abuja — starting
              with our mosque and school, with the intention of expanding as the endowment
              grows.
            </p>
          </div>

          <div>
            <p className="icms-display mb-6 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
              How a Waqf contribution works
            </p>
            <div className="flex flex-col">
              {WAQF_STEPS.map(({ step, title, body }, i) => (
                <div key={step}>
                  <div className="grid grid-cols-[48px_1fr] items-start gap-5 py-6">
                    <div className="pt-0.5 text-center">
                      <p className="icms-display text-xl font-bold leading-none text-[color:var(--icms-gold)]/60">
                        {step}
                      </p>
                    </div>
                    <div>
                      <p className="icms-display mb-1.5 text-[0.95rem] font-semibold text-[color:var(--icms-charcoal)]">
                        {title}
                      </p>
                      <p className="text-[0.83rem] leading-relaxed text-[color:var(--icms-warm-gray)]">
                        {body}
                      </p>
                    </div>
                  </div>
                  {i < WAQF_STEPS.length - 1 && (
                    <div className="h-px w-full bg-[color:var(--icms-gold)] opacity-14" aria-hidden />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Current Projects */}
      <section
        className="border-t border-[color:var(--icms-gold)]/13 px-8 py-20"
        style={{ background: '#F2EFE7' }}
      >
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="mb-12">
            <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
              Current Projects
            </p>
            <GoldRule />
            <h2 className="icms-display mt-3 text-3xl uppercase leading-snug text-[color:var(--icms-forest)] md:text-4xl">
              Active Waqf Funds
            </h2>
          </div>

          <div className="flex flex-col">
            {projects.map((project) => (
              <article
                key={project.id}
                className="border-t-2 border-[color:var(--icms-gold)] py-10"
              >
                <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] md:gap-16">
                  <div>
                    <p className="mb-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
                      Waqf Project
                    </p>
                    <h3 className="icms-display mb-4 text-[clamp(1.1rem,2vw,1.5rem)] font-bold leading-snug text-[color:var(--icms-charcoal)]">
                      {project.title}
                    </h3>
                    <p className="mb-6 text-[0.88rem] leading-[1.85] text-[color:var(--icms-charcoal)]/85">
                      {project.description}
                    </p>

                    <div className="mb-6">
                      <div className="mb-2 flex justify-between text-xs text-[color:var(--icms-warm-gray)]">
                        <span>
                          Raised:{' '}
                          <strong className="font-semibold text-[color:var(--icms-charcoal)]">
                            {formatNaira(project.raised)}
                          </strong>
                        </span>
                        <span>
                          Goal:{' '}
                          <strong className="font-semibold text-[color:var(--icms-charcoal)]">
                            {formatNaira(project.goal)}
                          </strong>
                        </span>
                      </div>
                      <div className="h-1 rounded-sm bg-[color:var(--icms-gold)]/16">
                        <div
                          className="h-full rounded-sm bg-[color:var(--icms-gold)] transition-[width] duration-500"
                          style={{ width: `${project.pct}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-[0.7rem] text-[color:var(--icms-warm-gray)]">
                        {project.pct}% of target reached
                      </p>
                    </div>

                    <p className="mb-5 text-[0.72rem] font-medium text-[color:var(--icms-emerald)]">
                      ● {project.status}
                    </p>

                    <Link
                      href={`${base}/donate`}
                      className="icms-btn-primary text-[0.76rem] uppercase tracking-[0.1em]"
                    >
                      Contribute to this Waqf
                    </Link>
                  </div>

                  <div className="rounded border border-[color:var(--icms-gold)]/13 bg-[color:var(--icms-ivory)] p-6">
                    <p className="icms-display mb-3 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-[color:var(--icms-gold)]">
                      Recent Updates
                    </p>
                    <div className="mb-4 h-px w-full bg-[color:var(--icms-gold)] opacity-25" aria-hidden />
                    <ul className="flex flex-col gap-3">
                      {project.updates.map((u) => (
                        <li key={u} className="flex items-start gap-2.5">
                          <span className="mt-0.5 shrink-0 text-[color:var(--icms-gold)]">—</span>
                          <span className="text-[0.82rem] leading-relaxed text-[color:var(--icms-charcoal)]/85">
                            {u}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}

            {projects.length === 0 && (
              <p className="py-8 text-[0.88rem] text-[color:var(--icms-warm-gray)]">
                No active Waqf projects are listed yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
