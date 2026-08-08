import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getPageContent, getPublishedArticles } from '@/lib/icms/content'
import { getPublicBaseFromHeaders } from '@/lib/icms/public-base-server'
import { ICMS_MEDIA } from '@/lib/icms/media-assets'
import PageHero from '@/components/icms/PageHero'
import ArticlesFilter from './ArticlesFilter'

type Props = { params: Promise<{ tenant: string }> }

export default async function ArticlesPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const base = await getPublicBaseFromHeaders(tenant.slug)
  const [page, articles] = await Promise.all([
    getPageContent(doc.id, 'articles'),
    getPublishedArticles(doc.id),
  ])

  const list = articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    category: a.category || 'General',
    date: a.date,
    excerpt: a.excerpt,
    photo: a.coverImageUrl || ICMS_MEDIA.articleFallback,
    readTime: `${Math.max(2, Math.ceil(a.body.join(' ').split(/\s+/).length / 200))} min`,
  }))

  return (
    <>
      <PageHero
        tenant={tenant}
        patterned
        title={page.heroTitle || 'Articles'}
        subtitle={
          page.heroSubtitle ||
          'Knowledge, reflection, and commentary from the scholars and community.'
        }
      />
      <ArticlesFilter base={base} articles={list} />
    </>
  )
}
