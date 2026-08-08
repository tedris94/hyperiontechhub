import Link from 'next/link'
import { ProductPageShell, FeatureList } from '@/components/ProductPageShell'

export const metadata = {
  title: 'SMEs | Hyperion Tech Hub',
  description:
    'Digital kits for Nigerian SMEs — websites, Paystack commerce, staff portals, and managed IT retainers.',
}

export default function SmesIndustryPage() {
  return (
    <ProductPageShell
      badge="Industry · SMEs"
      title="Digital kits for growing SMEs"
      tagline="Presence, Commerce, and Ops packages — plus Hyperion Care so you are not abandoned after launch."
      primaryCta={{ label: 'View SME Kit', href: '/products/sme-kit' }}
      secondaryCta={{ label: 'Fizam case study', href: '/portfolio/fizam-table-water' }}
    >
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl text-[#1B1C1E] mb-4">Verticals we serve</h2>
            <FeatureList
              items={[
                'Bottled water & FMCG',
                'Retail and local brands',
                'Clinics and professional services',
                'Estates, churches, and mosque admin offices',
              ]}
            />
          </div>
          <div>
            <h2 className="text-3xl text-[#1B1C1E] mb-4">Outcomes</h2>
            <FeatureList
              items={[
                'Fixed-scope quotes (no endless change requests)',
                'Paystack-ready online orders when you need them',
                'Staff / jobs portals for growing teams',
                'Monthly Care retainers for uptime and security',
              ]}
            />
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50 text-center">
        <div className="container mx-auto px-4">
          <Link
            href="/consultation"
            className="inline-flex bg-[#1A2BC2] text-white px-8 py-3 rounded-lg hover:bg-[#0D0D52]"
          >
            Request an SME quote
          </Link>
        </div>
      </section>
    </ProductPageShell>
  )
}
