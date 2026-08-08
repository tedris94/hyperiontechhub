import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { formatNaira, getWaqfProjects } from '@/lib/icms/content'
import WaqfCrud from './WaqfCrud'

type Props = { params: Promise<{ tenant: string }> }

export default async function AdminWaqfPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const projects = await getWaqfProjects(doc.id)

  const rows = projects.map((p) => ({
    id: p.id,
    title: p.title,
    summary: p.summary,
    description: p.description || '',
    status: p.status,
    progress: String(p.progress),
    goalAmount: p.goalAmount != null ? String(p.goalAmount) : '',
    raisedAmount: p.raisedAmount != null ? String(p.raisedAmount) : '',
    progressLabel: `${p.progress}%`,
    raisedLabel:
      p.raisedAmount != null && p.goalAmount != null
        ? `${formatNaira(p.raisedAmount)} / ${formatNaira(p.goalAmount)}`
        : '—',
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">Waqf projects</h1>
        <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
          Projects and fundraising progress on the public Waqf page.
        </p>
      </div>

      <WaqfCrud tenantSlug={tenant.slug} rows={rows} />
    </div>
  )
}
