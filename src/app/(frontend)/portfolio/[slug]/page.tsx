import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import { getPortfolioCaseAsync, getPortfolioCasesAsync } from '@/lib/portfolio'
import { FeatureList } from '@/components/ProductPageShell'
import { ArrowLeft, ExternalLink } from 'lucide-react'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const cases = await getPortfolioCasesAsync()
  return cases.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const item = await getPortfolioCaseAsync(slug)
  if (!item) return { title: 'Case study' }
  return {
    title: `${item.title} | ${item.client} — Hyperion Tech Hub`,
    description: item.summary,
  }
}

export default async function PortfolioCasePage({ params }: Props) {
  const { slug } = await params
  const item = await getPortfolioCaseAsync(slug)
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
          <p className="text-lg text-gray-600 mb-6">{item.client}</p>
          {item.projectUrl ? (
            <a
              href={item.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1A2BC2] hover:bg-[#0D0D52] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Visit live app
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : null}
        </div>
      </section>

      <section className="pb-8 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm">
            <Image
              src={item.previewImage}
              alt={`${item.client} product preview`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
            <div className="absolute left-4 bottom-4 h-16 w-16 rounded-xl bg-white/95 shadow-md border border-black/5 p-2">
              <div className="relative h-full w-full">
                <Image src={item.logo} alt="" fill className="object-contain" sizes="64px" aria-hidden />
              </div>
            </div>
          </div>
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
          {item.brandColors.length > 0 && (
            <div>
              <h2 className="text-2xl text-[#1B1C1E] mb-3">Brand colors</h2>
              <div className="flex flex-wrap gap-3">
                {item.brandColors.map((color) => (
                  <div key={color} className="flex items-center gap-2">
                    <span
                      className="h-8 w-8 rounded-lg border border-black/10"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-mono text-sm text-gray-600">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {item.projectUrl && (
            <a
              href={item.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#1A2BC2] font-semibold hover:underline"
            >
              Visit live site
              <ExternalLink className="w-4 h-4" />
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
