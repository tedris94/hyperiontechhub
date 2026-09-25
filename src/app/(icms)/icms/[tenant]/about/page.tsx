import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getPageContent } from '@/lib/icms/content'
import { getPublicBaseFromHeaders } from '@/lib/icms/public-base-server'
import { ICMS_MEDIA } from '@/lib/icms/media-assets'
import { ANAS_ABOUT, ANAS_ADMIN_STRUCTURE_INTRO } from '@/lib/icms/anas-governance'
import PageHero from '@/components/icms/PageHero'

type Props = { params: Promise<{ tenant: string }> }

export default async function AboutPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const page = await getPageContent(doc.id, 'about')
  const base = await getPublicBaseFromHeaders(tenant.slug)
  const isAnas = slug === 'anas-bn-malik'

  const mapsQuery = encodeURIComponent(tenant.address)
  const mapsEmbed = `https://maps.google.com/maps?q=${mapsQuery}&z=15&output=embed`
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`

  const storyBlocks = page.blocks?.length ? page.blocks : []
  const missionPoints = page.missionItems?.length ? page.missionItems : []
  const visionPoints = page.visionItems?.length ? page.visionItems : []
  const photo = page.imageUrl || ICMS_MEDIA.aboutCentre

  return (
    <>
      <PageHero
        tenant={tenant}
        patterned
        title={
          page.heroTitle || (isAnas ? ANAS_ABOUT.heroTitle : 'About the Centre')
        }
        subtitle={
          page.heroSubtitle ||
          (isAnas
            ? ANAS_ABOUT.heroSubtitle
            : 'Established to serve, educate, and uplift the Muslim community.')
        }
      />

      <section className="icms-section bg-white">
        <div className="icms-container grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              {isAnas
                ? ANAS_ABOUT.storyEyebrow
                : page.storyEyebrow || 'Our Story'}
            </p>
            <h2 className="icms-display mt-3 text-3xl uppercase leading-snug text-[color:var(--icms-forest)] md:text-4xl">
              {isAnas
                ? ANAS_ABOUT.introHeading
                : page.introHeading || 'Rooted in tradition'}
            </h2>
            <div className="my-6 h-16 w-px bg-[color:var(--icms-gold)]" />

            <div className="relative aspect-square overflow-hidden bg-[color:var(--icms-ivory)]">
              <Image
                src={photo}
                alt={`${tenant.shortName} — place of worship and community`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {(page.arabicText || page.arabicCaption) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[color:var(--icms-forest)]/85 to-transparent p-5 pt-16">
                  {page.arabicText ? (
                    <p className="icms-arabic text-2xl text-[color:var(--icms-gold)] md:text-3xl">
                      {page.arabicText}
                    </p>
                  ) : null}
                  {page.arabicCaption ? (
                    <p className="mt-2 text-sm italic text-white/85">{page.arabicCaption}</p>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-10">
            {isAnas ? (
              <>
                {ANAS_ABOUT.history.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
                {ANAS_ABOUT.companion.map((block) => (
                  <div key={block.title}>
                    <h3 className="icms-display text-xl uppercase tracking-wide text-[color:var(--icms-forest)]">
                      {block.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
                      {block.body}
                    </p>
                  </div>
                ))}
                <blockquote className="border-l-2 border-[color:var(--icms-gold)] pl-5">
                  <p className="text-sm leading-relaxed text-[color:var(--icms-forest)] md:text-base">
                    {ANAS_ABOUT.hadith.text}
                  </p>
                  <footer className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--icms-gold)]">
                    {ANAS_ABOUT.hadith.source}
                  </footer>
                </blockquote>
              </>
            ) : (
              <>
                {page.introBody ? (
                  <p className="text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
                    {page.introBody}
                  </p>
                ) : null}
                {storyBlocks.map((block) => (
                  <div key={block.title}>
                    <h3 className="icms-display text-xl uppercase tracking-wide text-[color:var(--icms-forest)]">
                      {block.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
                      {block.body}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {isAnas ? (
        <section className="icms-section">
          <div className="icms-container">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              Purpose
            </p>
            <h2 className="icms-display mt-3 text-3xl uppercase text-[color:var(--icms-forest)] md:text-4xl">
              Mission & Vision
            </h2>
            <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h3 className="icms-display text-2xl uppercase text-[color:var(--icms-forest)]">
                  Mission
                </h3>
                <p className="mt-6 text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
                  {ANAS_ABOUT.mission}
                </p>
              </div>
              <div>
                <h3 className="icms-display text-2xl uppercase text-[color:var(--icms-forest)]">
                  Vision
                </h3>
                <p className="mt-6 text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
                  {ANAS_ABOUT.vision}
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : missionPoints.length > 0 || visionPoints.length > 0 ? (
        <section className="icms-section">
          <div className="icms-container">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              {page.purposeEyebrow || 'Purpose'}
            </p>
            <h2 className="icms-display mt-3 text-3xl uppercase text-[color:var(--icms-forest)] md:text-4xl">
              {page.missionHeading || 'Mission & Vision'}
            </h2>

            <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h3 className="icms-display text-2xl uppercase text-[color:var(--icms-forest)]">
                  Mission
                </h3>
                <ul className="mt-8 space-y-4">
                  {missionPoints.map((point) => (
                    <li
                      key={point}
                      className="flex gap-4 text-sm leading-relaxed text-[color:var(--icms-warm-gray)]"
                    >
                      <span className="mt-2 h-px w-6 shrink-0 bg-[color:var(--icms-gold)]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="icms-display text-2xl uppercase text-[color:var(--icms-forest)]">
                  Vision
                </h3>
                <ul className="mt-8 space-y-4">
                  {visionPoints.map((point) => (
                    <li
                      key={point}
                      className="flex gap-4 text-sm leading-relaxed text-[color:var(--icms-warm-gray)]"
                    >
                      <span className="mt-2 h-px w-6 shrink-0 bg-[color:var(--icms-gold)]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {isAnas ? (
        <section className="icms-section bg-white">
          <div className="icms-container">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              Our Core Values
            </p>
            <h2 className="icms-display mt-3 text-3xl uppercase text-[color:var(--icms-forest)] md:text-4xl">
              How we worship, serve, and relate
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
              {ANAS_ABOUT.coreValuesIntro}
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ANAS_ABOUT.coreValues.map((value) => (
                <article
                  key={value.arabic}
                  className="border-t border-[color:var(--icms-gold)]/45 pt-5"
                >
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
                    {value.arabic}
                  </p>
                  <h3 className="icms-display mt-2 text-xl uppercase text-[color:var(--icms-forest)]">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--icms-warm-gray)]">
                    {value.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {isAnas ? (
        <section id="administrative-structure" className="icms-section bg-[color:var(--icms-ivory)] scroll-mt-24">
          <div className="icms-container">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              Governance
            </p>
            <h2 className="icms-display mt-3 text-3xl uppercase text-[color:var(--icms-forest)] md:text-4xl">
              Administrative structure
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[color:var(--icms-warm-gray)] md:text-base">
              {ANAS_ADMIN_STRUCTURE_INTRO}
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <Link
                href={`${base}/governance/board`}
                className="group border-t border-[color:var(--icms-gold)]/50 pt-5 transition-colors hover:border-[color:var(--icms-gold)]"
              >
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
                  Board
                </p>
                <h3 className="icms-display mt-2 text-xl uppercase text-[color:var(--icms-forest)] group-hover:text-[color:var(--icms-emerald)]">
                  Board of Trustees
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--icms-warm-gray)]">
                  Highest governing body — oversight, assets, budget, and audited accounts.
                </p>
              </Link>
              <Link
                href={`${base}/governance/management`}
                className="group border-t border-[color:var(--icms-gold)]/50 pt-5 transition-colors hover:border-[color:var(--icms-gold)]"
              >
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
                  Administration
                </p>
                <h3 className="icms-display mt-2 text-xl uppercase text-[color:var(--icms-forest)] group-hover:text-[color:var(--icms-emerald)]">
                  Management Committee
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--icms-warm-gray)]">
                  Day-to-day running of the Centre under the guidance of the Board — purpose, functions, and membership.
                </p>
              </Link>
            </div>

            <p className="mt-14 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              Sub-committees
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  href: 'dawah',
                  label: 'Da’awah Sub-Committee',
                  blurb: 'Outreach, education, and humanitarian service.',
                },
                {
                  href: 'ramadan',
                  label: 'Ramadan Sub-Committee',
                  blurb: 'Iftar, Tafsir, Taraweeh, and Tahajjud programmes.',
                },
                {
                  href: 'zakah',
                  label: 'Zakah Sub-Committee',
                  blurb: 'Zakah collection and distribution (full details forthcoming).',
                },
                {
                  href: 'islamiyyah',
                  label: 'Islamiya Governing Board',
                  blurb: 'Education and curriculum oversight for Islamiya.',
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={`${base}/${item.href}`}
                  className="group border border-[color:var(--icms-gold)]/25 bg-white p-5 transition-colors hover:border-[color:var(--icms-gold)]/55"
                >
                  <h3 className="icms-display text-lg uppercase text-[color:var(--icms-forest)] group-hover:text-[color:var(--icms-emerald)]">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--icms-warm-gray)]">
                    {item.blurb}
                  </p>
                </Link>
              ))}
              <div
                className="border border-dashed border-[color:var(--icms-gold)]/30 bg-white/60 p-5 opacity-80"
                aria-disabled
              >
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-warm-gray)]">
                  Coming soon
                </p>
                <h3 className="icms-display mt-2 text-lg uppercase text-[color:var(--icms-forest)]">
                  Finance Sub-Committee
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--icms-warm-gray)]">
                  Mobilising financial resources to support the Centre’s activities.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[color:var(--icms-forest)] text-white">
        <div className="icms-container grid gap-8 px-4 py-12 md:grid-cols-3 md:gap-0 md:px-8 md:divide-x md:divide-white/15">
          <div className="md:px-8 md:first:pl-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
              Address
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/85">{tenant.address}</p>
          </div>
          <div className="md:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
              Telephone
            </p>
            <div className="mt-3 space-y-1 text-sm text-white/85">
              {tenant.phones.map((phone) => (
                <p key={phone}>
                  <a href={`tel:${phone}`} className="hover:text-white">
                    {phone}
                  </a>
                </p>
              ))}
            </div>
          </div>
          <div className="md:px-8 md:last:pr-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
              Office hours
            </p>
            <div className="mt-3 space-y-1 text-sm leading-relaxed text-white/85">
              {(page.officeHours || []).map((h) => (
                <p key={h.label}>
                  {h.label} · {h.value}
                </p>
              ))}
              {!page.officeHours?.length ? (
                <p>
                  Mon–Thu · 9:00 AM – 4:00 PM
                  <br />
                  Friday · After Jum’uah
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="icms-section bg-white">
        <div className="icms-container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
                {page.findUsEyebrow || 'Find us'}
              </p>
              <h2 className="icms-display mt-2 text-2xl uppercase text-[color:var(--icms-forest)] md:text-3xl">
                {page.findUsHeading || 'Visit the Center'}
              </h2>
            </div>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="icms-btn-secondary text-xs"
            >
              {page.mapCtaLabel || 'Open in Google Maps'}
            </a>
          </div>
          <div className="mt-8 overflow-hidden border border-[color:var(--icms-gold)]/25">
            <iframe
              title={`Map — ${tenant.name}`}
              src={mapsEmbed}
              className="h-72 w-full border-0 md:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="border-t border-black/5 bg-[color:var(--icms-ivory)] py-10">
        <div className="icms-container flex flex-wrap items-center justify-center gap-4 px-4">
          <Link
            href={
              isAnas ? `${base}/governance/management` : `${base}/leadership`
            }
            className="icms-btn-secondary"
          >
            {page.ctaSecondaryLabel || (isAnas ? 'Management' : 'Leadership')}
          </Link>
          <Link href={`${base}/contact`} className="icms-btn-primary">
            {page.ctaPrimaryLabel || 'Contact'}
          </Link>
        </div>
      </section>
    </>
  )
}
