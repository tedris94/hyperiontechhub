import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getAllArticles } from '@/lib/icms/content'
import ArticlesAdmin from './ArticlesAdmin'

type Props = { params: Promise<{ tenant: string }> }

export default async function AdminArticlesPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const articles = await getAllArticles(doc.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">Articles</h1>
        <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
          CMS for non-technical editors
        </p>
      </div>

      <ArticlesAdmin tenantSlug={tenant.slug} articles={articles} />
    </div>
  )
}
