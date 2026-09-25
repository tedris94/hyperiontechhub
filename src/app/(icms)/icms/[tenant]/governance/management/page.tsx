import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getPublicBaseFromHeaders } from '@/lib/icms/public-base-server'
import { ANAS_MANAGEMENT } from '@/lib/icms/anas-governance'
import PageHero from '@/components/icms/PageHero'

type Props = { params: Promise<{ tenant: string }> }

export default async function ManagementCommitteePage({ params }: Props) {
  const { tenant: slug } = await params
  if (slug !== 'anas-bn-malik') notFound()
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const base = await getPublicBaseFromHeaders(tenant.slug)
  const content = ANAS_MANAGEMENT

  return (
    <>
      <PageHero
        tenant={tenant}
        patterned
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />

      <section className="icms-section bg-white">
        <div className="icms-container">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
            Purpose
          </p>
          <h2 className="icms-display mt-3 text-3xl uppercase text-[color:var(--icms-forest)] md:text-4xl">
            {content.purposeHeading}
          </h2>
          <div className="mt-8 max-w-3xl space-y-5 whitespace-pre-line text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
            {content.purposeBody}
          </div>
        </div>
      </section>

      <section className="icms-section bg-[color:var(--icms-ivory)]">
        <div className="icms-container">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
            Responsibilities
          </p>
          <h2 className="icms-display mt-3 text-3xl uppercase text-[color:var(--icms-forest)] md:text-4xl">
            {content.functionsHeading}
          </h2>
          <ul className="mt-10 max-w-4xl space-y-4">
            {content.functions.map((item, index) => (
              <li
                key={item}
                className="flex gap-4 border-t border-[color:var(--icms-gold)]/35 pt-4 text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base"
              >
                <span className="icms-display shrink-0 text-lg text-[color:var(--icms-gold)]/70">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="icms-section bg-white">
        <div className="icms-container">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
            Membership
          </p>
          <h2 className="icms-display mt-3 text-3xl uppercase text-[color:var(--icms-forest)]">
            {content.compositionHeading}
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
            {content.compositionIntro}
          </p>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.compositionRoles.map((role) => (
              <li
                key={role}
                className="border border-[color:var(--icms-gold)]/30 bg-[color:var(--icms-ivory)]/50 px-4 py-3 text-sm font-medium text-[color:var(--icms-forest)]"
              >
                {role}
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
            {content.closing}
          </p>
        </div>
      </section>

      <section className="border-t border-black/5 bg-[color:var(--icms-ivory)] py-10">
        <div className="icms-container flex flex-wrap items-center justify-center gap-4 px-4">
          <Link href={`${base}/governance/board`} className="icms-btn-secondary">
            Board of Trustees
          </Link>
          <Link href={`${base}/about#administrative-structure`} className="icms-btn-primary">
            View sub-committees
          </Link>
        </div>
      </section>
    </>
  )
}
