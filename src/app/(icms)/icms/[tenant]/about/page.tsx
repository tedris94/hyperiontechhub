import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getPageContent } from '@/lib/icms/content'
import { getPublicBaseFromHeaders } from '@/lib/icms/public-base-server'
import { ICMS_MEDIA } from '@/lib/icms/media-assets'
import PageHero from '@/components/icms/PageHero'

type Props = { params: Promise<{ tenant: string }> }

export default async function AboutPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const page = await getPageContent(doc.id, 'about')
  const base = await getPublicBaseFromHeaders(tenant.slug)

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
        title={page.heroTitle || 'About the Centre'}
        subtitle={
          page.heroSubtitle ||
          'Established to serve, educate, and uplift the Muslim community.'
        }
      />

      <section className="icms-section bg-white">
        <div className="icms-container grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              {page.storyEyebrow || 'Our Story'}
            </p>
            <h2 className="icms-display mt-3 text-3xl uppercase leading-snug text-[color:var(--icms-forest)] md:text-4xl">
              {page.introHeading || 'Rooted in tradition'}
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
          </div>
        </div>
      </section>

      {(missionPoints.length > 0 || visionPoints.length > 0) && (
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
      )}

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
          <Link href={`${base}/leadership`} className="icms-btn-secondary">
            {page.ctaSecondaryLabel || 'Leadership'}
          </Link>
          <Link href={`${base}/contact`} className="icms-btn-primary">
            {page.ctaPrimaryLabel || 'Contact'}
          </Link>
        </div>
      </section>
    </>
  )
}
