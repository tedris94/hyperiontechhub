import Image from 'next/image'
import { getPortfolioCasesAsync } from '@/lib/portfolio'

/**
 * Cursor-style logo garden — named clients we still support.
 * Logos keep original brand colors (no grayscale).
 */
export default async function ClientLogoGarden({
  heading = 'Trusted every day by schools, mosques, and SMEs we still support',
}: {
  heading?: string
}) {
  const clients = (await getPortfolioCasesAsync()).map((c) => ({
    name: c.client,
    logo: c.logo,
    slug: c.slug,
    brandColors: c.brandColors,
  }))

  return (
    <section className="py-14 bg-gray-50 border-y border-gray-100" id="logo-garden">
      <div className="container mx-auto px-4 lg:px-8">
        <p className="text-center text-sm md:text-base text-gray-500 mb-10 max-w-2xl mx-auto">
          {heading}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-14">
          {clients.map((client) => (
            <div
              key={client.slug}
              className="flex flex-col items-center gap-2 opacity-90 hover:opacity-100 transition-opacity"
              title={client.name}
            >
              <div className="relative h-14 w-14 md:h-16 md:w-16">
                <Image
                  src={client.logo}
                  alt={client.name}
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
              <span className="text-[11px] md:text-xs font-medium text-gray-700 text-center max-w-[9rem] leading-snug">
                {client.name}
              </span>
              {client.brandColors.length > 0 && (
                <div className="flex gap-1 mt-0.5">
                  {client.brandColors.slice(0, 3).map((color) => (
                    <span
                      key={color}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                      aria-hidden
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
