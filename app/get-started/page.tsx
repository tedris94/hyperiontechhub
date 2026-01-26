'use client';

import { useState } from 'react';
import { CheckCircle, ArrowRight, Users, Briefcase, GraduationCap, Code2 } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { useSiteContent } from '@/contexts/SiteContentContext';

export default function GetStartedPage() {
  const [selectedService, setSelectedService] = useState('');
  const siteContent = useSiteContent();
  const { getStarted } = siteContent;
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Briefcase,
    Users,
    GraduationCap,
    Code2,
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#1B1C1E] mb-6">
                {getStarted.hero.title}{' '}
                <span className="text-[#1A2BC2]">{getStarted.hero.highlight}</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                {getStarted.hero.description}
              </p>
              <Link
                href={getStarted.hero.ctaHref}
                className="inline-flex items-center px-8 py-4 bg-[#1A2BC2] hover:bg-[#0D0D52] text-white rounded-lg transition-colors font-semibold group"
              >
                {getStarted.hero.ctaLabel}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-6">
                {getStarted.steps.heading}
              </h2>
              <p className="text-xl text-gray-600">
                {getStarted.steps.subheading}
              </p>
            </div>
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {getStarted.steps.items.map((step, index) => {
                  const Icon = iconMap[step.icon] || Briefcase;
                  return (
                    <div key={index} className="relative">
                      <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 h-full">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-[#1A2BC2]/10 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-[#1A2BC2]" />
                          </div>
                          <span className="text-3xl font-bold text-gray-200">{step.number}</span>
                        </div>
                        <h3 className="text-xl text-[#1B1C1E] font-semibold mb-3">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                          <ArrowRight className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Services Selection */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-6">
                {getStarted.services.heading}
              </h2>
              <p className="text-xl text-gray-600">
                {getStarted.services.subheading}
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {getStarted.services.items.map((service, index) => (
                  <Link
                    key={index}
                    href={service.link}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#1A2BC2] hover:shadow-lg transition-all duration-300 group"
                  >
                    <h3 className="text-xl text-[#1B1C1E] font-semibold mb-2 group-hover:text-[#1A2BC2] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center text-[#1A2BC2] font-medium">
                      <span>Learn more</span>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-6">
                    {getStarted.whyChoose.heading}
                  </h2>
                  <ul className="space-y-4">
                    {getStarted.whyChoose.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-6 h-6 text-[#1A2BC2] mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-lg text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-[#1A2BC2] to-[#0D0D52] rounded-2xl p-12 text-white">
                  <h3 className="text-3xl mb-6">{getStarted.whyChoose.ctaTitle}</h3>
                  <p className="text-lg mb-8 opacity-90">
                    {getStarted.whyChoose.ctaDescription}
                  </p>
                  <Link
                    href={getStarted.whyChoose.ctaHref}
                    className="inline-flex items-center px-6 py-3 bg-white text-[#1A2BC2] rounded-lg hover:bg-gray-100 transition-colors font-semibold group"
                  >
                    {getStarted.whyChoose.ctaLabel}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#1A2BC2] text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl mb-6">
                {getStarted.finalCta.heading}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {getStarted.finalCta.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={getStarted.finalCta.primaryHref}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#1A2BC2] rounded-lg hover:bg-gray-100 transition-colors font-semibold group"
                >
                  {getStarted.finalCta.primaryLabel}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={getStarted.finalCta.secondaryHref}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold"
                >
                  {getStarted.finalCta.secondaryLabel}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

