import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTenantConfig } from '@/lib/icms/tenants'
import { BRAND_TOKEN_DEFS, BRAND_RATIO_COPY } from '@/lib/icms/brand-tokens'
import { getPublicBaseFromHeaders } from '@/lib/icms/public-base-server'
import { getUiVariant } from '@/lib/icms/ui-variants'
import PageHero from '@/components/icms/PageHero'

type Props = { params: Promise<{ tenant: string }> }

export default async function DesignSystemPage({ params }: Props) {
  const { tenant: slug } = await params
  const tenant = await getTenantConfig(slug)
  if (!tenant) notFound()
  const base = await getPublicBaseFromHeaders(tenant.slug)
  const variant = getUiVariant(tenant.uiVariant)

  return (
    <>
      <PageHero
        tenant={tenant}
        title="Design system"
        subtitle={`Foundations for ${tenant.shortName} — active layout pack: ${variant.label}.`}
      />
      <section className="icms-section bg-white">
        <div className="icms-container space-y-14">
          <div>
            <h2 className="icms-display text-2xl text-[color:var(--icms-forest)]">Logo lockups</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center border border-black/10 bg-[color:var(--icms-ivory)] p-8">
                <Image src={tenant.logo} alt="" width={120} height={120} className="object-contain" />
                <p className="mt-4 text-xs uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
                  Full on ivory
                </p>
              </div>
              <div className="flex flex-col items-center border border-black/10 bg-[color:var(--icms-forest)] p-8">
                <Image
                  src={tenant.logo}
                  alt=""
                  width={120}
                  height={120}
                  className="rounded-full bg-white object-contain p-2"
                />
                <p className="mt-4 text-xs uppercase tracking-wider text-white/70">Mark on forest</p>
              </div>
              <div className="flex flex-col items-center justify-center border border-black/10 bg-white p-8 text-center">
                <p className="icms-display text-lg text-[color:var(--icms-emerald)]">{tenant.shortName}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
                  Islamic Center
                </p>
                <p className="mt-4 text-xs uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
                  Wordmark stack
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="icms-display text-2xl text-[color:var(--icms-forest)]">Color tokens</h2>
            <p className="mt-2 text-sm text-[color:var(--icms-warm-gray)]">{BRAND_RATIO_COPY}</p>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {BRAND_TOKEN_DEFS.map((s) => {
                const hex = tenant.colors[s.key]
                return (
                  <div key={s.key} className="border border-black/10 bg-[color:var(--icms-ivory)]">
                    <div className="h-20" style={{ background: hex }} />
                    <div className="p-3">
                      <p className="text-sm font-semibold">{s.name}</p>
                      <p className="font-mono text-xs text-[color:var(--icms-warm-gray)]">{hex}</p>
                      <p className="mt-1 text-[0.65rem] text-[color:var(--icms-warm-gray)]">
                        {s.cssVar}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h2 className="icms-display text-2xl text-[color:var(--icms-forest)]">Typography</h2>
            <div className="mt-6 space-y-4 border border-black/10 bg-[color:var(--icms-ivory)] p-6">
              <p className="icms-display text-4xl font-bold text-[color:var(--icms-forest)]">
                Cinzel — Display (Bold H1)
              </p>
              <p className="icms-display text-2xl font-semibold text-[color:var(--icms-forest)]">
                Cinzel — SemiBold H2
              </p>
              <p className="text-lg font-medium">Montserrat — Body and UI</p>
              <p className="icms-arabic text-2xl text-[color:var(--icms-emerald)]">
                Amiri — Arabic / Qur’anic style
              </p>
            </div>
          </div>

          <div>
            <h2 className="icms-display text-2xl text-[color:var(--icms-forest)]">Components</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="icms-btn-primary">
                Primary button
              </button>
              <button type="button" className="icms-btn-secondary">
                Secondary button
              </button>
              <input className="icms-input max-w-xs" placeholder="Form field" />
            </div>
          </div>

          <div className="border border-[color:var(--icms-gold)]/40 bg-[color:var(--icms-gold)]/10 p-5 text-sm">
            <p className="font-semibold text-[color:var(--icms-forest)]">Figma MCP status</p>
            <p className="mt-2 text-[color:var(--icms-warm-gray)]">
              Native Figma file creation is blocked until Cursor OAuth callback on{' '}
              <code>localhost:8787</code> works. Use this page + the live public/admin screens as the
              presentation design source of truth. Figma Make prompts:{' '}
              <code>src/lib/icms/FIGMA-MAKE-PROMPTS.md</code>
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={base || '/'} className="icms-btn-primary">
                Public site
              </Link>
              <Link href={`/icms/admin/${tenant.slug}`} className="icms-btn-secondary">
                Admin portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
