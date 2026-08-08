import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import { ArrowRight, CheckCircle } from 'lucide-react'

type PricingBand = { min: number; max: number; note?: string }

function formatNgn(n: number) {
  return `₦${n.toLocaleString('en-NG')}`
}

export function ProductPageShell({
  badge,
  title,
  tagline,
  children,
  primaryCta = { label: 'Schedule consultation', href: '/consultation' },
  secondaryCta = { label: 'Contact us', href: '/#contact' },
}: {
  badge: string
  title: string
  tagline: string
  children: React.ReactNode
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}) {
  return (
    <main className="min-h-screen pt-20">
      <Header />
      <section className="relative py-20 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#1A2BC2] mb-3">{badge}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#1B1C1E] mb-4">{title}</h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">{tagline}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center bg-[#1A2BC2] hover:bg-[#0D0D52] text-white px-8 py-3 rounded-lg transition-colors"
              >
                {primaryCta.label}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center border-2 border-[#1A2BC2] text-[#1A2BC2] hover:bg-[#1A2BC2] hover:text-white px-8 py-3 rounded-lg transition-colors"
              >
                {secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </section>
      {children}
      <Footer />
      <BackToTop />
    </main>
  )
}

export function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-gray-700">
          <CheckCircle className="w-5 h-5 text-[#1A2BC2] flex-shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function PriceBand({ label, band }: { label: string; band: PricingBand }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-[#1B1C1E]">
        {formatNgn(band.min)} – {formatNgn(band.max)}
      </p>
      {band.note && <p className="text-sm text-gray-500 mt-2">{band.note}</p>}
    </div>
  )
}

export { formatNgn }
