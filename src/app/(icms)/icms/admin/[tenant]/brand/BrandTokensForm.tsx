'use client'

import { useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import ImageUploadField from '@/components/icms/ImageUploadField'
import { useIcmsToast } from '@/components/icms/toast'
import type { TenantColors } from '@/lib/icms/types'
import {
  BRAND_RATIO_COPY,
  BRAND_TOKEN_DEFS,
  BRAND_TYPOGRAPHY,
  DEFAULT_TENANT_COLORS,
  normalizeHex,
} from '@/lib/icms/brand-tokens'

type Initial = TenantColors & { logoUrl: string }

export default function BrandTokensForm({
  tenantId,
  tenantSlug,
  shortName,
  initial,
}: {
  tenantId: string
  tenantSlug: string
  shortName: string
  initial: Initial
}) {
  const toast = useIcmsToast()
  const [colors, setColors] = useState<TenantColors>({
    emerald: initial.emerald,
    forest: initial.forest,
    gold: initial.gold,
    ivory: initial.ivory,
    charcoal: initial.charcoal,
    warmGray: initial.warmGray,
  })
  const [logoUrl, setLogoUrl] = useState(initial.logoUrl)
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)
  const [saving, setSaving] = useState(false)

  const previewStyle = useMemo(
    () =>
      ({
        ['--icms-emerald' as string]: colors.emerald,
        ['--icms-forest' as string]: colors.forest,
        ['--icms-gold' as string]: colors.gold,
        ['--icms-ivory' as string]: colors.ivory,
        ['--icms-charcoal' as string]: colors.charcoal,
        ['--icms-warm-gray' as string]: colors.warmGray,
      }) as CSSProperties,
    [colors],
  )

  function setToken(key: keyof TenantColors, value: string) {
    setColors((s) => ({ ...s, [key]: value }))
    setOk(false)
  }

  function resetDefaults() {
    setColors({ ...DEFAULT_TENANT_COLORS })
    setOk(false)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setOk(false)
    try {
      const normalized: TenantColors = {
        emerald: normalizeHex(colors.emerald, DEFAULT_TENANT_COLORS.emerald),
        forest: normalizeHex(colors.forest, DEFAULT_TENANT_COLORS.forest),
        gold: normalizeHex(colors.gold, DEFAULT_TENANT_COLORS.gold),
        ivory: normalizeHex(colors.ivory, DEFAULT_TENANT_COLORS.ivory),
        charcoal: normalizeHex(colors.charcoal, DEFAULT_TENANT_COLORS.charcoal),
        warmGray: normalizeHex(colors.warmGray, DEFAULT_TENANT_COLORS.warmGray),
      }
      setColors(normalized)

      const res = await fetch('/api/icms/records', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'icms-tenants',
          id: isNaN(Number(tenantId)) ? tenantId : Number(tenantId),
          tenantSlug,
          data: {
            logoUrl: logoUrl || undefined,
            colors: normalized,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setOk(true)
      toast.success('Brand tokens saved')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed'
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10" style={previewStyle}>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {ok ? (
        <p className="text-sm text-[color:var(--icms-emerald)]">Brand tokens saved.</p>
      ) : null}

      <section className="border border-black/10 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
              Brand tokens
            </h2>
            <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">{BRAND_RATIO_COPY}</p>
          </div>
          <button
            type="button"
            onClick={resetDefaults}
            className="text-xs font-semibold uppercase tracking-wider text-[color:var(--icms-emerald)] hover:underline"
          >
            Reset to defaults
          </button>
        </div>

        <div
          className="mt-5 flex h-3 overflow-hidden border border-black/10"
          title={BRAND_RATIO_COPY}
          aria-hidden
        >
          <span className="w-[60%]" style={{ background: colors.ivory }} />
          <span className="w-[15%]" style={{ background: colors.emerald }} />
          <span className="w-[10%]" style={{ background: colors.forest }} />
          <span className="w-[10%]" style={{ background: colors.gold }} />
          <span className="w-[3%]" style={{ background: colors.warmGray }} />
          <span className="w-[2%]" style={{ background: colors.charcoal }} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BRAND_TOKEN_DEFS.map((token) => (
            <label
              key={token.key}
              className="block border border-black/10 bg-[color:var(--icms-ivory)] p-4"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-[color:var(--icms-charcoal)]">
                  {token.name}
                </span>
                <span className="font-mono text-[0.65rem] text-[color:var(--icms-warm-gray)]">
                  {token.cssVar}
                </span>
              </span>
              <p className="mt-1 text-xs text-[color:var(--icms-warm-gray)]">{token.usage}</p>
              <p className="mt-0.5 text-[0.65rem] uppercase tracking-wider text-[color:var(--icms-gold)]">
                {token.ratioHint}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="color"
                  aria-label={`${token.name} color picker`}
                  className="h-10 w-12 cursor-pointer border border-black/10 bg-white p-0.5"
                  value={
                    /^#[0-9A-Fa-f]{6}$/.test(colors[token.key])
                      ? colors[token.key]
                      : token.hex
                  }
                  onChange={(e) => setToken(token.key, e.target.value.toUpperCase())}
                />
                <input
                  className="icms-input font-mono uppercase"
                  value={colors[token.key]}
                  onChange={(e) => setToken(token.key, e.target.value)}
                  onBlur={() =>
                    setToken(token.key, normalizeHex(colors[token.key], token.hex))
                  }
                  placeholder={token.hex}
                  spellCheck={false}
                />
              </div>
              <p className="mt-2 font-mono text-[0.65rem] text-[color:var(--icms-warm-gray)]">
                Default {token.hex}
              </p>
            </label>
          ))}
        </div>
      </section>

      <section className="border border-black/10 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
          Typography
        </h2>
        <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
          Fixed for all tenants. Do not use Inter, Roboto, or generic AI purple themes.
        </p>
        <div className="mt-5 space-y-4">
          {BRAND_TYPOGRAPHY.map((face) => (
            <div
              key={face.id}
              className="border border-black/10 bg-[color:var(--icms-ivory)] px-5 py-4"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--icms-gold)]">
                {face.role}
              </p>
              <p className="mt-1 text-xs text-[color:var(--icms-warm-gray)]">
                {face.family} · {face.weights}
              </p>
              <p
                className={`mt-3 text-[color:var(--icms-forest)] ${face.className} ${
                  face.id === 'display'
                    ? 'text-2xl font-bold'
                    : face.id === 'arabic'
                      ? 'text-2xl'
                      : 'text-base font-medium'
                }`}
              >
                {face.sample}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-black/10 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
          Logo
        </h2>
        <p className="mt-1 mb-4 text-sm text-[color:var(--icms-warm-gray)]">
          Shown in the public header, footer, and admin shell.
        </p>
        <ImageUploadField
          label="Logo file"
          value={logoUrl}
          onChange={(v) => {
            setLogoUrl(v)
            setOk(false)
          }}
          tenantSlug={tenantSlug}
          hint="PNG, SVG, JPG, WEBP — stored under /icms/uploads/{tenant}/"
        />
      </section>

      <section className="overflow-hidden border border-black/10">
        <div className="bg-[color:var(--icms-forest)] px-6 py-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--icms-gold)]">
            Live preview
          </p>
        </div>
        <div className="bg-[color:var(--icms-ivory)] p-6">
          <div className="flex flex-wrap items-center gap-4 border-b border-[color:var(--icms-gold)]/40 pb-5">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt=""
                className="h-12 w-12 rounded-full bg-white object-contain p-1"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--icms-emerald)] text-sm font-semibold text-white">
                {shortName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className="icms-display text-lg font-semibold text-[color:var(--icms-emerald)]">
                {shortName}
              </p>
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--icms-gold)]">
                Islamic Center
              </p>
            </div>
          </div>
          <h3 className="icms-display mt-5 text-2xl font-semibold text-[color:var(--icms-forest)]">
            Sample heading
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[color:var(--icms-charcoal)]">
            Body text in Montserrat on ivory. Muted captions use warm gray; primary actions use
            emerald.
          </p>
          <p className="icms-arabic mt-3 text-xl text-[color:var(--icms-emerald)]">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className="icms-btn-primary" tabIndex={-1}>
              Primary
            </button>
            <button type="button" className="icms-btn-secondary" tabIndex={-1}>
              Secondary
            </button>
            <span className="text-sm text-[color:var(--icms-warm-gray)]">Muted label</span>
          </div>
          <div className="mt-6 bg-[color:var(--icms-forest)] px-5 py-4 text-[color:var(--icms-ivory)]">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--icms-gold)]">
              Forest section
            </p>
            <p className="mt-1 text-sm">Dark footer / strip preview</p>
          </div>
        </div>
      </section>

      <button type="submit" className="icms-btn-primary" disabled={saving}>
        {saving ? 'Saving…' : 'Save brand tokens'}
      </button>
    </form>
  )
}
