import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getPublicBaseFromHeaders } from '@/lib/icms/public-base-server'
import { ANAS_BOARD } from '@/lib/icms/anas-governance'
import PageHero from '@/components/icms/PageHero'
import CommitteeRoster from '@/components/icms/CommitteeRoster'

type Props = { params: Promise<{ tenant: string }> }

export default async function BoardOfTrusteesPage({ params }: Props) {
  const { tenant: slug } = await params
  if (slug !== 'anas-bn-malik') notFound()
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const base = await getPublicBaseFromHeaders(tenant.slug)
  const content = ANAS_BOARD

  return (
    <>
      <PageHero
        tenant={tenant}
        patterned
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />

      <section className="icms-section bg-white">
        <div className="icms-container grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              Functions
            </p>
            <h2 className="icms-display mt-3 text-3xl uppercase leading-snug text-[color:var(--icms-forest)] md:text-4xl">
              {content.introHeading}
            </h2>
            <div className="my-6 h-16 w-px bg-[color:var(--icms-gold)]" />
          </div>
          <div className="space-y-6">
            <p className="text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
              {content.introBody}
            </p>
            <p className="border-l-2 border-[color:var(--icms-gold)] pl-4 text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
              {content.membershipNote}
            </p>
          </div>
        </div>
      </section>

      <section className="icms-section bg-[color:var(--icms-ivory)]">
        <div className="icms-container">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
            Membership
          </p>
          <h2 className="icms-display mt-3 text-3xl uppercase text-[color:var(--icms-forest)]">
            Board of Trustees
          </h2>
          <div className="mt-10">
            <CommitteeRoster people={content.members} />
          </div>
        </div>
      </section>

      <section className="border-t border-black/5 bg-white py-10">
        <div className="icms-container flex flex-wrap items-center justify-center gap-4 px-4">
          <Link href={`${base}/about#administrative-structure`} className="icms-btn-secondary">
            Administrative structure
          </Link>
          <Link href={`${base}/governance/management`} className="icms-btn-primary">
            Management Committee
          </Link>
        </div>
      </section>
    </>
  )
}
