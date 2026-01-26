import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { useSiteContent } from '@/contexts/SiteContentContext';

export default function Hero() {
  const siteContent = useSiteContent();
  const { hero } = siteContent.home;
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5 -z-10" />
      
      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-[#1A2BC2]/10 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-[#1A2BC2]" />
              <span className="text-sm text-[#1A2BC2]">{hero.badge}</span>
            </div>
            
            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-[#1B1C1E] leading-tight">
              <span className="block">{hero.titleLines[0]}</span>
              <span className="block text-[#1A2BC2]">{hero.titleLines[1]}</span>
            </h1>
            
            {/* Description */}
            <p className="text-xl text-gray-600 max-w-xl">
              {hero.description}
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={hero.primaryCta.href}
                className="inline-flex items-center justify-center bg-[#1A2BC2] hover:bg-[#0D0D52] text-white px-8 py-3 rounded-lg transition-colors duration-300 group"
              >
                {hero.primaryCta.label}
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className="inline-flex items-center justify-center border-[#1A2BC2] text-[#1A2BC2] hover:bg-[#1A2BC2] hover:text-white px-8 py-3 rounded-lg border-2 transition-colors duration-300"
              >
                {hero.secondaryCta.label}
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              {hero.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl text-[#1A2BC2] mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative lg:h-[600px] h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D52]/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

