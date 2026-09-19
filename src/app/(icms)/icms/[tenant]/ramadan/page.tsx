import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getEvents, getPageContent, getPublishedArticles } from '@/lib/icms/content'
import { getPublicBaseFromHeaders } from '@/lib/icms/public-base-server'
import { ICMS_MEDIA } from '@/lib/icms/media-assets'
import { ANAS_RAMADAN } from '@/lib/icms/anas-governance'
import PageHero from '@/components/icms/PageHero'

type Props = { params: Promise<{ tenant: string }> }

function GoldRule() {
  return <div className="h-px w-full bg-[color:var(--icms-gold)] opacity-55" aria-hidden />
}

function hrefJoin(base: string, path: string) {
  if (!base) return `/${path}`
  return `${base}/${path}`
}

export default async function RamadanPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const [page, events, articles, base] = await Promise.all([
    getPageContent(doc.id, 'ramadan'),
    getEvents(doc.id),
    getPublishedArticles(doc.id),
    getPublicBaseFromHeaders(tenant.slug),
  ])

  const isAnas = slug === 'anas-bn-malik'
  const content = ANAS_RAMADAN
  const profileBlocks = isAnas
    ? content.profileBlocks
    : (page.blocks || []).slice(0, 3)
  const activityBlocks = isAnas
    ? content.activityBlocks
    : (page.blocks || []).slice(3, 6)

  const relatedEvents = events.filter((event) => {
    const text = `${event.title} ${event.category || ''}`.toLowerCase()
    return text.includes('ramadan') || text.includes('iftar') || text.includes('taraweeh')
  })
  const relatedArticles = articles.filter((article) => {
    const text = `${article.title} ${article.category}`.toLowerCase()
    return text.includes('ramadan')
  })

  return (
    <>
      <PageHero
        tenant={tenant}
        patterned
        title={
          page.heroTitle ||
          (isAnas ? content.heroTitle : 'Ramadan')
        }
        subtitle={
          page.heroSubtitle ||
          (isAnas ? content.heroSubtitle : 'A month of Qur’an, prayer, generosity, and renewed community.')
        }
      />

      <section className="icms-section bg-white">
        <div className="icms-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative min-h-[360px] overflow-hidden bg-[color:var(--icms-ivory)] lg:min-h-[500px]">
            <Image
              src={page.imageUrl || ICMS_MEDIA.community}
              alt="Ramadan programmes at the Centre"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[color:var(--icms-forest)]/90 to-transparent p-6 pt-20">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
                {isAnas ? 'Anas Bn Malik Islamic Centre' : tenant.shortName}
              </p>
              <p className="mt-2 text-sm text-white/85">
                {isAnas ? 'ABMIC · AMSSCO Platinum Estate, Galadimawa' : tenant.address}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              Profile
            </p>
            <h2 className="icms-display mt-3 text-3xl uppercase leading-snug text-[color:var(--icms-forest)] md:text-4xl">
              {page.introHeading || (isAnas ? content.introHeading : 'Ramadan at the Centre')}
            </h2>
            <div className="my-6 h-16 w-px bg-[color:var(--icms-gold)]" />
            <p className="text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
              {page.introBody || (isAnas ? content.introBody : '')}
            </p>
            <div className="mt-8 space-y-7">
              {profileBlocks.map((block) => (
                <article key={block.title}>
                  <h3 className="icms-display text-xl uppercase tracking-wide text-[color:var(--icms-forest)]">
                    {block.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
                    {block.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {activityBlocks.length > 0 ? (
        <section className="icms-section bg-[color:var(--icms-ivory)]">
          <div className="icms-container">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              Work of the sub-committee
            </p>
            <GoldRule />
            <h2 className="icms-display mt-3 text-3xl uppercase text-[color:var(--icms-forest)] md:text-4xl">
              Programmes and activities
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {activityBlocks.map((block, index) => (
                <article key={block.title} className="border-t border-[color:var(--icms-gold)]/45 pt-5">
                  <p className="icms-display text-3xl text-[color:var(--icms-gold)]/60">
                    0{index + 1}
                  </p>
                  <h3 className="icms-display mt-3 text-xl uppercase text-[color:var(--icms-forest)]">
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
      ) : null}

      {(relatedEvents.length > 0 || relatedArticles.length > 0) && (
        <section className="icms-section bg-white">
          <div className="icms-container grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="icms-display text-xl font-semibold text-[color:var(--icms-forest)]">
                Programmes & events
              </h3>
              <div className="mt-5 space-y-4">
                {relatedEvents.map((event) => (
                  <article key={event.id} className="border-t border-[color:var(--icms-gold)]/25 pt-4">
                    <h4 className="font-semibold text-[color:var(--icms-charcoal)]">{event.title}</h4>
                    {event.date ? (
                      <p className="mt-1 text-xs uppercase tracking-wider text-[color:var(--icms-gold)]">
                        {event.date} · {event.venue}
                      </p>
                    ) : null}
                    {event.blurb ? (
                      <p className="mt-2 text-sm leading-6 text-[color:var(--icms-warm-gray)]">
                        {event.blurb}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
            <div>
              <h3 className="icms-display text-xl font-semibold text-[color:var(--icms-forest)]">
                Related reflections
              </h3>
              <div className="mt-5 space-y-4">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={hrefJoin(base, `articles/${article.slug}`)}
                    className="block border-t border-[color:var(--icms-gold)]/25 pt-4 hover:text-[color:var(--icms-emerald)]"
                  >
                    <h4 className="font-semibold">{article.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {isAnas ? (
        <section className="border-t border-black/5 bg-[color:var(--icms-ivory)] py-10">
          <div className="icms-container flex flex-wrap items-center justify-center gap-4 px-4">
            <Link href={`${base}/about#administrative-structure`} className="icms-btn-secondary">
              Administrative structure
            </Link>
            <Link href={`${base}/donate`} className="icms-btn-primary">
              Support Ramadan feeding
            </Link>
          </div>
        </section>
      ) : null}
    </>
  )
}
