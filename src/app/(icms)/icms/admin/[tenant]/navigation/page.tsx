import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import NavigationEditor from './NavigationEditor'

type Props = { params: Promise<{ tenant: string }> }

export default async function AdminNavigationPage({ params }: Props) {
  const { tenant: slug } = await params
  const user = await getCurrentUser()
  if (!user || user.role !== 'super_admin') redirect(`/login?returnTo=/icms/admin/${slug}/navigation`)

  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">Public navigation</h1>
        <p className="mt-1 max-w-2xl text-sm text-[color:var(--icms-warm-gray)]">
          Manage the links shown on this centre&apos;s public header. Reorder items and choose whether each belongs in the primary bar or More dropdown.
        </p>
      </div>
      <NavigationEditor tenantId={String(doc.id)} tenantSlug={tenant.slug} initial={tenant.navigation} />
    </div>
  )
}
