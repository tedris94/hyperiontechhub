import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getIslamiyyahClasses, getPageContent } from '@/lib/icms/content'
import { getPublicBaseFromHeaders } from '@/lib/icms/public-base-server'
import PageHero from '@/components/icms/PageHero'
import { ICMS_MEDIA } from '@/lib/icms/media-assets'

type Props = { params: Promise<{ tenant: string }> }

function GoldRule() {
  return <div className="h-px w-full bg-[color:var(--icms-gold)] opacity-55" aria-hidden />
}

export default async function IslamiyyahPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const base = await getPublicBaseFromHeaders(tenant.slug)
  const [classes, page] = await Promise.all([
    getIslamiyyahClasses(doc.id),
    getPageContent(doc.id, 'islamiyyah'),
  ])
  const openCount = classes.filter((c) => c.status === 'Open').length
  const studentSeats = classes.reduce((s, c) => s + c.enrolled, 0)

  return (
    <>
      <PageHero
        tenant={tenant}
        patterned
        title={page.heroTitle || 'Islamiyyah'}
        subtitle={page.heroSubtitle || 'Qur’an, Arabic, and grounded Islamic learning for children and adults.'}
      />

      <section className="icms-section bg-white">
        <div className="icms-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative min-h-[360px] overflow-hidden bg-[color:var(--icms-ivory)] lg:min-h-[520px]">
            <Image
              src={page.imageUrl || ICMS_MEDIA.children}
              alt="Anas Bin Malik Islamic School learning environment"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[color:var(--icms-forest)]/90 to-transparent p-6 pt-20">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
                Anas Bin Malik Islamia Establishment
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              Our story
            </p>
            <h2 className="icms-display mt-3 text-3xl uppercase leading-snug text-[color:var(--icms-forest)] md:text-4xl">
              {page.introHeading || 'Knowledge. Character. Qur’an.'}
            </h2>
            <div className="my-6 h-16 w-px bg-[color:var(--icms-gold)]" />
            <p className="text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
              {page.introBody}
            </p>
            <div className="mt-8 space-y-7">
              {(page.blocks || []).slice(0, 1).map((block) => (
                <div key={block.title}>
                  <h3 className="icms-display text-xl uppercase tracking-wide text-[color:var(--icms-forest)]">
                    {block.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
                    {block.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="icms-section bg-[color:var(--icms-ivory)]">
        <div className="icms-container">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              Purpose and direction
            </p>
            <h2 className="icms-display mt-3 text-3xl uppercase text-[color:var(--icms-forest)] md:text-4xl">
              Mission, vision, and pedagogy
            </h2>
          </div>
          <div className="mt-12 grid gap-10 lg:grid-cols-3">
            {(page.blocks || []).slice(1, 4).map((block) => (
              <article key={block.title} className="border-t border-[color:var(--icms-gold)]/45 pt-5">
                <h3 className="icms-display text-xl uppercase tracking-wide text-[color:var(--icms-forest)]">
                  {block.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[color:var(--icms-warm-gray)]">
                  {block.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--icms-forest)] px-8 py-10 text-white">
        <div className="mx-auto grid w-full max-w-[1280px] gap-8 sm:grid-cols-3">
          <div><p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">Classes</p><p className="icms-display mt-1 text-3xl font-semibold">{classes.length}</p></div>
          <div><p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">Open for enrolment</p><p className="icms-display mt-1 text-3xl font-semibold">{openCount}</p></div>
          <div><p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">Learners enrolled</p><p className="icms-display mt-1 text-3xl font-semibold">{studentSeats}</p></div>
        </div>
      </section>

      <section className="bg-[color:var(--icms-ivory)] px-8 py-20">
        <div className="mx-auto w-full max-w-[1280px]">
          <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
            Our system
          </p>
          <GoldRule />
          {page.schoolFacts?.length ? (
            <div className="mb-14 grid gap-3 border-y border-[color:var(--icms-gold)]/35 py-6 sm:grid-cols-2 lg:grid-cols-3">
              {page.schoolFacts.map((fact) => <p key={fact} className="text-sm leading-relaxed text-[color:var(--icms-charcoal)]">{fact}</p>)}
            </div>
          ) : null}

          <div className="grid gap-8 md:grid-cols-2">
            {(page.schoolPrograms || []).map((program) => (
              <article key={program.title} className="border-t border-[color:var(--icms-gold)]/35 pt-6">
                <h3 className="icms-display text-[1.1rem] font-semibold text-[color:var(--icms-charcoal)]">{program.title}</h3>
                <p className="mt-3 text-[0.88rem] leading-[1.7] text-[color:var(--icms-charcoal)]/85">{program.summary}</p>
                {program.schedule ? <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[color:var(--icms-gold)]">{program.schedule}</p> : null}
                {program.focus ? <p className="mt-3 text-[0.82rem] leading-[1.7] text-[color:var(--icms-warm-gray)]"><strong>Focus:</strong> {program.focus}</p> : null}
                {program.outcomes ? <p className="mt-2 text-[0.82rem] leading-[1.7] text-[color:var(--icms-warm-gray)]"><strong>Outcome:</strong> {program.outcomes}</p> : null}
              </article>
            ))}
          </div>

          {page.schoolGoals?.length ? (
            <div className="mt-16 border-t border-[color:var(--icms-gold)]/35 pt-6">
              <h2 className="icms-display text-[1.35rem] font-semibold text-[color:var(--icms-charcoal)]">Our overall goals</h2>
              <ul className="mt-5 grid gap-3 md:grid-cols-3">
                {page.schoolGoals.map((goal) => <li key={goal} className="border-l-2 border-[color:var(--icms-gold)] pl-4 text-sm leading-relaxed text-[color:var(--icms-charcoal)]">{goal}</li>)}
              </ul>
            </div>
          ) : null}

          {classes.length > 0 ? <>
          <h2 className="mt-16 icms-display text-[1.35rem] font-semibold text-[color:var(--icms-charcoal)]">Current classes</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {classes.map((cls) => {
              const seatsLeft = Math.max(cls.capacity - cls.enrolled, 0)
              return (
                <article
                  key={cls.id}
                  className="border-t border-[color:var(--icms-gold)]/35 pt-6"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <h3 className="icms-display text-[1.05rem] font-semibold text-[color:var(--icms-charcoal)]">
                      {cls.title}
                    </h3>
                    <span
                      className={`text-[0.68rem] font-semibold uppercase tracking-[0.1em] ${
                        cls.status === 'Open'
                          ? 'text-[color:var(--icms-emerald)]'
                          : 'text-[color:var(--icms-warm-gray)]'
                      }`}
                    >
                      {cls.status}
                    </span>
                  </div>
                  <p className="m-0 text-[0.82rem] text-[color:var(--icms-warm-gray)]">
                    {cls.ageGroup}
                    {cls.schedule ? ` · ${cls.schedule}` : ''}
                  </p>
                  {cls.teacher ? (
                    <p className="mt-1 mb-0 text-[0.82rem] text-[color:var(--icms-charcoal)]">
                      Teacher: {cls.teacher}
                    </p>
                  ) : null}
                  {cls.summary ? (
                    <p className="mt-3 mb-0 text-[0.88rem] leading-[1.7] text-[color:var(--icms-charcoal)]/85">
                      {cls.summary}
                    </p>
                  ) : null}
                  <p className="mt-4 mb-0 text-[0.75rem] uppercase tracking-[0.08em] text-[color:var(--icms-gold)]">
                    {cls.enrolled}/{cls.capacity || '—'} enrolled
                    {cls.status === 'Open' && seatsLeft > 0 ? ` · ${seatsLeft} seats left` : ''}
                  </p>
                </article>
              )
            })}
          </div>
          </> : null}

          <div className="mt-16 flex flex-wrap gap-4">
            <Link href={`${base}/contact`} className="icms-btn-primary">
              Enquire to enrol
            </Link>
            <Link
              href={`${base}/donate`}
              className="rounded border border-[color:var(--icms-emerald)] px-6 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-emerald)]"
            >
              Support Education fund
            </Link>
          </div>
        </div>
      </section>

      <section className="icms-section bg-white">
        <div className="icms-container grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              Leadership and governance
            </p>
            <h2 className="icms-display mt-3 text-3xl uppercase text-[color:var(--icms-forest)]">
              A school held in trust
            </h2>
            <div className="mt-8 space-y-7 text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
              <p><strong className="text-[color:var(--icms-forest)]">Leadership:</strong> Headed by Mukhtar Harun Muhammad who is giving efforts to build the academic and moral foundation of the school.</p>
              <p><strong className="text-[color:var(--icms-forest)]">Governance:</strong> Supervised by a 6-member Governing Board appointed by AMMSSCO Islamic center management.</p>
            </div>
          </div>
          <div className="border-l border-[color:var(--icms-gold)]/45 pl-8 lg:pl-12">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              Visit us / enquiries
            </p>
            <h2 className="icms-display mt-3 text-3xl uppercase text-[color:var(--icms-forest)]">
              Begin the conversation
            </h2>
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
              <p><strong className="text-[color:var(--icms-forest)]">Location:</strong> AMMSSCO Platinum City, Galadimawa, Abuja</p>
              <p><strong className="text-[color:var(--icms-forest)]">Phone:</strong> 08063237993 or 09018909640</p>
              <p>We welcome parents, guardians, and adult learners who wish to join us in this mission of <em>Knowledge. Character. Qur’an.</em></p>
              <p className="pt-3 font-semibold text-[color:var(--icms-forest)]">Barakallahu feekum.</p>
            </div>
            <Link href={`${base}/contact`} className="icms-btn-primary mt-8 inline-flex">
              Enquire with the school
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
