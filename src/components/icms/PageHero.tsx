import type { TenantConfig } from '@/lib/icms/types'
import type { HeroStyle } from '@/lib/icms/ui-variants'
import { getUiVariant } from '@/lib/icms/ui-variants'

export default function PageHero({
  tenant,
  title,
  subtitle,
  patterned = false,
  heroStyle: heroStyleProp,
}: {
  tenant: TenantConfig
  title: string
  subtitle: string
  /** Subtle geometric field like the Figma presentation hero */
  patterned?: boolean
  heroStyle?: HeroStyle
}) {
  const heroStyle = heroStyleProp || getUiVariant(tenant.uiVariant).heroStyle

  if (heroStyle === 'light') {
    return (
      <section className="relative overflow-hidden border-b border-black/5 bg-[color:var(--icms-ivory)]">
        <div className="icms-container relative px-4 py-14 md:px-8 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
            {tenant.shortName}
          </p>
          <h1 className="icms-display mt-3 max-w-3xl text-4xl text-[color:var(--icms-forest)] md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[color:var(--icms-warm-gray)] md:text-lg">
            {subtitle}
          </p>
        </div>
      </section>
    )
  }

  if (heroStyle === 'centered' || heroStyle === 'compact') {
    const py = heroStyle === 'compact' ? 'py-12 md:py-14' : 'py-20 md:py-24'
    return (
      <section className="relative overflow-hidden bg-[color:var(--icms-forest)] text-white">
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 0%, var(--icms-gold), transparent 55%)',
          }}
        />
        <div className={`icms-container relative px-4 text-center md:px-8 ${py}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
            {tenant.shortName}
          </p>
          <h1
            className={`icms-display mx-auto mt-3 max-w-3xl ${
              heroStyle === 'compact'
                ? 'text-3xl md:text-4xl'
                : 'text-4xl uppercase tracking-wide md:text-5xl'
            }`}
          >
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/75 md:text-lg">{subtitle}</p>
        </div>
      </section>
    )
  }

  if (heroStyle === 'split') {
    return (
      <section className="relative overflow-hidden bg-white">
        <div className="icms-container grid gap-8 px-4 py-14 md:grid-cols-2 md:items-end md:px-8 md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
              {tenant.shortName}
            </p>
            <h1 className="icms-display mt-3 text-4xl text-[color:var(--icms-forest)] md:text-5xl">
              {title}
            </h1>
          </div>
          <p className="max-w-xl text-base text-[color:var(--icms-warm-gray)] md:text-lg md:pb-2">
            {subtitle}
          </p>
        </div>
        <div className="h-1.5 w-full bg-[color:var(--icms-emerald)]" />
      </section>
    )
  }

  // forest (classic)
  return (
    <section className="relative overflow-hidden bg-[color:var(--icms-forest)] text-white">
      {patterned ? (
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(60deg, transparent, transparent 22px, rgba(199,154,44,0.35) 22px, rgba(199,154,44,0.35) 23px), repeating-linear-gradient(-60deg, transparent, transparent 22px, rgba(199,154,44,0.2) 22px, rgba(199,154,44,0.2) 23px)',
          }}
        />
      ) : (
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, var(--icms-gold), transparent 40%), radial-gradient(circle at 80% 0%, var(--icms-emerald), transparent 35%)',
          }}
        />
      )}
      <div className="icms-container relative px-4 py-16 md:px-8 md:py-20">
        <div className="mb-6 h-px w-16 bg-[color:var(--icms-gold)]" />
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--icms-gold)]">
          {tenant.shortName}
        </p>
        <h1 className="icms-display mt-3 max-w-3xl text-4xl uppercase tracking-wide md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/75 md:text-lg">{subtitle}</p>
      </div>
    </section>
  )
}
