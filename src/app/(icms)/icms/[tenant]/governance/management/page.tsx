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
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {content.functionGroups.map((group, index) => (
              <article key={group.title} className="border-t border-[color:var(--icms-gold)]/45 pt-5">
                <p className="icms-display text-3xl text-[color:var(--icms-gold)]/60">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="icms-display mt-3 text-xl uppercase text-[color:var(--icms-forest)]">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[color:var(--icms-warm-gray)]">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-px w-4 shrink-0 bg-[color:var(--icms-gold)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
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
          <div className="mt-14 max-w-3xl">
            <h3 className="icms-display text-xl uppercase text-[color:var(--icms-forest)]">
              Qualities of members
            </h3>
            <ul className="mt-5 space-y-3">
              {content.qualities.map((q) => (
                <li
                  key={q}
                  className="flex gap-4 text-sm leading-relaxed text-[color:var(--icms-warm-gray)]"
                >
                  <span className="mt-2 h-px w-6 shrink-0 bg-[color:var(--icms-gold)]" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
              {content.closing}
            </p>
          </div>
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
