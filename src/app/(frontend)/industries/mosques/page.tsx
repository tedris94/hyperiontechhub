import Link from 'next/link'
import { ProductPageShell, FeatureList } from '@/components/ProductPageShell'
import IndustryCaseStudies from '@/components/IndustryCaseStudies'

export const metadata = {
  title: 'Mosques & Islamic Centers | Hyperion Tech Hub',
  description:
    'Digital systems for Nigerian mosques and Islamic centers — ICMS for prayer times, Waqf, donations, Islamiyyah, and white-label sites.',
}

export default function MosquesIndustryPage() {
  return (
    <ProductPageShell
      badge="Industry · Faith communities"
      title="Technology for mosques and Islamic centers"
      tagline="Prayer times, transparent giving, Waqf, Islamiyyah, and a brand-first public site — multi-tenant SaaS with Abuja on-ground support."
      primaryCta={{ label: 'Explore ICMS', href: '/products/icms' }}
      secondaryCta={{ label: 'Case studies', href: '#case-studies' }}
    >
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl text-[#1B1C1E] mb-4">What we solve</h2>
            <FeatureList
              items={[
                'Static brochure sites that never get updated',
                'Donation tracking stuck in WhatsApp and cash books',
                'No clear Waqf or Islamiyyah programme presence online',
                'One-off freelancers with no retainer support',
              ]}
            />
          </div>
          <div>
            <h2 className="text-3xl text-[#1B1C1E] mb-4">How we help</h2>
            <FeatureList
              items={[
                'Hyperion ICMS — white-label center OS (site, prayer, Waqf, donations, Islamiyyah)',
                'Custom domain and brand tokens per mosque or center',
                'Role-based admin for directors, imams, finance, and editors',
                'Hyperion Care retainers after go-live',
              ]}
            />
          </div>
        </div>
      </section>

      <IndustryCaseStudies
        slugs={['anas-bn-malik-islamic-center']}
        title="Anas bn Malik case study"
        subtitle="Our flagship ICMS tenant in Galadimawa — prayer times, Waqf, donations, and a brand-first public site."
      />

      <section className="py-16 bg-white text-center">
        <div className="container mx-auto px-4">
          <Link
            href="/consultation"
            className="inline-flex bg-[#1A2BC2] text-white px-8 py-3 rounded-lg hover:bg-[#0D0D52]"
          >
            Book an ICMS demo
          </Link>
        </div>
      </section>
    </ProductPageShell>
  )
}
