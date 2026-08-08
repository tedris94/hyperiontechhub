import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import {
  getFacilities,
  getPageContent,
  getPrayerLocationForTenant,
  getPrayerTimesToday,
  getWeeklyPrayerRows,
} from '@/lib/icms/content'
import { prayerMethodLabel, type PrayerCalculationMethod } from '@/lib/icms/prayer-calc'
import PageHero from '@/components/icms/PageHero'
import PrayerStrip from '@/components/icms/PrayerStrip'

type Props = { params: Promise<{ tenant: string }> }

const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const PRAYER_ORDER = ['Fajr', 'Shuruq', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const

function GoldRule({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-px w-full bg-[color:var(--icms-gold)] opacity-55 ${className}`}
      aria-hidden
    />
  )
}

export default async function MosquePage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)

  const [prayerTimesToday, week, prayerLoc, page, facilities] = await Promise.all([
    getPrayerTimesToday(doc.id),
    getWeeklyPrayerRows(doc.id),
    getPrayerLocationForTenant(doc.id),
    getPageContent(doc.id, 'mosque'),
    getFacilities(doc.id),
  ])

  const today = new Date()
  const weekdayShort = new Intl.DateTimeFormat('en-US', {
    timeZone: prayerLoc.timezone,
    weekday: 'short',
  }).format(today)
  const todayIdx = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(weekdayShort)
  const safeTodayIdx = todayIdx >= 0 ? todayIdx : 0
  const todayLabel = today.toLocaleDateString('en-GB', {
    timeZone: prayerLoc.timezone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const monthYear = today.toLocaleDateString('en-GB', {
    timeZone: prayerLoc.timezone,
    month: 'long',
    year: 'numeric',
  })

  const tableData: Record<(typeof PRAYER_ORDER)[number], string[]> = {
    Fajr: week.map((r) => r.fajr),
    Shuruq: week.map((r) => r.sunrise),
    Dhuhr: week.map((r) => r.dhuhr),
    Asr: week.map((r) => r.asr),
    Maghrib: week.map((r) => r.maghrib),
    Isha: week.map((r) => r.isha),
  }

  const methodName = prayerMethodLabel(
    prayerLoc.calculationMethod as PrayerCalculationMethod,
  )

  return (
    <>
      <PageHero
        tenant={tenant}
        patterned
        title={page.heroTitle || 'The Mosque & Prayer Times'}
        subtitle={
          page.heroSubtitle ||
          'The house of Allah — open for worship, learning, and community five times every day.'
        }
      />

      <PrayerStrip
        times={prayerTimesToday}
        variant="bar"
        heading={`Today — ${todayLabel}`}
        subLabel={`${prayerLoc.locationLabel} · Auto-calculated`}
      />

      {/* Overview + facilities */}
      <section className="bg-[color:var(--icms-ivory)] px-8 py-20">
        <div className="mx-auto grid w-full max-w-[1280px] items-start gap-16 md:grid-cols-2 md:gap-20">
          <div>
            <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
              The Mosque
            </p>
            <GoldRule className="mb-3" />
            <h2 className="icms-display text-[clamp(1.4rem,3vw,2rem)] font-semibold leading-snug text-[color:var(--icms-charcoal)]">
              {page.introHeading || 'A Place of Prayer, Remembrance & Community'}
            </h2>

            {(page.introBody || '')
              .split(/\n\n+/)
              .filter(Boolean)
              .map((para) => (
                <p
                  key={para.slice(0, 40)}
                  className="mt-4 text-[0.9rem] leading-[1.85] text-[color:var(--icms-charcoal)]/85 first:mt-6"
                >
                  {para}
                </p>
              ))}
            {!page.introBody ? (
              <p className="mt-6 text-[0.9rem] leading-[1.85] text-[color:var(--icms-charcoal)]/85">
                The mosque at {tenant.shortName} is the heart of community worship — five times
                every day, and Jum&apos;uah each Friday.
              </p>
            ) : null}

            {page.jumuahNote ? (
              <div className="mt-8 border-l-[3px] border-[color:var(--icms-gold)] bg-[#F2EFE7] p-6">
                <p className="icms-display mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
                  Jum&apos;uah
                </p>
                <p className="m-0 whitespace-pre-line text-[0.88rem] leading-relaxed text-[color:var(--icms-charcoal)]">
                  {page.jumuahNote}
                </p>
              </div>
            ) : null}
          </div>

          <div>
            <p className="icms-display mb-5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
              Facilities
            </p>
            <div className="flex flex-col">
              {facilities.map((f, i) => (
                <div key={f.id}>
                  <div className="grid gap-4 py-[1.1rem] sm:grid-cols-[180px_1fr] sm:gap-6">
                    <p className="icms-display m-0 text-[0.85rem] font-semibold text-[color:var(--icms-charcoal)]">
                      {f.title}
                    </p>
                    <p className="m-0 text-[0.83rem] leading-[1.65] text-[color:var(--icms-warm-gray)]">
                      {f.description}
                    </p>
                  </div>
                  {i < facilities.length - 1 ? (
                    <div className="h-px bg-[color:var(--icms-gold)] opacity-15" aria-hidden />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Weekly timetable — live Adhan calculation */}
      <section
        className="border-t border-[color:var(--icms-gold)]/13 px-8 py-20"
        style={{ background: '#F2EFE7' }}
      >
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="mb-10">
            <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
              Weekly Timetable
            </p>
            <GoldRule className="mb-3" />
            <h2 className="icms-display text-[clamp(1.4rem,3vw,2rem)] font-semibold text-[color:var(--icms-charcoal)]">
              Prayer Times — {monthYear}
            </h2>
            <p className="mt-3 text-[0.78rem] text-[color:var(--icms-warm-gray)]">
              Calculated live for {prayerLoc.locationLabel} ({prayerLoc.latitude.toFixed(4)}°N,{' '}
              {prayerLoc.longitude.toFixed(4)}°E) using {methodName}, {prayerLoc.madhab} madhab.
              Times update automatically with the calendar — set location in tenant settings only.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-center text-sm">
              <thead>
                <tr>
                  <th className="border-b-2 border-[color:var(--icms-gold)]/20 py-3 pr-4 text-left text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[color:var(--icms-warm-gray)]">
                    Prayer
                  </th>
                  {DAY_SHORT.map((day, i) => (
                    <th
                      key={day}
                      className={`border-b-2 border-[color:var(--icms-gold)]/20 px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.08em] ${
                        i === safeTodayIdx
                          ? 'bg-[color:var(--icms-emerald)]/10 text-[color:var(--icms-emerald)]'
                          : 'text-[color:var(--icms-warm-gray)]'
                      }`}
                    >
                      {day}
                      {i === safeTodayIdx ? (
                        <span className="mt-[0.15rem] block text-[0.55rem] font-medium uppercase tracking-[0.1em] text-[color:var(--icms-gold)]">
                          Today
                        </span>
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRAYER_ORDER.map((prayer, ri) => (
                  <tr
                    key={prayer}
                    style={{ background: ri % 2 === 0 ? '#FAF8F2' : '#F2EFE7' }}
                  >
                    <td className="icms-display border-b border-[color:var(--icms-gold)]/10 py-3 pr-4 text-left text-[0.82rem] font-semibold text-[color:var(--icms-charcoal)]">
                      {prayer}
                    </td>
                    {tableData[prayer].map((time, ci) => (
                      <td
                        key={`${prayer}-${ci}`}
                        className={`border-b border-[color:var(--icms-gold)]/10 px-4 py-3 text-[0.88rem] ${
                          ci === safeTodayIdx
                            ? 'bg-[color:var(--icms-emerald)]/10 font-semibold text-[color:var(--icms-emerald)]'
                            : 'text-[color:var(--icms-charcoal)]'
                        }`}
                      >
                        {time}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
