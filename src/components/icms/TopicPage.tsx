import Link from 'next/link'
import type { Article, EventItem, PageContent, TenantConfig, DonateFund } from '@/lib/icms/types'
import PageHero from './PageHero'

function hrefJoin(base: string, path: string) {
  if (!base) return `/${path}`
  return `${base}/${path}`
}

type Props = {
  tenant: TenantConfig
  base: string
  page: PageContent
  kind: 'khutba' | 'zakah' | 'ramadan'
  events?: EventItem[]
  articles?: Article[]
  funds?: DonateFund[]
}

export default function TopicPage({ tenant, base, page, kind, events = [], articles = [], funds = [] }: Props) {
  const visibleEvents = events.filter((event) => {
    const text = `${event.title} ${event.category || ''}`.toLowerCase()
    return kind === 'khutba'
      ? text.includes('khut') || text.includes('jum') || text.includes('friday')
      : kind === 'ramadan'
        ? text.includes('ramadan') || text.includes('iftar') || text.includes('taraweeh')
        : false
  })
  const visibleArticles = articles.filter((article) => {
    const text = `${article.title} ${article.category}`.toLowerCase()
    return kind === 'khutba'
      ? text.includes('khut') || text.includes('jum') || text.includes('friday')
      : kind === 'ramadan'
        ? text.includes('ramadan')
        : false
  })

  return (
    <>
      <PageHero tenant={tenant} patterned title={page.heroTitle || kind} subtitle={page.heroSubtitle || ''} />
      <section className="bg-[color:var(--icms-ivory)] px-6 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <h2 className="icms-display text-3xl font-semibold text-[color:var(--icms-forest)]">
              {page.introHeading || 'At the Centre'}
            </h2>
            <p className="mt-5 whitespace-pre-line text-base leading-8 text-[color:var(--icms-charcoal)]/80">
              {page.introBody || 'Discover the Centre’s programmes and community work.'}
            </p>
          </div>

          {kind === 'zakah' ? (
            <div className="mt-12 border border-[color:var(--icms-gold)]/30 bg-white p-6 md:p-8">
              <p className="text-sm leading-7 text-[color:var(--icms-charcoal)]/80">
                Your Zakah helps eligible families meet essential needs with dignity. Contributions are received through the Centre’s Zakat fund.
              </p>
              {funds.length > 0 ? (
                <p className="mt-4 text-sm font-semibold text-[color:var(--icms-forest)]">{funds[0].label}</p>
              ) : null}
              <Link href={hrefJoin(base, 'donate')} className="icms-btn-primary mt-6 inline-flex">
                {page.ctaPrimaryLabel || 'Give Zakah'}
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              <TopicList title={kind === 'khutba' ? 'Jumu’ah & Khutba' : 'Programmes & Events'} events={visibleEvents} />
              <ArticleList title="Related reflections" base={base} articles={visibleArticles} />
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function TopicList({ title, events }: { title: string; events: EventItem[] }) {
  return (
    <div>
      <h3 className="icms-display text-xl font-semibold text-[color:var(--icms-forest)]">{title}</h3>
      <div className="mt-5 space-y-4">
        {(events.length ? events : [{ id: 'empty', title: 'New programme details coming soon', date: '', time: '', venue: '', blurb: '' }]).map((event) => (
          <article key={event.id} className="border-t border-[color:var(--icms-gold)]/25 pt-4">
            <h4 className="font-semibold text-[color:var(--icms-charcoal)]">{event.title}</h4>
            {event.date ? <p className="mt-1 text-xs uppercase tracking-wider text-[color:var(--icms-gold)]">{event.date} · {event.venue}</p> : null}
            {event.blurb ? <p className="mt-2 text-sm leading-6 text-[color:var(--icms-warm-gray)]">{event.blurb}</p> : null}
          </article>
        ))}
      </div>
    </div>
  )
}

function ArticleList({ title, base, articles }: { title: string; base: string; articles: Article[] }) {
  return (
    <div>
      <h3 className="icms-display text-xl font-semibold text-[color:var(--icms-forest)]">{title}</h3>
      <div className="mt-5 space-y-4">
        {(articles.length ? articles : []).map((article) => (
          <Link key={article.id} href={hrefJoin(base, `articles/${article.slug}`)} className="block border-t border-[color:var(--icms-gold)]/25 pt-4 hover:text-[color:var(--icms-emerald)]">
            <h4 className="font-semibold">{article.title}</h4>
            <p className="mt-2 text-sm leading-6 text-[color:var(--icms-warm-gray)]">{article.excerpt}</p>
          </Link>
        ))}
        {!articles.length ? <p className="border-t border-[color:var(--icms-gold)]/25 pt-4 text-sm text-[color:var(--icms-warm-gray)]">Related reflections will appear here.</p> : null}
      </div>
    </div>
  )
}
