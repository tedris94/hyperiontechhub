import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getCommitteeMembers } from '@/lib/icms/content'
import CommitteeCrud from './CommitteeCrud'

type Props = { params: Promise<{ tenant: string }> }

const FIELDS = [
  { name: 'name', label: 'Full name' },
  { name: 'roleTitle', label: 'Role title', hint: 'e.g. Chairperson, Secretary, HR Lead' },
  {
    name: 'committeeType',
    label: 'Committee',
    type: 'select' as const,
    options: [
      { label: 'Shurah', value: 'shurah' },
      { label: 'HR', value: 'hr' },
      { label: 'Waqf & Projects', value: 'waqf' },
      { label: 'Education', value: 'education' },
      { label: 'Outreach', value: 'outreach' },
      { label: 'Finance', value: 'finance' },
      { label: 'Other', value: 'other' },
    ],
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Past term', value: 'past' },
    ],
  },
  { name: 'phone', label: 'Phone' },
  { name: 'email', label: 'Email', type: 'email' as const },
  { name: 'termStart', label: 'Term start', type: 'date' as const },
  { name: 'termEnd', label: 'Term end', type: 'date' as const },
  { name: 'bio', label: 'Public bio', type: 'textarea' as const },
  {
    name: 'photoUrl',
    label: 'Photo',
    type: 'image' as const,
    hint: 'JPG, PNG, WebP, AVIF, GIF, SVG, and similar. Upload then click Save.',
  },
  {
    name: 'notes',
    label: 'Internal notes',
    type: 'textarea' as const,
    hint: 'HR notes — not shown on the public site.',
  },
  { name: 'sortOrder', label: 'Sort order', type: 'number' as const },
  {
    name: 'showOnPublic',
    label: 'Show on public Shurah page',
    type: 'checkbox' as const,
    hint: 'Only active members with this checked appear publicly.',
  },
]

export default async function AdminCommitteePage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const members = await getCommitteeMembers(doc.id)

  const rows = members.map((m) => ({
    id: m.id,
    name: m.name,
    roleTitle: m.roleTitle,
    committeeType: m.committeeType,
    status: m.status,
    phone: m.phone || '',
    email: m.email || '',
    termStart: m.termStart || '',
    termEnd: m.termEnd || '',
    bio: m.bio || '',
    photoUrl: m.photoUrl || '',
    notes: m.notes || '',
    sortOrder: m.sortOrder != null ? String(m.sortOrder) : '',
    showOnPublic: m.showOnPublic !== false,
  }))

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">
            Shurah &amp; Committees
          </h1>
          <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
            Manage Shurah, HR, and standing committee members — terms, contacts, and public roster.
          </p>
        </div>
        <Link
          href={`/icms/${tenant.slug}/committee`}
          className="text-sm font-medium text-[color:var(--icms-emerald)] hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          View public Shurah page →
        </Link>
      </div>

      <CommitteeCrud tenantSlug={tenant.slug} rows={rows} fields={FIELDS} />
    </div>
  )
}
