'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export type ArticleCard = {
  id: string
  slug: string
  title: string
  category: string
  date: string
  excerpt: string
  photo: string
  readTime: string
}

export default function ArticlesFilter({
  base,
  articles,
}: {
  base: string
  articles: ArticleCard[]
}) {
  const categories = useMemo(() => {
    const set = new Set(articles.map((a) => a.category).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [articles])

  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? articles : articles.filter((a) => a.category === cat)

  if (!articles.length) {
    return (
      <section className="bg-[color:var(--icms-ivory)] px-8 py-20">
        <div className="mx-auto max-w-[1280px] text-center text-[0.9rem] text-[color:var(--icms-warm-gray)]">
          No published articles yet. Add them in the tenant admin Articles section.
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[color:var(--icms-ivory)] px-8 py-20">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mb-12 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`rounded-[3px] px-4 py-[0.4rem] text-[0.73rem] font-medium tracking-[0.08em] transition-colors ${
                cat === c
                  ? 'border border-[color:var(--icms-gold)] bg-[color:var(--icms-gold)] text-[color:var(--icms-forest)]'
                  : 'border border-[color:var(--icms-gold)]/27 bg-transparent text-[color:var(--icms-warm-gray)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-col">
          {filtered.map((article, i) => (
            <div key={article.id}>
              <div className="grid gap-8 py-8 md:grid-cols-[200px_1fr] md:items-start">
                <div className="relative h-[130px] overflow-hidden rounded-[3px] bg-[color:var(--icms-forest)]">
                  <Image
                    src={article.photo}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
                      {article.category}
                    </span>
                    <span className="inline-block h-[3px] w-[3px] rounded-full bg-[color:var(--icms-gold)]/50" />
                    <span className="text-[0.7rem] text-[color:var(--icms-warm-gray)]">
                      {article.date}
                    </span>
                    <span className="text-[0.7rem] text-[color:var(--icms-warm-gray)]/53">
                      · {article.readTime} read
                    </span>
                  </div>
                  <h3 className="icms-display mb-[0.4rem] text-[clamp(0.95rem,1.8vw,1.15rem)] font-semibold leading-snug text-[color:var(--icms-charcoal)]">
                    {article.title}
                  </h3>
                  <p className="mb-4 text-[0.85rem] leading-[1.7] text-[color:var(--icms-warm-gray)]">
                    {article.excerpt}
                  </p>
                  <Link
                    href={`${base}/articles/${article.slug}`}
                    className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-emerald)]"
                  >
                    Read article →
                  </Link>
                </div>
              </div>
              {i < filtered.length - 1 ? (
                <div className="h-px bg-[color:var(--icms-gold)] opacity-20" aria-hidden />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
