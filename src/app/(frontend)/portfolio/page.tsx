import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import { getPortfolioCases } from '@/lib/portfolio'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Portfolio | Hyperion Tech Hub',
  description:
    'Named case studies from Nigerian schools and SMEs — Bright Olivelight Schools, Haqqul Mubeen Islamic Schools, and Fizam Table Water.',
}

export default function PortfolioPage() {
  const items = getPortfolioCases()

  return (
    <main className="min-h-screen pt-20">
      <Header />
      <section className="py-20 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#1B1C1E] mb-6">Portfolio</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Named work we still support. Every logo is a client you can call and a system we maintain —
            not an inflated client count.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <Link
                key={item.slug}
                href={`/portfolio/${item.slug}`}
                className="group border border-gray-200 rounded-2xl p-8 hover:border-[#1A2BC2] hover:shadow-lg transition-all bg-gray-50 flex flex-col"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1A2BC2] mb-2">
                  {item.category}
                </p>
                <h2 className="text-xl font-semibold text-[#1B1C1E] mb-2 group-hover:text-[#1A2BC2]">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-500 mb-4">{item.client}</p>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">{item.summary}</p>
                <span className="inline-flex items-center text-[#1A2BC2] font-medium mt-6">
                  Read case study
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <h2 className="text-2xl text-[#1B1C1E] mb-4">Want results like these?</h2>
          <p className="text-gray-600 mb-6">
            Start with EduSuite for schools or an SME Kit for your business — then stay on Hyperion Care.
          </p>
          <Link
            href="/get-started"
            className="inline-flex bg-[#1A2BC2] text-white px-8 py-3 rounded-lg hover:bg-[#0D0D52]"
          >
            Get started
          </Link>
        </div>
      </section>
      <Footer />
      <BackToTop />
    </main>
  )
}
