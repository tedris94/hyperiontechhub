import Link from 'next/link'
import { ProductPageShell, FeatureList } from '@/components/ProductPageShell'

export const metadata = {
  title: 'Schools | Hyperion Tech Hub',
  description:
    'Digital systems for Nigerian private, Islamic, and public schools — EduSuite, results portals, fees, and training.',
}

export default function SchoolsIndustryPage() {
  return (
    <ProductPageShell
      badge="Industry · Education"
      title="Technology for Nigerian schools"
      tagline="Fees, results, attendance, and parent trust — for private, Islamic, and public schools anywhere in Nigeria, with strong Abuja on-ground support."
      primaryCta={{ label: 'Explore EduSuite', href: '/products/edusuite' }}
      secondaryCta={{ label: 'School case studies', href: '/portfolio' }}
    >
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl text-[#1B1C1E] mb-4">What we solve</h2>
            <FeatureList
              items={[
                'Term fees stuck in WhatsApp and cash books',
                'Results parents cannot access reliably',
                'No parent portal or attendance trail',
                'One-off freelancers with no retainer support',
              ]}
            />
          </div>
          <div>
            <h2 className="text-3xl text-[#1B1C1E] mb-4">How we help</h2>
            <FeatureList
              items={[
                'Hyperion EduSuite — full school OS (fees, results, attendance, campus ops, and more)',
                'Migration from existing WordPress / Educare stacks',
                'Staff training at our Kubwa hub, on-site, or remote across Nigeria',
                'Hyperion Care retainers after go-live',
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
            Book a school demo
          </Link>
        </div>
      </section>
    </ProductPageShell>
  )
}
