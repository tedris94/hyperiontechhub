import Link from 'next/link'
import { getPortfolioCases } from '@/lib/portfolio'
import { ArrowRight } from 'lucide-react'

export default function FeaturedCases() {
  const items = getPortfolioCases().filter((c) => c.featured).slice(0, 3)

  return (
    <section className="py-24 bg-white" id="portfolio-preview">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">Named work we still support</h2>
          <p className="text-xl text-gray-600">
            Trust is built with real schools and SMEs — not inflated client counts.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/portfolio/${item.slug}`}
              className="group border border-gray-200 rounded-2xl p-8 hover:border-[#1A2BC2] hover:shadow-lg transition-all bg-gray-50"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1A2BC2] mb-2">
                {item.industry === 'schools' ? 'Schools' : 'SMEs'}
              </p>
              <h3 className="text-lg font-semibold text-[#1B1C1E] mb-2 group-hover:text-[#1A2BC2]">
                {item.client}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{item.summary}</p>
              <span className="inline-flex items-center text-[#1A2BC2] text-sm font-medium mt-4">
                Case study
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
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
