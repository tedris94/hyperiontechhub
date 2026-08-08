import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { resolveIcmsAccess, accessHasCapability } from '@/lib/icms/access'
import SettingsForm from './SettingsForm'
import CustomDomainPanel from './CustomDomainPanel'

type Props = { params: Promise<{ tenant: string }> }

export default async function AdminSettingsPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const user = await getCurrentUser()
  const access = user ? await resolveIcmsAccess(user, slug) : null
  const canDomains = access ? accessHasCapability(access, 'domains') : false
  const canSettingsCore = access
    ? accessHasCapability(access, 'settings') ||
      accessHasCapability(access, 'bank') ||
      accessHasCapability(access, 'prayer')
    : false

  return (
    <div className="space-y-8">
      <div>
        <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">Settings</h1>
        <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
          Contact, prayer location, bank transfer, and Paystack.
          {canDomains
            ? ' Domain connection is available below.'
            : ' Custom domains are managed by Hyperion super admin (or roles granted the Domains capability).'}{' '}
          Colors and layout pack are under Brand tokens.
        </p>
      </div>

      {canDomains ? (
        <CustomDomainPanel
          tenantSlug={tenant.slug}
          initialDomain={tenant.customDomain}
          initialStatus={tenant.customDomainStatus}
        />
      ) : (
        <div className="border border-black/10 bg-white p-6 text-sm text-[color:var(--icms-warm-gray)]">
          <p className="font-semibold text-[color:var(--icms-forest)]">Domains</p>
          <p className="mt-1">
            Subdomain:{' '}
            <span className="text-[color:var(--icms-charcoal)]">
              {tenant.slug}.hyperiontechhub.com
            </span>
          </p>
          <p className="mt-2">
            Public pages:{' '}
            <a
              className="text-[color:var(--icms-emerald)] hover:underline"
              href={`/icms/${tenant.slug}`}
              target="_blank"
              rel="noreferrer"
            >
              Home
            </a>
            <span> · </span>
            <a
              className="text-[color:var(--icms-emerald)] hover:underline"
              href={`/icms/${tenant.slug}/committee`}
              target="_blank"
              rel="noreferrer"
            >
              Shurah / Committee
            </a>
          </p>
          <p className="mt-2 text-xs">
            Connecting a custom domain requires the <strong>Custom domains</strong> capability
            (default: Hyperion super admin). Ask a super admin to grant it under Team → Visibility
            grants.
          </p>
        </div>
      )}

      {canSettingsCore ? (
        <SettingsForm
          tenantId={String(doc.id)}
          tenantSlug={tenant.slug}
          initial={{
            name: tenant.name,
            motto: tenant.motto,
            address: tenant.address,
            phone1: tenant.phones[0] || '',
            phone2: tenant.phones[1] || '',
            email: tenant.email,
            domainLabel: tenant.domainLabel,
            bankName: tenant.bank?.bankName || '',
            accountName: tenant.bank?.accountName || '',
            accountNumber: tenant.bank?.accountNumber || '',
            transferNote: tenant.bank?.transferNote || '',
            paystackPublicKey: doc.paystack?.publicKey || '',
            hasPaystackSecret: Boolean(doc.paystack?.secretKey?.trim()),
            latitude: String(tenant.prayer?.latitude ?? 9.0145),
            longitude: String(tenant.prayer?.longitude ?? 7.3986),
            timezone: tenant.prayer?.timezone || 'Africa/Lagos',
            locationLabel: tenant.prayer?.locationLabel || 'Abuja, FCT',
            calculationMethod: tenant.prayer?.calculationMethod || 'MuslimWorldLeague',
            madhab: tenant.prayer?.madhab || 'Shafi',
          }}
        />
      ) : null}
    </div>
  )
}
