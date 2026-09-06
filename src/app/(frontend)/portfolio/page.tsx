import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import ClientLogoGarden from '@/components/ClientLogoGarden'
import Partners from '@/components/Partners'
import { getPortfolioCasesAsync } from '@/lib/portfolio'
import { ArrowRight, ExternalLink } from 'lucide-react'

export const metadata = {
  title: 'Portfolio | Hyperion Tech Hub',
  description:
    'Named case studies — Bright Olivelight Schools, Haqqul Mubeen Islamic Schools, Model Islamic Education Foundation, Anas bn Malik Islamic Center (ICMS), and Fizam Table Water.',
}

function industryLabel(industry: string) {
  if (industry === 'schools') return 'Schools'
  if (industry === 'mosques') return 'Mosques'
  if (industry === 'smes') return 'SMEs'
  return industry
}

export default async function PortfolioPage() {
  const items = await getPortfolioCasesAsync()

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

      <ClientLogoGarden />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <article
                key={item.slug}
                className="group overflow-hidden border border-gray-200 rounded-2xl hover:border-[#1A2BC2] hover:shadow-lg transition-all bg-white flex flex-col"
              >
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
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1A2BC2] mb-1">
                    {industryLabel(item.industry)}
                  </p>
                  <p className="text-[11px] text-gray-400 mb-2">{item.category}</p>
                  <Link href={`/portfolio/${item.slug}`}>
                    <h2 className="text-base font-semibold text-[#1B1C1E] mb-1 group-hover:text-[#1A2BC2]">
                      {item.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-gray-500 mb-3">{item.client}</p>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-3">
                    {item.summary}
                  </p>
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
                      className="inline-flex items-center text-[#1A2BC2] font-medium text-sm"
                    >
                      Read case study
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Partners />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <h2 className="text-2xl text-[#1B1C1E] mb-4">Want results like these?</h2>
          <p className="text-gray-600 mb-6">
            Start with EduSuite, ICMS, or an SME Kit — then stay on Hyperion Care.
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
