import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { getPartners, type Partner } from '@/lib/partners'

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <article className="group h-full rounded-2xl border border-[#1A2BC2]/15 bg-white hover:border-[#1A2BC2]/40 hover:shadow-lg transition-all p-8 flex flex-col items-center text-center shadow-sm">
      <div
        className={`relative w-full h-24 mb-6 rounded-xl overflow-hidden border border-gray-100 ${
          partner.logoBg === 'dark' ? 'bg-[#111827]' : 'bg-gray-50'
        }`}
      >
        <Image
          src={partner.logo}
          alt={`${partner.name} logo`}
          fill
          className="object-contain p-4"
          sizes="(max-width: 640px) 100vw, 420px"
        />
      </div>
      <h3 className="text-lg font-semibold text-[#1B1C1E] mb-2 group-hover:text-[#1A2BC2]">
        {partner.name}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed flex-1">{partner.tagline}</p>
      {partner.url ? (
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#1A2BC2]">
          Visit website
          <ExternalLink className="w-3.5 h-3.5" />
        </span>
      ) : null}
    </article>
  )
}

export default function Partners({
  heading = 'Partners',
  subheading = 'Technology and delivery partners who help us ship reliable systems for Nigerian organisations.',
}: {
  heading?: string
  subheading?: string
}) {
  const partners = getPartners()

  return (
    <section
      className="py-20 bg-gradient-to-br from-[#EEF1FF] via-white to-[#F5F7FB] border-y border-[#1A2BC2]/10"
      id="partners"
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl text-[#1B1C1E] mb-3">{heading}</h2>
          <p className="text-gray-600 leading-relaxed">{subheading}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {partners.map((partner) =>
            partner.url ? (
              <a
                key={partner.slug}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <PartnerCard partner={partner} />
              </a>
            ) : (
              <div key={partner.slug} className="h-full">
                <PartnerCard partner={partner} />
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
