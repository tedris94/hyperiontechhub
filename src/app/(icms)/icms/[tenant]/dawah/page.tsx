import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getPageContent } from '@/lib/icms/content'
import { getPublicBaseFromHeaders } from '@/lib/icms/public-base-server'
import { ICMS_MEDIA } from '@/lib/icms/media-assets'
import PageHero from '@/components/icms/PageHero'

type Props = { params: Promise<{ tenant: string }> }

function GoldRule() {
  return <div className="h-px w-full bg-[color:var(--icms-gold)] opacity-55" aria-hidden />
}

export default async function DawahPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const page = await getPageContent(doc.id, 'dawah')
  const base = await getPublicBaseFromHeaders(tenant.slug)
  const blocks = page.blocks || []
  const profileBlocks = blocks.slice(0, 3)
  const activityBlocks = blocks.slice(3, 6)
  const peopleBlock = blocks[6]
  const involvementBlock = blocks[7]

  return (
    <>
      <PageHero
        tenant={tenant}
        patterned
        title={page.heroTitle || 'Da’awah Sub-Committee'}
        subtitle={page.heroSubtitle || 'Faith, education, welfare, and service across the community.'}
      />

      <section className="icms-section bg-white">
        <div className="icms-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative min-h-[360px] overflow-hidden bg-[color:var(--icms-ivory)] lg:min-h-[500px]">
            <Image
              src={page.imageUrl || ICMS_MEDIA.community}
              alt="Da’awah and community service at Anas Bn Malik Islamic Centre"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[color:var(--icms-forest)]/90 to-transparent p-6 pt-20">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
                Anas Bn Malik Islamic Centre
              </p>
              <p className="mt-2 text-sm text-white/85">ABMIC · AMSSCO Platinum Estate, Galadimawa</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">Profile</p>
            <h2 className="icms-display mt-3 text-3xl uppercase leading-snug text-[color:var(--icms-forest)] md:text-4xl">
              {page.introHeading || 'Serving faith, unity, and the wider community'}
            </h2>
            <div className="my-6 h-16 w-px bg-[color:var(--icms-gold)]" />
            <p className="text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">{page.introBody}</p>
            <div className="mt-8 space-y-7">
              {profileBlocks.map((block) => (
                <article key={block.title}>
                  <h3 className="icms-display text-xl uppercase tracking-wide text-[color:var(--icms-forest)]">{block.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">{block.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="icms-section bg-[color:var(--icms-ivory)]">
        <div className="icms-container">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">Work of the DSC</p>
          <GoldRule />
          <h2 className="icms-display mt-3 text-3xl uppercase text-[color:var(--icms-forest)] md:text-4xl">Da’awah and humanitarian activities</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {activityBlocks.map((block, index) => (
              <article key={block.title} className="border-t border-[color:var(--icms-gold)]/45 pt-5">
                <p className="icms-display text-3xl text-[color:var(--icms-gold)]/60">0{index + 1}</p>
                <h3 className="icms-display mt-3 text-xl uppercase text-[color:var(--icms-forest)]">{block.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[color:var(--icms-warm-gray)]">{block.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {peopleBlock ? (
        <section className="icms-section bg-white">
          <div className="icms-container grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">People who serve</p>
              <h2 className="icms-display mt-3 text-3xl uppercase text-[color:var(--icms-forest)]">{peopleBlock.title}</h2>
            </div>
            <p className="text-sm leading-[1.9] text-[color:var(--icms-warm-gray)] md:text-base">{peopleBlock.body}</p>
          </div>
        </section>
      ) : null}

      <section className="bg-[color:var(--icms-forest)] px-8 py-16 text-white">
        <div className="mx-auto grid w-full max-w-[1280px] gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">Core values</p>
            <h2 className="icms-display mt-3 text-3xl uppercase md:text-4xl">Brotherhood. Education. Service.</h2>
            <div className="mt-8 space-y-3 text-sm leading-relaxed text-white/80">
              {(page.missionItems || []).map((item) => <p key={item}>— {item}</p>)}
            </div>
          </div>
          <div className="border-l border-white/15 pl-8 lg:pl-12">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">2026 workplan</p>
            <h2 className="icms-display mt-3 text-3xl uppercase md:text-4xl">The next work ahead</h2>
            <p className="mt-6 text-sm leading-relaxed text-white/80">{activityBlocks[2]?.body || 'Community programmes and outreach will be announced through the Centre.'}</p>
          </div>
        </div>
      </section>

      {involvementBlock ? (
        <section className="icms-section bg-white">
          <div className="icms-container grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">Get involved / contact us</p>
              <h2 className="icms-display mt-3 text-3xl uppercase text-[color:var(--icms-forest)]">Join the work</h2>
              <p className="mt-5 text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">{involvementBlock.body}</p>
            </div>
            <div className="border-l border-[color:var(--icms-gold)]/45 pl-8 lg:pl-12">
              <p className="text-sm leading-relaxed text-[color:var(--icms-warm-gray)]">Anas Bn Malik Islamic Centre (ABMIC), AMSSCO Platinum City Estate, Galadimawa, FCT, Abuja.</p>
              <p className="mt-5 text-sm leading-relaxed text-[color:var(--icms-warm-gray)]">“And let there arise from you a group inviting to all that is good, enjoining what is right and forbidding what is wrong. And those are the successful.” — Qur’an 3:104</p>
              <Link href={`${base}/contact`} className="icms-btn-primary mt-8 inline-flex">Contact the Centre</Link>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
