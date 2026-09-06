import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { getPortfolioCasesAsync, type PortfolioCase } from '@/lib/portfolio'

function industryLabel(industry: string) {
  if (industry === 'schools') return 'Schools'
  if (industry === 'mosques') return 'Mosques'
  if (industry === 'smes') return 'SMEs'
  return industry
}

function CaseStudyCard({ item }: { item: PortfolioCase }) {
  const fitContain = item.previewFit === 'contain'

  return (
    <article className="group h-full overflow-hidden border border-gray-200 rounded-2xl hover:border-[#1A2BC2] hover:shadow-xl transition-all duration-300 bg-white flex flex-col">
      <Link
        href={`/portfolio/${item.slug}`}
        className={`relative aspect-[16/10] overflow-hidden block ${
          fitContain ? 'bg-gradient-to-br from-gray-50 to-gray-100 p-6' : 'bg-gray-100'
        }`}
      >
        <Image
          src={item.previewImage}
          alt={`${item.client} — product preview`}
          fill
          className={`${
            fitContain ? 'object-contain' : 'object-cover object-top'
          } transition-transform duration-500 group-hover:scale-[1.04]`}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80 pointer-events-none" />
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
        <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wide bg-white/95 text-[#1A2BC2] px-2.5 py-1 rounded-md shadow-sm">
          {industryLabel(item.industry)}
        </span>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[11px] text-gray-400 mb-1">{item.category}</p>
        <Link href={`/portfolio/${item.slug}`}>
          <h3 className="text-lg font-semibold text-[#1B1C1E] mb-1 group-hover:text-[#1A2BC2] transition-colors">
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
              className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold bg-[#1A2BC2] text-white px-3 py-2.5 rounded-lg hover:bg-[#0D0D52] transition-colors"
            >
              Visit live site
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : null}
          <Link
            href={`/portfolio/${item.slug}`}
            className="inline-flex items-center justify-center text-[#1A2BC2] text-sm font-medium hover:underline"
          >
            Read case study
            <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default async function IndustryCaseStudies({
  industry,
  slugs,
  title = 'Case studies',
  subtitle = 'Named work we still support — open a live site or read the full story.',
}: {
  industry?: string
  slugs?: string[]
  title?: string
  subtitle?: string
}) {
  const all = await getPortfolioCasesAsync()
  const items = all.filter((c) => {
    if (slugs?.length) return slugs.includes(c.slug)
    if (industry) return c.industry === industry
    return false
  })

  if (!items.length) return null

  const cols =
    items.length === 1
      ? 'max-w-md mx-auto grid-cols-1'
      : items.length === 2
        ? 'max-w-4xl mx-auto sm:grid-cols-2'
        : 'max-w-6xl mx-auto sm:grid-cols-2 lg:grid-cols-3'

  return (
    <section id="case-studies" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl text-[#1B1C1E] mb-3">{title}</h2>
          <p className="text-gray-600 leading-relaxed">{subtitle}</p>
        </div>
        <div className={`grid gap-6 ${cols}`}>
          {items.map((item) => (
            <CaseStudyCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
