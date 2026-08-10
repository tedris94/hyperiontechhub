import Link from 'next/link'
import {
  ProductPageShell,
  FeatureList,
  formatNgn,
} from '@/components/ProductPageShell'
import pricing from '@/content/products-pricing.json'

export const metadata = {
  title: 'Training | Hyperion Tech Hub',
  description:
    'Corporate and career technology training at Hyperion Tech Hub, Abuja — hub cohorts, LMS courses, and on-site workshops.',
}

export default function TrainingPage() {
  const cohort = pricing.training.cohortExample

  return (
    <ProductPageShell
      badge="Skills · Abuja hub + LMS"
      title="Technology Training"
      tagline="Paid cohorts and corporate workshops — Web, React, WordPress, AI-for-business, and cybersecurity basics — delivered at our Kubwa hub and on the LMS."
      primaryCta={{ label: 'Browse online courses', href: '/courses' }}
      secondaryCta={{ label: 'Ask about a cohort', href: '/#contact' }}
    >
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h2 className="text-3xl text-[#1B1C1E] mb-4">How training works</h2>
          <p className="text-gray-600 mb-10 max-w-2xl">
            Choose a public cohort at the hub, enroll in self-paced LMS courses, or book a
            private corporate workshop for your team.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Hub cohorts',
                body: 'Small groups in Kubwa with live instruction, projects, and certificates.',
              },
              {
                title: 'LMS courses',
                body: 'Structured online learning you can start anytime — browse the course catalog.',
              },
              {
                title: 'Corporate workshops',
                body: 'Custom sessions for schools, mosques, and SMEs on the tools you already run.',
              },
            ].map((item) => (
              <div key={item.title} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-[#1B1C1E] mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h2 className="text-3xl text-[#1B1C1E] mb-4">Example cohort</h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            Sample public offering — dates and seats are confirmed when you enquire.
          </p>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10 grid lg:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl font-semibold text-[#1B1C1E] mb-4">{cohort.title}</h3>
              <dl className="space-y-3 text-gray-700 mb-8">
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <dt className="text-gray-500">Duration</dt>
                  <dd className="font-medium">{cohort.durationWeeks} weeks</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <dt className="text-gray-500">Delivery</dt>
                  <dd className="font-medium">{cohort.delivery}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <dt className="text-gray-500">Investment</dt>
                  <dd className="font-medium">{formatNgn(cohort.priceNgn)}</dd>
                </div>
              </dl>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center bg-[#1A2BC2] hover:bg-[#0D0D52] text-white px-6 py-3 rounded-lg transition-colors"
              >
                Enquire about this cohort
              </Link>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-[#1A2BC2] mb-4">
                Topics covered
              </h4>
              <FeatureList items={cohort.topics} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl text-center">
          <h2 className="text-3xl text-[#1B1C1E] mb-4">Prefer self-paced?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Explore our online course catalog for expert-led lessons, projects, and certificates.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center border-2 border-[#1A2BC2] text-[#1A2BC2] hover:bg-[#1A2BC2] hover:text-white px-8 py-3 rounded-lg transition-colors"
          >
            View courses
          </Link>
        </div>
      </section>
    </ProductPageShell>
  )
}
