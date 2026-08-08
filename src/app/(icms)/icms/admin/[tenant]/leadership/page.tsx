import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getLeaders } from '@/lib/icms/content'
import LeadershipCrud from './LeadershipCrud'

type Props = { params: Promise<{ tenant: string }> }

const LEADER_FIELDS = [
  { name: 'name', label: 'Full name' },
  { name: 'roleTitle', label: 'Role title' },
  {
    name: 'category',
    label: 'Category',
    type: 'select' as const,
    options: [
      { label: 'Imam', value: 'imam' },
      { label: 'Director', value: 'director' },
      { label: 'Committee', value: 'committee' },
    ],
  },
  { name: 'bio', label: 'Bio', type: 'textarea' as const },
    {
      name: 'photoUrl',
      label: 'Photo',
      type: 'image' as const,
      hint: 'JPG, PNG, WebP, AVIF, GIF, SVG, and similar. Upload then click Save.',
    },
  { name: 'sortOrder', label: 'Sort order', type: 'number' as const },
]

export default async function AdminLeadershipPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const leaders = await getLeaders(doc.id)

  const rows = leaders.map((l) => ({
    id: l.id,
    name: l.name,
    roleTitle: l.role,
    category: l.category,
    bio: l.bio,
    photoUrl: l.photoUrl || '',
    sortOrder: l.sortOrder != null ? String(l.sortOrder) : '',
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">Leadership</h1>
        <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
          People shown on the public Leadership page.
        </p>
      </div>

      <LeadershipCrud tenantSlug={tenant.slug} rows={rows} fields={LEADER_FIELDS} />
    </div>
  )
}
