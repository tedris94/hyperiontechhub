import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getIslamiyyahClasses } from '@/lib/icms/content'
import { getPublicBaseFromHeaders } from '@/lib/icms/public-base-server'
import PageHero from '@/components/icms/PageHero'

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
  const classes = await getIslamiyyahClasses(doc.id)
  const openCount = classes.filter((c) => c.status === 'Open').length
  const studentSeats = classes.reduce((s, c) => s + c.enrolled, 0)

  return (
    <>
      <PageHero
        tenant={tenant}
        patterned
        title="Islamiyyah"
        subtitle="Qur’an, tajweed, and grounded Islamic learning for children, youth, and adults — managed as part of the centre."
      />

      <section className="bg-[color:var(--icms-forest)] px-8 py-10 text-white">
        <div className="mx-auto grid w-full max-w-[1280px] gap-8 sm:grid-cols-3">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
              Classes
            </p>
            <p className="icms-display mt-1 text-3xl font-semibold">{classes.length}</p>
          </div>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
              Open for enrolment
            </p>
            <p className="icms-display mt-1 text-3xl font-semibold">{openCount}</p>
          </div>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
              Learners enrolled
            </p>
            <p className="icms-display mt-1 text-3xl font-semibold">{studentSeats}</p>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--icms-ivory)] px-8 py-20">
        <div className="mx-auto w-full max-w-[1280px]">
          <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
            Programme
          </p>
          <GoldRule />
          <div className="mt-6 mb-14 max-w-2xl">
            <h2 className="icms-display text-[1.35rem] font-semibold text-[color:var(--icms-charcoal)]">
              A school within the centre
            </h2>
            <p className="mt-3 text-[0.92rem] leading-[1.75] text-[color:var(--icms-warm-gray)]">
              Our Islamiyyah runs weekday evenings and weekends in dedicated classrooms. Curriculum
              is overseen by the Director of Education, with scholarship support for families who
              need it. Enrolment is handled by the centre office — use Contact to register a
              learner.
            </p>
          </div>

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
    </>
  )
}
