import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getAllPageContents } from '@/lib/icms/content'
import SimpleCreateForm from '@/components/icms/SimpleCreateForm'
import PageEditor from './PageEditor'

type Props = { params: Promise<{ tenant: string }> }

const PAGE_KEYS = [
  'home',
  'about',
  'mosque',
  'leadership',
  'committee',
  'events',
  'articles',
  'waqf',
  'donate',
  'contact',
]

export default async function AdminPagesPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const pages = await getAllPageContents(doc.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">Site pages</h1>
        <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
          Edit each public page section-by-section. For Home: Hero, Prayer strip, Events, Waqf,
          Articles, and Find us / Support.
        </p>
      </div>

      <div className="overflow-x-auto border border-black/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[color:var(--icms-ivory)] text-xs uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
            <tr>
              <th className="px-4 py-3">Page</th>
              <th className="px-4 py-3">Hero title</th>
              <th className="px-4 py-3">Subtitle</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.pageKey} className="border-t border-black/5">
                <td className="px-4 py-3 font-medium capitalize">{p.pageKey}</td>
                <td className="px-4 py-3">{p.heroTitle || '—'}</td>
                <td className="px-4 py-3 max-w-md truncate">{p.heroSubtitle || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PageEditor tenantSlug={tenant.slug} pageKeys={PAGE_KEYS} existing={pages} />

      <SimpleCreateForm
        tenantSlug={tenant.slug}
        collection="icms-pages"
        title="Create page record (if missing)"
        fields={[
          {
            name: 'pageKey',
            label: 'Page key',
            type: 'select',
            options: PAGE_KEYS.map((k) => ({ label: k, value: k })),
          },
          { name: 'heroTitle', label: 'Hero title' },
          { name: 'heroSubtitle', label: 'Hero subtitle', type: 'textarea' },
        ]}
      />
    </div>
  )
}
