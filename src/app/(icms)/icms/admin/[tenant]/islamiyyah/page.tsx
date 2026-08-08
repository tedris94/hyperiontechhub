import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getIslamiyyahClasses, getIslamiyyahStudents } from '@/lib/icms/content'
import IslamiyyahAdminForms from './IslamiyyahAdminForms'

type Props = { params: Promise<{ tenant: string }> }

export default async function AdminIslamiyyahPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const [classes, students] = await Promise.all([
    getIslamiyyahClasses(doc.id),
    getIslamiyyahStudents(doc.id),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">Islamiyyah</h1>
        <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
          Classes and learners for {tenant.shortName}
        </p>
      </div>

      <IslamiyyahAdminForms tenantSlug={tenant.slug} classes={classes} students={students} />
    </div>
  )
}
