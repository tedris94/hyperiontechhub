import Link from 'next/link'
import { ProductPageShell, FeatureList, formatNgn } from '@/components/ProductPageShell'
import pricing from '@/content/products-pricing.json'

export const metadata = {
  title: 'SME Digital Business Kit | Hyperion Tech Hub',
  description:
    'Three fixed SKUs for Nigerian SMEs: Presence, Commerce, and Ops — built on the Fizam pattern with Paystack.',
}

export default function SmeKitPage() {
  const kit = pricing.smeKit

  return (
    <ProductPageShell
      badge="Productized service · SMEs"
      title={kit.name}
      tagline="Fixed packages so sales are productized — not a bespoke quote for every brochure site."
      primaryCta={{ label: 'Request a quote', href: '/consultation' }}
      secondaryCta={{ label: 'See Fizam case study', href: '/portfolio/fizam-table-water' }}
    >
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <h2 className="text-3xl text-[#1B1C1E] mb-4">Three SKUs</h2>
          <p className="text-gray-600 mb-10 max-w-2xl">
            Built for bottled water & FMCG, retail, clinics, estates, and faith-based admin offices in
            Abuja / FCT. {kit.retainerNote}
          </p>
          <div className="grid lg:grid-cols-3 gap-8">
            {kit.skus.map((sku) => (
              <div
                key={sku.id}
                className="border border-gray-200 rounded-2xl p-8 bg-gray-50 flex flex-col"
              >
                <p className="text-sm font-semibold text-[#1A2BC2] uppercase tracking-wide mb-2">
                  {sku.name}
                </p>
                <p className="text-2xl font-semibold text-[#1B1C1E] mb-1">
                  {formatNgn(sku.priceNgn.min)} – {formatNgn(sku.priceNgn.max)}
                </p>
                <p className="text-sm text-gray-500 mb-6">Typical delivery: {sku.timelineWeeks} weeks</p>
                <FeatureList items={sku.includes} />
                {'reference' in sku && sku.reference && (
                  <p className="text-xs text-gray-500 mt-6">Reference: {sku.reference}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl text-[#1B1C1E] mb-4">Who buys this</h2>
            <FeatureList
              items={[
                'Bottled water & FMCG brands needing Paystack orders',
                'Retail and clinics needing a staff / jobs portal',
                'Estates and organisations needing Presence + contact ops',
                'Schools’ ancillary businesses (bookshop, canteen, transport)',
              ]}
            />
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-3">Next step</h3>
            <p className="text-gray-600 mb-6">
              Pick Presence, Commerce, or Ops on the consultation form. We send a fixed-scope quote
              within two business days.
            </p>
            <Link
              href="/industries/smes"
              className="text-[#1A2BC2] font-semibold hover:underline"
            >
              SME industry page →
            </Link>
          </div>
        </div>
      </section>
    </ProductPageShell>
  )
}
