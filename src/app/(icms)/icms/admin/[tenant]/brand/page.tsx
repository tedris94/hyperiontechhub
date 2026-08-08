import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { BRAND_RATIO_COPY } from '@/lib/icms/brand-tokens'
import BrandTokensForm from './BrandTokensForm'
import UiVariantPicker from './UiVariantPicker'

type Props = { params: Promise<{ tenant: string }> }

export default async function AdminBrandPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">Brand tokens</h1>
        <p className="mt-1 max-w-2xl text-sm text-[color:var(--icms-warm-gray)]">
          Tenant palette, logo, and public layout pack. Typography stays Cinzel / Montserrat /
          Amiri. {BRAND_RATIO_COPY}
        </p>
      </div>

      <UiVariantPicker
        tenantId={String(doc.id)}
        tenantSlug={tenant.slug}
        initial={tenant.uiVariant}
      />

      <BrandTokensForm
        tenantId={String(doc.id)}
        tenantSlug={tenant.slug}
        shortName={tenant.shortName}
        initial={{
          logoUrl: doc.logoUrl || tenant.logo,
          emerald: tenant.colors.emerald,
          forest: tenant.colors.forest,
          gold: tenant.colors.gold,
          ivory: tenant.colors.ivory,
          charcoal: tenant.colors.charcoal,
          warmGray: tenant.colors.warmGray,
        }}
      />
    </div>
  )
}
