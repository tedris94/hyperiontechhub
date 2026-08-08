import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import { getPortfolioCase, getPortfolioCases } from '@/lib/portfolio'
import { FeatureList } from '@/components/ProductPageShell'
import { ArrowLeft } from 'lucide-react'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getPortfolioCases().map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const item = getPortfolioCase(slug)
  if (!item) return { title: 'Case study' }
  return {
    title: `${item.title} | ${item.client} — Hyperion Tech Hub`,
    description: item.summary,
  }
}

export default async function PortfolioCasePage({ params }: Props) {
  const { slug } = await params
  const item = getPortfolioCase(slug)
  if (!item) notFound()

  return (
    <main className="min-h-screen pt-20">
      <Header />
      <section className="py-16 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <Link
            href="/portfolio"
            className="inline-flex items-center text-[#1A2BC2] text-sm font-medium mb-6 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            All case studies
          </Link>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#1A2BC2] mb-2">
            {item.category}
          </p>
          <h1 className="text-4xl md:text-5xl text-[#1B1C1E] mb-3">{item.title}</h1>
          <p className="text-lg text-gray-600">{item.client}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl space-y-12">
          <div>
            <h2 className="text-2xl text-[#1B1C1E] mb-3">Overview</h2>
            <p className="text-gray-600 leading-relaxed">{item.summary}</p>
          </div>
          <div>
            <h2 className="text-2xl text-[#1B1C1E] mb-3">Challenge</h2>
            <p className="text-gray-600 leading-relaxed">{item.challenge}</p>
          </div>
          <div>
            <h2 className="text-2xl text-[#1B1C1E] mb-3">Solution</h2>
            <p className="text-gray-600 leading-relaxed">{item.solution}</p>
          </div>
          <div>
            <h2 className="text-2xl text-[#1B1C1E] mb-4">Results</h2>
            <FeatureList items={item.results} />
          </div>
          <div>
            <h2 className="text-2xl text-[#1B1C1E] mb-3">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {item.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          {item.projectUrl && (
            <a
              href={item.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-[#1A2BC2] font-semibold hover:underline"
            >
              Visit live site →
            </a>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <h2 className="text-2xl mb-4">Build the next case study with us</h2>
          <Link
            href="/consultation"
            className="inline-flex bg-[#1A2BC2] text-white px-8 py-3 rounded-lg hover:bg-[#0D0D52]"
          >
            Schedule a consultation
          </Link>
        </div>
      </section>
      <Footer />
      <BackToTop />
    </main>
  )
}
