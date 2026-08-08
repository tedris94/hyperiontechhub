import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import type { TenantConfig, PageContent, EventItem, PrayerTime, WaqfProject, Article } from '@/lib/icms/types'
import type { HomeSectionId, HeroStyle } from '@/lib/icms/ui-variants'
import { formatNaira } from '@/lib/icms/content'
import PrayerStrip from '@/components/icms/PrayerStrip'
import { ICMS_MEDIA } from '@/lib/icms/media-assets'

function eventDateParts(iso: string) {
  const d = new Date(iso + 'T12:00:00')
  return {
    day: d.toLocaleDateString('en-NG', { day: '2-digit' }),
    month: d.toLocaleDateString('en-NG', { month: 'short' }),
  }
}

function eventCategory(title: string, featured?: boolean, category?: string) {
  if (category) return category
  const t = title.toLowerCase()
  if (featured) return 'Featured'
  if (t.includes('jum') || t.includes('khutbah') || t.includes('friday')) return 'Friday Prayer'
  if (t.includes('youth') || t.includes('qur')) return 'Youth'
  if (t.includes('waqf')) return 'Waqf'
  if (t.includes('study') || t.includes('tafsir') || t.includes('workshop')) return 'Education'
  return 'Community'
}

function GoldRule({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-px w-full bg-[color:var(--icms-gold)] opacity-55 ${className}`}
      aria-hidden
    />
  )
}

function hrefJoin(base: string, path: string) {
  if (!path) return base || '/'
  if (!base) return `/${path}`
  return `${base}/${path}`
}

export type HomeSectionsProps = {
  tenant: TenantConfig
  base: string
  page: PageContent
  prayerTimesToday: PrayerTime[]
  upcoming: EventItem[]
  waqfProjects: WaqfProject[]
  articles: Article[]
  campaignProgress: number
  campaignGoal: number
  campaignRaised: number
  featuredWaqf?: WaqfProject
  sectionOrder: HomeSectionId[]
  heroStyle: HeroStyle
}

function HeroSection({
  tenant,
  base,
  page,
  heroStyle,
}: {
  tenant: TenantConfig
  base: string
  page: PageContent
  heroStyle: HeroStyle
}) {
  const title = page.heroTitle || 'A home for worship, knowledge, and sincere service'
  const subtitle =
    page.heroSubtitle ||
    "Mosque life, Da'wah, Waqf, donations, and Islamiyyah — unified under one dignified digital presence."

  if (heroStyle === 'split') {
    return (
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid min-h-[70vh] w-full max-w-[1280px] gap-10 px-8 py-20 md:grid-cols-2 md:items-center">
          <div>
            <Image
              src={tenant.logo}
              alt={tenant.name}
              width={96}
              height={96}
              className="mb-6 h-20 w-20 rounded-full bg-[color:var(--icms-ivory)] object-contain p-1.5"
              priority
            />
            <p className="icms-display text-2xl text-[color:var(--icms-forest)] md:text-4xl">
              {tenant.name}
            </p>
            <h1 className="icms-display mt-4 text-xl font-semibold text-[color:var(--icms-charcoal)] md:text-3xl">
              {title}
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={hrefJoin(base, 'donate')} className="icms-btn-primary">
                {page.ctaPrimaryLabel || 'Donate Now'}
              </Link>
              <Link href={hrefJoin(base, 'mosque')} className="icms-btn-secondary">
                {page.ctaSecondaryLabel || 'Prayer Times'}
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-[color:var(--icms-forest)] p-10 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              {tenant.motto}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">{subtitle}</p>
          </div>
        </div>
      </section>
    )
  }

  if (heroStyle === 'light') {
    return (
      <section className="border-b border-black/5 bg-[color:var(--icms-ivory)] px-8 py-20">
        <div className="mx-auto max-w-[1280px] text-center">
          <Image
            src={tenant.logo}
            alt={tenant.name}
            width={100}
            height={100}
            className="mx-auto mb-6 h-24 w-24 rounded-full bg-white object-contain p-2 shadow-sm"
            priority
          />
          <p className="icms-display text-3xl text-[color:var(--icms-forest)] md:text-4xl">
            {tenant.name}
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
            {tenant.motto}
          </p>
          <h1 className="icms-display mx-auto mt-6 max-w-3xl text-2xl text-[color:var(--icms-charcoal)] md:text-3xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[color:var(--icms-warm-gray)] md:text-base">
            {subtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href={hrefJoin(base, 'donate')} className="icms-btn-primary">
              {page.ctaPrimaryLabel || 'Donate Now'}
            </Link>
            <Link href={hrefJoin(base, 'mosque')} className="icms-btn-secondary">
              {page.ctaSecondaryLabel || 'Prayer Times'}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const minH = heroStyle === 'compact' ? 'min-h-[64vh]' : 'min-h-[88vh]'
  const centered = heroStyle === 'centered' || heroStyle === 'compact'

  return (
    <section className={`relative ${minH} overflow-hidden bg-[color:var(--icms-forest)] text-white`}>
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #07382B 0%, #0F5A43 45%, #07382B 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(60deg, transparent, transparent 18px, rgba(199,154,44,0.15) 18px, rgba(199,154,44,0.15) 19px)',
        }}
        aria-hidden
      />
      <div
        className={`relative mx-auto flex ${minH} w-full max-w-[1280px] flex-col items-center justify-center px-8 py-24 ${
          centered ? 'text-center' : 'text-center'
        }`}
      >
        <Image
          src={tenant.logo}
          alt={tenant.name}
          width={heroStyle === 'compact' ? 100 : 140}
          height={heroStyle === 'compact' ? 100 : 140}
          className={`mb-8 rounded-full bg-white/95 object-contain p-2 shadow-lg ${
            heroStyle === 'compact' ? 'h-20 w-20' : 'h-28 w-28 md:h-36 md:w-36'
          }`}
          priority
        />
        <p className="icms-display text-3xl tracking-wide text-white md:text-5xl">{tenant.name}</p>
        <div className="my-5 flex items-center gap-3">
          <span className="h-px w-10 bg-[color:var(--icms-gold)]" aria-hidden />
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--icms-gold)]">
            {tenant.motto}
          </p>
          <span className="h-px w-10 bg-[color:var(--icms-gold)]" aria-hidden />
        </div>
        <h1 className="icms-display max-w-3xl text-2xl font-semibold text-white/95 md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-sm text-white/70 md:text-base">{subtitle}</p>
        <div
          className={`mt-10 flex flex-wrap items-center justify-center gap-4 ${
            heroStyle === 'compact' ? 'flex-col sm:flex-row' : ''
          }`}
        >
          <Link
            href={hrefJoin(base, 'donate')}
            className="rounded border border-[color:var(--icms-gold)] bg-[color:var(--icms-gold)] px-8 py-[0.875rem] text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-forest)] no-underline transition-colors hover:bg-white"
          >
            {page.ctaPrimaryLabel || 'Donate Now'}
          </Link>
          <Link
            href={hrefJoin(base, 'mosque')}
            className="rounded border border-[color:var(--icms-ivory)]/33 bg-transparent px-8 py-[0.875rem] text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-ivory)] no-underline transition-colors hover:bg-white/10"
          >
            {page.ctaSecondaryLabel || 'Prayer Times'}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function HomePageSections(props: HomeSectionsProps) {
  const {
    tenant,
    base,
    page,
    prayerTimesToday,
    upcoming,
    waqfProjects,
    articles,
    campaignProgress,
    campaignGoal,
    campaignRaised,
    featuredWaqf,
    sectionOrder,
    heroStyle,
  } = props

  const FALLBACK_ARTICLE_PHOTO = ICMS_MEDIA.salah
  const articleCards = articles.slice(0, 3).map((a) => ({
    category: a.category || 'General',
    title: a.title,
    excerpt: a.excerpt,
    date: a.date,
    photo: a.coverImageUrl || FALLBACK_ARTICLE_PHOTO,
    href: `articles/${a.slug}`,
  }))

  const sections: Record<HomeSectionId, ReactNode> = {
    hero: <HeroSection key="hero" tenant={tenant} base={base} page={page} heroStyle={heroStyle} />,
    prayer: (
      <PrayerStrip
        key="prayer"
        times={prayerTimesToday}
        href={hrefJoin(base, 'mosque')}
        variant="bar"
        heading={page.prayerHeading || "Today's Prayer Times"}
        locationLabel={tenant.prayer?.locationLabel || 'Abuja, FCT'}
      />
    ),
    events: (
      <section key="events" className="bg-[color:var(--icms-ivory)] px-8 py-20">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="mb-10">
            <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
              {page.eventsEyebrow || 'Upcoming Events'}
            </p>
            <GoldRule className="mb-3" />
            <h2 className="icms-display text-[clamp(1.4rem,3vw,2rem)] font-semibold text-[color:var(--icms-charcoal)]">
              {page.eventsHeading || "What's Happening at the Centre"}
            </h2>
          </div>
          <div className="flex flex-col">
            {upcoming.length === 0 ? (
              <p className="text-sm text-[color:var(--icms-warm-gray)]">
                No upcoming events yet. Add them in Admin → Events.
              </p>
            ) : null}
            {upcoming.map((event, i) => {
              const { day, month } = eventDateParts(event.date)
              return (
                <div key={event.id}>
                  <div className="grid grid-cols-[72px_1fr_auto] items-center gap-6 py-6">
                    <div className="rounded bg-[color:var(--icms-emerald)] px-2 py-[0.65rem] text-center">
                      <p className="icms-display m-0 text-[1.4rem] font-bold leading-none text-[color:var(--icms-ivory)]">
                        {day}
                      </p>
                      <p className="mt-[0.15rem] text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--icms-gold)]">
                        {month}
                      </p>
                    </div>
                    <div>
                      <p className="mb-[0.3rem] text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-[color:var(--icms-gold)]">
                        {eventCategory(event.title, event.featured, event.category)}
                      </p>
                      <p className="icms-display mb-[0.3rem] text-[clamp(0.9rem,1.8vw,1.1rem)] font-semibold text-[color:var(--icms-charcoal)]">
                        {event.title}
                      </p>
                      <p className="m-0 text-[0.76rem] text-[color:var(--icms-warm-gray)]">
                        {event.time}
                        {event.venue ? ` · ${event.venue}` : ''}
                      </p>
                    </div>
                    <Link
                      href={hrefJoin(base, 'events')}
                      className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded border border-[color:var(--icms-gold)]/33 text-[color:var(--icms-gold)] no-underline"
                      aria-label={`View ${event.title}`}
                    >
                      <svg width={15} height={15} viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path
                          d="M3 8h10M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </div>
                  {i < upcoming.length - 1 ? <GoldRule /> : null}
                </div>
              )
            })}
          </div>
          <div className="mt-8">
            <Link
              href={hrefJoin(base, 'events')}
              className="border-b border-[color:var(--icms-emerald)] text-[0.73rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--icms-emerald)] no-underline"
            >
              {page.eventsCtaLabel || 'View All Events →'}
            </Link>
          </div>
        </div>
      </section>
    ),
    waqf: (
      <section key="waqf" className="relative overflow-hidden bg-[color:var(--icms-forest)] text-white">
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(60deg, transparent, transparent 22px, rgba(199,154,44,0.4) 22px, rgba(199,154,44,0.4) 23px), repeating-linear-gradient(-60deg, transparent, transparent 22px, rgba(199,154,44,0.22) 22px, rgba(199,154,44,0.22) 23px)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto grid w-full max-w-[1280px] gap-12 px-8 py-16 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              {page.waqfEyebrow || 'Waqf & Endowments'}
            </p>
            <h2 className="icms-display mt-3 text-3xl uppercase leading-snug md:text-4xl">
              {page.waqfHeading || 'Leave a legacy that outlasts your lifetime'}
            </h2>
            {(page.arabicText || page.arabicCaption) && (
              <div className="mt-5 text-right" dir="rtl">
                {page.arabicText ? (
                  <p className="icms-arabic text-xl italic leading-relaxed text-[color:var(--icms-gold)] md:text-2xl">
                    {page.arabicText}
                  </p>
                ) : null}
                {page.arabicCaption ? (
                  <p className="mt-3 text-[0.73rem] italic text-white/47" dir="ltr">
                    {page.arabicCaption}
                  </p>
                ) : null}
              </div>
            )}
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75 md:text-base">
              {page.waqfBody ||
                'Our Waqf programme channels endowments into the permanent infrastructure of Islamic education, community welfare, and sacred space maintenance.'}
            </p>
            <Link
              href={hrefJoin(base, 'waqf')}
              className="mt-8 inline-flex items-center justify-center rounded border border-[color:var(--icms-gold)] bg-[color:var(--icms-gold)] px-8 py-[0.85rem] text-[0.76rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-forest)] no-underline transition-colors hover:bg-white"
            >
              {page.waqfCtaLabel || 'Support the Waqf'}
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-white/15 bg-white/5 p-5 text-center md:text-left">
              <p className="icms-display text-3xl text-[color:var(--icms-gold)]">
                {waqfProjects.length || '—'}
              </p>
              <p className="mt-2 text-xs uppercase tracking-wider text-white/65">Active projects</p>
            </div>
            <div className="border border-white/15 bg-white/5 p-5 text-left">
              <div className="flex items-baseline justify-between gap-3 text-[0.75rem]">
                <span className="text-white/55">
                  Raised:{' '}
                  <strong className="font-semibold text-white">{formatNaira(campaignRaised)}</strong>
                </span>
                <span className="text-white/55">
                  Goal:{' '}
                  <strong className="font-semibold text-white">{formatNaira(campaignGoal)}</strong>
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-white/15">
                <div
                  className="h-full bg-[color:var(--icms-gold)]"
                  style={{ width: `${Math.min(100, Math.max(0, campaignProgress))}%` }}
                />
              </div>
              <p className="mt-2 text-[0.75rem] text-white/65">{campaignProgress}% of target reached</p>
            </div>
          </div>
        </div>
      </section>
    ),
    articles: (
      <section
        key="articles"
        className="border-t border-[color:var(--icms-gold)]/28 px-8 py-20"
        style={{ background: '#F2EFE7' }}
      >
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
                {page.articlesEyebrow || 'Knowledge & Reflection'}
              </p>
              <GoldRule className="mb-3" />
              <h2 className="icms-display text-[clamp(1.4rem,3vw,2rem)] font-semibold text-[color:var(--icms-charcoal)]">
                {page.articlesHeading || 'Latest from the Centre'}
              </h2>
            </div>
            <Link
              href={hrefJoin(base, 'articles')}
              className="border-b border-[color:var(--icms-emerald)] text-[0.73rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-emerald)] no-underline"
            >
              {page.articlesCtaLabel || 'All Articles →'}
            </Link>
          </div>
          {articleCards.length === 0 ? (
            <p className="text-sm text-[color:var(--icms-warm-gray)]">
              No published articles yet. Add them in Admin → Articles.
            </p>
          ) : (
            <div
              className="grid gap-8"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
            >
              {articleCards.map((article) => (
                <article
                  key={article.title}
                  className="overflow-hidden rounded border border-[color:var(--icms-gold)]/10 bg-[color:var(--icms-ivory)]"
                >
                  <div className="relative h-44 overflow-hidden bg-[color:var(--icms-forest)]">
                    <Image
                      src={article.photo}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <p className="mb-[0.6rem] text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
                      {article.category}
                    </p>
                    <h3 className="icms-display mb-[0.6rem] text-[0.98rem] font-semibold leading-[1.35] text-[color:var(--icms-charcoal)]">
                      {article.title}
                    </h3>
                    <p className="mb-5 text-[0.8rem] leading-[1.65] text-[color:var(--icms-warm-gray)]">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[0.67rem] text-[color:var(--icms-warm-gray)]/53">
                        {article.date}
                      </span>
                      <Link
                        href={hrefJoin(base, article.href)}
                        className="border-b border-[color:var(--icms-emerald)]/33 text-[0.7rem] font-semibold text-[color:var(--icms-emerald)] no-underline"
                      >
                        Read →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    ),
    findUs: (
      <section
        key="findUs"
        className="border-t border-[color:var(--icms-gold)]/28 bg-[color:var(--icms-ivory)] px-8 py-20"
      >
        <div
          className="mx-auto grid w-full max-w-[1280px] items-start gap-12"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
        >
          <div>
            <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
              {page.findUsEyebrow || 'Find Us'}
            </p>
            <GoldRule className="mb-3" />
            <h3 className="icms-display text-[1.15rem] font-semibold text-[color:var(--icms-charcoal)]">
              {page.findUsHeading || 'Our Location'}
            </h3>
            <p className="mt-4 whitespace-pre-line text-[0.88rem] leading-[1.8] text-[color:var(--icms-charcoal)]">
              {tenant.address}
            </p>
          </div>
          <div>
            <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
              {page.contactEyebrow || 'Contact'}
            </p>
            <GoldRule className="mb-3" />
            <h3 className="icms-display text-[1.15rem] font-semibold text-[color:var(--icms-charcoal)]">
              {page.contactHeading || 'Reach the Centre'}
            </h3>
            <div className="mt-4 flex flex-col gap-2">
              {tenant.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="icms-display text-[1rem] font-semibold text-[color:var(--icms-emerald)] no-underline"
                >
                  {phone}
                </a>
              ))}
            </div>
          </div>
          <div id="donate">
            <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
              {page.supportEyebrow || 'Support the Centre'}
            </p>
            <GoldRule className="mb-3" />
            <h3 className="icms-display text-[1.15rem] font-semibold text-[color:var(--icms-charcoal)]">
              {page.supportHeading || 'Donate Today'}
            </h3>
            <p className="mt-4 mb-5 text-[0.84rem] leading-[1.7] text-[color:var(--icms-warm-gray)]">
              {page.supportBlurb ||
                'Your generosity sustains our mosque, education programmes, and community welfare initiatives.'}
            </p>
            <Link
              href={hrefJoin(base, 'donate')}
              className="inline-block rounded bg-[color:var(--icms-emerald)] px-8 py-[0.85rem] text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-ivory)] no-underline"
            >
              {page.supportCtaLabel || 'Give Now'}
            </Link>
          </div>
        </div>
      </section>
    ),
  }

  // silence unused featuredWaqf when not shown in simplified waqf block
  void featuredWaqf

  return <>{sectionOrder.map((id) => sections[id])}</>
}
