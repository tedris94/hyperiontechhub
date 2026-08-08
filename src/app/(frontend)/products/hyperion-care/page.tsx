import Link from 'next/link'
import { ProductPageShell, FeatureList, formatNgn } from '@/components/ProductPageShell'
import pricing from '@/content/products-pricing.json'

export const metadata = {
  title: 'Hyperion Care | Managed IT Retainers — Hyperion Tech Hub',
  description:
    'Monthly managed IT and cybersecurity retainers for schools and SMEs — Starter, Growth, and Business tiers.',
}

export default function HyperionCarePage() {
  const care = pricing.hyperionCare

  return (
    <ProductPageShell
      badge="Retainers · Recurring revenue"
      title={care.name}
      tagline="Stay online, secure, and supported after go-live. Sold with every EduSuite and SME Kit delivery."
      primaryCta={{ label: 'Choose a tier', href: '/consultation' }}
    >
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <p className="text-gray-600 mb-10 max-w-2xl">{care.attachRule}</p>
          <div className="grid lg:grid-cols-3 gap-8">
            {care.tiers.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-2xl p-8 border ${
                  tier.id === 'growth'
                    ? 'border-[#1A2BC2] bg-[#1A2BC2]/5 shadow-lg'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <h3 className="text-xl font-semibold text-[#1B1C1E] mb-1">{tier.name}</h3>
                <p className="text-3xl font-semibold text-[#1A2BC2] mb-6">
                  {formatNgn(tier.priceMonthlyNgn)}
                  <span className="text-base font-normal text-gray-500"> / month</span>
                </p>
                <FeatureList items={tier.includes} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <h2 className="text-3xl text-[#1B1C1E] mb-4">Why retainers build trust</h2>
          <p className="text-gray-600 mb-8">
            Nigerian B2B trust comes from systems you still support — not one-off launches. Hyperion
            Care is how we stay in your school or business after day one.
          </p>
          <Link
            href="/get-started"
            className="inline-flex bg-[#1A2BC2] text-white px-8 py-3 rounded-lg hover:bg-[#0D0D52]"
          >
            Attach Care to a project
          </Link>
        </div>
      </section>
    </ProductPageShell>
  )
}
