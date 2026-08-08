'use client';

import Image from 'next/image';
import { Target, Lightbulb, Users, Award } from 'lucide-react';
import { useSiteContent } from '@/contexts/SiteContentContext';

export default function Purpose() {
  const siteContent = useSiteContent();
  const { purpose } = siteContent.home;
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Target,
    Lightbulb,
    Users,
    Award,
  };

  return (
    <section id="purpose" className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
            {purpose.heading}
          </h2>
          <p className="text-xl text-gray-600">
            {purpose.subheading}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Side: Image */}
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
            <Image
              src={purpose.image.src}
              alt={purpose.image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1A2BC2]/30 to-transparent" />
          </div>

          {/* Right Side: Text */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="space-y-4">
              {purpose.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-lg text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {purpose.values.map((value, index) => {
            const Icon = iconMap[value.icon] || Target;
            return (
              <div 
                key={index}
                className="text-center space-y-4 p-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="inline-flex w-16 h-16 rounded-full bg-[#1A2BC2]/10 items-center justify-center">
                  <Icon className="w-8 h-8 text-[#1A2BC2]" />
                </div>
                <h3 className="text-xl text-[#1B1C1E]">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Statement */}
        <div className="mt-16 text-center max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#1A2BC2] to-[#0D0D52] rounded-2xl p-12 text-white">
            <p className="text-2xl leading-relaxed">
              {purpose.statement}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

