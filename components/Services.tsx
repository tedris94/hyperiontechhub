'use client';

import Link from 'next/link';
import { Service } from '@/lib/wp-api';
import { 
  Code2, 
  Globe, 
  Cloud, 
  Smartphone, 
  GraduationCap, 
  BookOpen, 
  Wrench, 
  Palette, 
  Shield
} from 'lucide-react';
import { useSiteContent } from '@/contexts/SiteContentContext';

type ServiceIcon = React.ComponentType<{ className?: string }>;

interface ServiceDisplayItem {
  id: number;
  title: { rendered: string };
  acf?: {
    icon?: ServiceIcon;
    description?: string;
    color?: string;
  };
}

interface ServicesProps {
  services: Service[];
}

export default function Services({ services }: ServicesProps) {
  const siteContent = useSiteContent();
  const servicesContent = siteContent.home.services;

  const iconMap: Record<string, ServiceIcon> = {
    Code2,
    Globe,
    Cloud,
    Smartphone,
    GraduationCap,
    BookOpen,
    Wrench,
    Palette,
    Shield,
  };

  const fallbackServices: ServiceDisplayItem[] = servicesContent.fallbackItems.map((item, index) => ({
    id: index + 1,
    title: { rendered: item.title },
    acf: {
      icon: iconMap[item.icon] || Code2,
      description: item.description,
      color: item.color,
    },
  }));

  const displayServices: ServiceDisplayItem[] =
    services.length > 0
      ? services.map((service) => ({
          id: service.id,
          title: service.title,
          acf: {
            icon: iconMap[service.acf?.icon || ''] || Code2,
            description: service.acf?.description,
            color: service.acf?.color,
          },
        }))
      : fallbackServices;

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
            {servicesContent.heading}
          </h2>
          <p className="text-xl text-gray-600">
            {servicesContent.description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service) => {
            const Icon = service.acf?.icon || Code2;
            const colorClass = service.acf?.color || 'bg-blue-50 text-[#1A2BC2]';
            
            return (
              <div
                key={service.id}
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-lg"
              >
                <div className="p-8">
                  <div className={`w-14 h-14 rounded-xl ${colorClass} flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl text-[#1B1C1E] mb-3">
                    {service.title.rendered}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {service.acf?.description || 'Professional service solution'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href={servicesContent.cta.href}
            className="inline-flex items-center bg-[#1A2BC2] hover:bg-[#0D0D52] text-white px-8 py-3 rounded-lg transition-colors duration-300 group"
          >
            {servicesContent.cta.label}
            <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

