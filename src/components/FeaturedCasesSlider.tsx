'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import type { PortfolioCase } from '@/lib/portfolio'

function industryLabel(industry: string) {
  if (industry === 'schools') return 'Schools'
  if (industry === 'mosques') return 'Mosques'
  if (industry === 'smes') return 'SMEs'
  return industry
}

function CaseCard({ item }: { item: PortfolioCase }) {
  return (
    <article className="group h-full overflow-hidden border border-gray-200 rounded-2xl hover:border-[#1A2BC2] hover:shadow-lg transition-all bg-white flex flex-col">
      <Link
        href={`/portfolio/${item.slug}`}
        className="relative aspect-[16/10] bg-gray-100 overflow-hidden block"
      >
        <Image
          src={item.previewImage}
          alt={`${item.client} — live product preview`}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute left-3 bottom-3 h-12 w-12 md:h-14 md:w-14 rounded-xl bg-white/95 shadow-md border border-black/5 p-1.5">
          <div className="relative h-full w-full">
            <Image
              src={item.logo}
              alt=""
              fill
              className="object-contain"
              sizes="56px"
              aria-hidden
            />
          </div>
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#1A2BC2] mb-2">
          {industryLabel(item.industry)}
        </p>
        <Link href={`/portfolio/${item.slug}`}>
          <h3 className="text-base font-semibold text-[#1B1C1E] mb-2 group-hover:text-[#1A2BC2]">
            {item.client}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">{item.summary}</p>
        <div className="mt-4 flex flex-col gap-2">
          {item.projectUrl ? (
            <a
              href={item.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold bg-[#1A2BC2] text-white px-3 py-2 rounded-lg hover:bg-[#0D0D52]"
            >
              Visit live app
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : null}
          <Link
            href={`/portfolio/${item.slug}`}
            className="inline-flex items-center text-[#1A2BC2] text-sm font-medium"
          >
            Case study
            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function FeaturedCasesSlider({ items }: { items: PortfolioCase[] }) {
  const [index, setIndex] = useState(0)
  const [perView, setPerView] = useState(4)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setPerView(1)
      else if (window.innerWidth < 1024) setPerView(2)
      else setPerView(4)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const maxIndex = Math.max(0, items.length - perView)

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex))
  }, [maxIndex])

  const next = useCallback(() => {
    setIndex((i) => (i >= maxIndex ? 0 : i + 1))
  }, [maxIndex])

  const prev = useCallback(() => {
    setIndex((i) => (i <= 0 ? maxIndex : i - 1))
  }, [maxIndex])

  useEffect(() => {
    if (paused || items.length <= perView) return
    const id = window.setInterval(next, 4500)
    return () => window.clearInterval(id)
  }, [paused, items.length, perView, next])

  if (!items.length) return null

  return (
    <section className="py-24 bg-white" id="portfolio-preview">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">Named work we still support</h2>
          <p className="text-xl text-gray-600">
            Trust is built with real schools, mosques, and SMEs — not inflated client counts.
          </p>
        </div>

        <div
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${(index * 100) / perView}%)`,
              }}
            >
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="shrink-0 px-3"
                  style={{ width: `${100 / perView}%` }}
                >
                  <CaseCard item={item} />
                </div>
              ))}
            </div>
          </div>

          {items.length > perView ? (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous cases"
                className="absolute -left-2 md:-left-4 top-[28%] -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white border border-gray-200 shadow-md text-[#1A2BC2] hover:border-[#1A2BC2] flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next cases"
                className="absolute -right-2 md:-right-4 top-[28%] -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white border border-gray-200 shadow-md text-[#1A2BC2] hover:border-[#1A2BC2] flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? 'w-6 bg-[#1A2BC2]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/portfolio"
            className="inline-flex items-center text-[#1A2BC2] font-semibold hover:underline"
          >
            View full portfolio
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
