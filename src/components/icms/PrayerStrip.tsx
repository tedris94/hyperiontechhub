import Link from 'next/link'
import type { PrayerTime } from '@/lib/icms/types'

function displayPrayerName(name: string) {
  return name === 'Sunrise' ? 'Shuruq' : name
}

export default function PrayerStrip({
  times,
  href,
  variant = 'cards',
  locationLabel = 'Abuja, FCT',
  heading,
  subLabel,
}: {
  times: PrayerTime[]
  href?: string
  /** `bar` = Figma emerald strip; `cards` = white card grid */
  variant?: 'cards' | 'bar'
  locationLabel?: string
  /** Override bar heading (default: Today's Prayer Times) */
  heading?: string
  /** Override bar right-side label */
  subLabel?: string
}) {
  if (variant === 'bar') {
    const todayLabel = new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    const title = heading ?? "Today's Prayer Times"
    const side = subLabel ?? `${todayLabel} · ${locationLabel}`

    return (
      <section className="bg-[color:var(--icms-emerald)] text-white">
        <div className="mx-auto w-full max-w-[1280px] px-8">
          <div className="flex flex-wrap items-center justify-between gap-2 pt-[1.2rem]">
            <p className="icms-display m-0 text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[color:var(--icms-gold)]">
              {title}
            </p>
            <p className="m-0 text-[0.7rem] text-white/40">{side}</p>
          </div>
          <div className="my-3 h-px bg-[color:var(--icms-gold)] opacity-55" />
          <div
            className="grid pb-[1.2rem]"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))' }}
          >
            {times.map((t, i) => (
              <div
                key={t.name}
                className="px-1 py-[0.4rem] text-center"
                style={{
                  borderRight:
                    i < times.length - 1
                      ? '1px solid color-mix(in srgb, var(--icms-gold) 28%, transparent)'
                      : 'none',
                }}
              >
                <p className="mb-[0.2rem] text-[0.63rem] font-medium uppercase tracking-[0.12em] text-[color:var(--icms-gold)]">
                  {displayPrayerName(t.name)}
                </p>
                <p className="icms-display m-0 text-[0.95rem] font-semibold text-[color:var(--icms-ivory)]">
                  {t.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="icms-section bg-white">
      <div className="icms-container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
              Today
            </p>
            <h2 className="icms-display mt-2 text-3xl text-[color:var(--icms-forest)]">
              Prayer Times
            </h2>
          </div>
          {href && (
            <Link
              href={href}
              className="text-sm font-semibold text-[color:var(--icms-emerald)] hover:underline"
            >
              Full timetable →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {times.map((t) => (
            <div
              key={t.name}
              className="border border-[color:var(--icms-gold)]/30 bg-white px-3 py-4 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--icms-gold)]">
                {displayPrayerName(t.name)}
              </p>
              <p className="icms-display mt-2 text-lg text-[color:var(--icms-emerald)]">{t.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
