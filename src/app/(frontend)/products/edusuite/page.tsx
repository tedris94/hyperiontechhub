import Link from 'next/link'
import {
  ProductPageShell,
  FeatureList,
  PriceBand,
  formatNgn,
} from '@/components/ProductPageShell'
import pricing from '@/content/products-pricing.json'

export const metadata = {
  title: 'Hyperion EduSuite | School OS — Hyperion Tech Hub',
  description:
    'Complete school operating system for private, Islamic, and public schools across Nigeria — fees, results, attendance, parent portal, and more.',
}

export default function EduSuitePage() {
  const product = pricing.edusuite

  return (
    <ProductPageShell
      badge="Flagship product · Schools"
      title={product.name}
      tagline={product.tagline}
      primaryCta={{ label: 'Open EduSuite', href: '/edusuite' }}
      secondaryCta={{ label: 'See school case studies', href: '/portfolio' }}
    >
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h2 className="text-3xl text-[#1B1C1E] mb-4">Modules schools use every term</h2>
          <p className="text-gray-600 mb-10 max-w-2xl">
            {product.audience} Paystack fees, Nigerian term calendars, and role portals for owners,
            teachers, parents, and students.
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
              label="Per-term subscription"
              band={{
                ...product.subscription.perTermNgn,
                note: product.subscription.note,
              }}
            />
          </div>
          <p className="text-gray-600 text-sm">
            Annual plans available from {formatNgn(product.subscription.annualNgn.min)} –{' '}
            {formatNgn(product.subscription.annualNgn.max)}. Exact quote depends on student band and
            SMS volume.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl text-[#1B1C1E] mb-4">Pilot path</h2>
            <p className="text-gray-600 mb-6">
              Recommended flagship pilot: <strong>{product.pilotSchool.recommended}</strong>.{' '}
              {product.pilotSchool.rationale}
            </p>
            <FeatureList
              items={[
                'Migrate or twin existing results/fees workflows',
                'Train admin staff on parent portal and Paystack',
                'Publish case study with permission after one term',
                'Attach Hyperion Care retainer at go-live',
              ]}
            />
          </div>
          <div className="bg-[#1A2BC2] text-white rounded-2xl p-10">
            <h3 className="text-2xl mb-4">For school owners & principals</h3>
            <p className="opacity-90 mb-6">
              Stop chasing WhatsApp and Excel for fees and results. Run a system parents can trust —
              available nationwide, with Abuja on-ground support when you need it.
            </p>
            <Link
              href="/industries/schools"
              className="inline-flex items-center bg-white text-[#1A2BC2] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Schools industry page
            </Link>
          </div>
        </div>
      </section>
    </ProductPageShell>
  )
}
