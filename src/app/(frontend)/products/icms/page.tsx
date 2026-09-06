import Link from 'next/link'
import {
  ProductPageShell,
  FeatureList,
  PriceBand,
  formatNgn,
} from '@/components/ProductPageShell'
import IndustryCaseStudies from '@/components/IndustryCaseStudies'
import pricing from '@/content/products-pricing.json'

export const metadata = {
  title: 'Hyperion ICMS | Islamic Center Management System — Hyperion Tech Hub',
  description:
    'Multi-tenant Islamic Center Management System for mosques and Islamic centers — prayer times, Waqf, donations, Islamiyyah, and white-label sites.',
}

export default function IcmsProductPage() {
  const product = pricing.icms

  return (
    <ProductPageShell
      badge="Flagship product · Mosques & Islamic centers"
      title={product.name}
      tagline={product.tagline}
      primaryCta={{ label: 'Open ICMS', href: '/icms' }}
      secondaryCta={{ label: 'Anas bn Malik case study', href: '#case-studies' }}
    >
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h2 className="text-3xl text-[#1B1C1E] mb-4">What every center gets</h2>
          <p className="text-gray-600 mb-10 max-w-2xl">
            {product.audience} Same platform onboards the next Islamic center without rebuilding.
          </p>
          <div className="space-y-12">
            {product.moduleGroups.map((group) => (
              <div key={group.id}>
                <h3 className="text-xl font-semibold text-[#1A2BC2] mb-4">{group.title}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.modules.map((mod) => (
                    <div key={mod.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                      <h4 className="text-lg font-semibold text-[#1B1C1E] mb-2">{mod.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{mod.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h2 className="text-3xl text-[#1B1C1E] mb-8">Pricing</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <PriceBand label="Setup (one-time)" band={product.setupFeeNgn} />
            <PriceBand
              label="Monthly subscription"
              band={{
                ...product.subscription.perMonthNgn,
                note: product.subscription.note,
              }}
            />
          </div>
          <p className="text-gray-600 text-sm">
            Annual plans available from {formatNgn(product.subscription.annualNgn.min)} –{' '}
            {formatNgn(product.subscription.annualNgn.max)}. Exact quote depends on plan tier,
            custom domain, and donation volume.
          </p>
        </div>
      </section>

      <IndustryCaseStudies
        slugs={['anas-bn-malik-islamic-center']}
        title="Anas bn Malik case study"
        subtitle="Flagship ICMS tenant — live prayer times, Waqf, donations, and a brand-first public site."
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl text-[#1B1C1E] mb-4">Pilot path</h2>
            <p className="text-gray-600 mb-6">
              Recommended flagship pilot: <strong>{product.pilotCenter.recommended}</strong>.{' '}
              {product.pilotCenter.rationale}
            </p>
            <FeatureList
              items={[
                'Brand the public site and connect a custom domain',
                'Configure prayer location, Paystack, and donate funds',
                'Train secretary / finance roles on Waqf and inbox',
                'Attach Hyperion Care retainer at go-live',
              ]}
            />
          </div>
          <div className="bg-[#1A2BC2] text-white rounded-2xl p-10">
            <h3 className="text-2xl mb-4">For directors & secretaries</h3>
            <p className="opacity-90 mb-6">
              Stop juggling WhatsApp, static brochure sites, and cash books for donations. Run a
              center site the congregation can trust — with Waqf, Islamiyyah, and prayer times in one
              system.
            </p>
            <Link
              href="/industries/mosques"
              className="inline-flex items-center bg-white text-[#1A2BC2] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Mosques industry page
            </Link>
          </div>
        </div>
      </section>
    </ProductPageShell>
  )
}
