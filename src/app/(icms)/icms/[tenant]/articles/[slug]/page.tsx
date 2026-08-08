import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { formatDisplayDate, getArticleBySlug } from '@/lib/icms/content'
import { getPublicBaseFromHeaders } from '@/lib/icms/public-base-server'
import { ARTICLES_DATA } from '../articles-data'

type Props = { params: Promise<{ tenant: string; slug: string }> }

export default async function ArticleDetailPage({ params }: Props) {
  const { tenant: tenantSlug, slug } = await params
  const doc = await getTenantBySlug(tenantSlug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const base = await getPublicBaseFromHeaders(tenant.slug)

  const cmsArticle = await getArticleBySlug(doc.id, slug)
  const showcase = ARTICLES_DATA.find((a) => a.slug === slug)

  if (!cmsArticle && !showcase) notFound()

  const title = cmsArticle?.title ?? showcase!.title
  const category = cmsArticle?.category ?? showcase!.category
  const author = cmsArticle?.author ?? showcase!.author
  const dateLabel = cmsArticle
    ? formatDisplayDate(cmsArticle.date)
    : showcase!.date
  const readTime = showcase?.readTime ?? '5 min'
  const excerpt = cmsArticle?.excerpt ?? showcase!.excerpt
  const photo = showcase?.photo
  const body = cmsArticle?.body ?? [
    excerpt,
    'Classical Islamic scholarship does not treat religious knowledge as separate from practical life. The conditions of valid worship — the shuroot — are not bureaucratic hurdles but an expression of the comprehensive nature of Islam\'s concern for the inner state of the believer.',
    'The scholars have enumerated these conditions with care across the generations, and while there are minor differences between the legal schools, the points of agreement are far more numerous than the points of difference.',
    'For detailed rulings — and the legitimate dispensations that apply in travel, illness, and extreme circumstances — the student of knowledge is encouraged to consult the works of their own legal school. The Centre\'s weekly Tafsir and Fiqh circles are open for questions and discussion.',
  ]

  const related = ARTICLES_DATA.filter((a) => a.slug !== slug).slice(0, 3)

  return (
    <>
      {photo ? (
        <div className="relative h-[320px] overflow-hidden bg-[color:var(--icms-forest)] md:h-[420px]">
          <Image
            src={photo}
            alt={title}
            fill
            priority
            className="object-cover opacity-55"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--icms-forest)]/90 via-[color:var(--icms-forest)]/40 to-[color:var(--icms-forest)]/20" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto w-full max-w-[1280px] px-8 pb-12">
              <nav className="mb-4 flex items-center gap-2">
                <Link
                  href={`${base}/articles`}
                  className="text-[0.7rem] text-[color:var(--icms-ivory)]/53 no-underline"
                >
                  Articles
                </Link>
                <span className="text-[0.7rem] text-[color:var(--icms-ivory)]/33">›</span>
                <span className="text-[0.7rem] text-[color:var(--icms-gold)]">{category}</span>
              </nav>
              <h1 className="icms-display mb-4 max-w-[720px] text-[clamp(1.5rem,3.5vw,2.5rem)] font-bold leading-tight text-[color:var(--icms-ivory)]">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-5">
                <span className="text-[0.75rem] text-[color:var(--icms-gold)]">By {author}</span>
                <span
                  className="inline-block h-[3px] w-[3px] rounded-full bg-[color:var(--icms-ivory)]/33"
                  aria-hidden
                />
                <span className="text-[0.75rem] text-[color:var(--icms-ivory)]/53">{dateLabel}</span>
                <span className="text-[0.75rem] text-[color:var(--icms-ivory)]/40">
                  · {readTime} read
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <section className="relative overflow-hidden bg-[color:var(--icms-forest)] text-white">
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(60deg, transparent, transparent 22px, rgba(199,154,44,0.35) 22px, rgba(199,154,44,0.35) 23px), repeating-linear-gradient(-60deg, transparent, transparent 22px, rgba(199,154,44,0.2) 22px, rgba(199,154,44,0.2) 23px)',
            }}
          />
          <div className="relative mx-auto w-full max-w-[1280px] px-8 py-16 md:py-20">
            <nav className="mb-4 flex items-center gap-2">
              <Link
                href={`${base}/articles`}
                className="text-[0.7rem] text-white/53 no-underline"
              >
                Articles
              </Link>
              <span className="text-[0.7rem] text-white/33">›</span>
              <span className="text-[0.7rem] text-[color:var(--icms-gold)]">{category}</span>
            </nav>
            <h1 className="icms-display max-w-3xl text-3xl uppercase tracking-wide md:text-4xl">
              {title}
            </h1>
            <p className="mt-4 text-sm text-white/75">
              By {author} · {dateLabel} · {readTime} read
            </p>
          </div>
        </section>
      )}

      <section className="bg-[color:var(--icms-ivory)] px-8 py-20">
        <div className="mx-auto grid w-full max-w-[1280px] items-start gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20">
          <article>
            <p className="mb-6 text-base font-medium leading-[1.9] text-[color:var(--icms-charcoal)]">
              {excerpt}
            </p>
            <div
              className="my-8 h-px w-full bg-[color:var(--icms-gold)] opacity-55"
              aria-hidden
            />
            <div className="space-y-6">
              {body.map((para, i) => (
                <p
                  key={`${i}-${para.slice(0, 32)}`}
                  className="text-[0.9rem] leading-[1.9] text-[color:var(--icms-charcoal)] opacity-85"
                >
                  {para}
                </p>
              ))}
            </div>

            <blockquote className="my-10 border-l-4 border-[color:var(--icms-gold)] bg-[#F2EFE7] px-8 py-7">
              <p
                className="icms-arabic mb-3 text-right text-[1.2rem] leading-[1.8] text-[color:var(--icms-gold)]"
                dir="rtl"
              >
                الصَّلَاةُ عِمَادُ الدِّينِ
              </p>
              <p className="mb-2 text-[0.85rem] italic leading-[1.6] text-[color:var(--icms-charcoal)] opacity-85">
                &ldquo;Prayer is the pillar of the religion. Whoever establishes it has established
                the religion; whoever abandons it has demolished the religion.&rdquo;
              </p>
              <cite className="text-[0.7rem] not-italic text-[color:var(--icms-warm-gray)]">
                — Reported by al-Bayhaqi
              </cite>
            </blockquote>

            <div className="mt-12 border-t border-[color:var(--icms-gold)]/13 pt-8">
              <p className="text-[0.75rem] text-[color:var(--icms-warm-gray)]">
                Published: {dateLabel} · {readTime} read · Category: {category}
              </p>
              <Link
                href={`${base}/articles`}
                className="mt-4 inline-block text-sm font-semibold text-[color:var(--icms-emerald)]"
              >
                ← Back to articles
              </Link>
            </div>
          </article>

          <aside className="lg:sticky lg:top-[100px]">
            <p className="icms-display mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
              Related reading
            </p>
            <div
              className="mb-4 h-px w-full bg-[color:var(--icms-gold)] opacity-55"
              aria-hidden
            />
            <div className="flex flex-col gap-5">
              {related.map((a) => (
                <Link
                  key={a.id}
                  href={`${base}/articles/${a.slug}`}
                  className="group block no-underline"
                >
                  <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--icms-gold)]">
                    {a.category}
                  </p>
                  <p className="icms-display text-[0.85rem] font-semibold leading-snug text-[color:var(--icms-charcoal)] group-hover:text-[color:var(--icms-emerald)]">
                    {a.title}
                  </p>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
