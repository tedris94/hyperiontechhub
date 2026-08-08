import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTenantConfig } from '@/lib/icms/tenants'
import { tenantCssVars } from '@/lib/icms/utils'
import { getUiVariant } from '@/lib/icms/ui-variants'
import {
  getAdminAbsoluteUrl,
  isVanityHost,
  normalizeHost,
} from '@/lib/icms/public-base'
import { getPublicBaseFromHeaders } from '@/lib/icms/public-base-server'
import { headers } from 'next/headers'
import IcmsHeader from '@/components/icms/IcmsHeader'
import IcmsFooter from '@/components/icms/IcmsFooter'

type Props = {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant: slug } = await params
  const tenant = await getTenantConfig(slug)
  if (!tenant) return { title: 'Tenant not found' }
  return {
    title: {
      default: tenant.name,
      template: `%s · ${tenant.shortName}`,
    },
    description: `${tenant.name} — ${tenant.motto}. ${tenant.address}`,
  }
}

export default async function TenantPublicLayout({ children, params }: Props) {
  const { tenant: slug } = await params
  const tenant = await getTenantConfig(slug)
  if (!tenant) notFound()

  const variant = getUiVariant(tenant.uiVariant)
  const basePath = await getPublicBaseFromHeaders(tenant.slug)
  const h = await headers()
  const host = normalizeHost(h.get('x-forwarded-host') || h.get('host'))
  const vanity = isVanityHost(host, tenant.slug)
  const adminHref = vanity ? getAdminAbsoluteUrl(tenant.slug) : `/icms/admin/${tenant.slug}`

  return (
    <div
      className={`icms-root ${variant.rootClassName || ''}`}
      data-ui-variant={variant.id}
      style={tenantCssVars(tenant)}
    >
      <IcmsHeader
        tenant={tenant}
        basePath={basePath}
        adminHref={adminHref}
        headerStyle={variant.headerStyle}
      />
      <main>{children}</main>
      <IcmsFooter tenant={tenant} basePath={basePath} footerStyle={variant.footerStyle} />
    </div>
  )
}
