'use client';

import { useState } from 'react';
import { CheckCircle, ArrowRight, Users, Briefcase, GraduationCap, Code2 } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const steps = [
  {
    number: '01',
    title: 'Choose Your Service',
    description: 'Browse our comprehensive range of technology solutions and select what you need.',
    icon: Briefcase,
  },
  {
    number: '02',
    title: 'Get in Touch',
    description: 'Contact us through our form, email, or phone to discuss your requirements.',
    icon: Users,
  },
  {
    number: '03',
    title: 'Consultation',
    description: 'We\'ll schedule a consultation to understand your needs and provide a tailored solution.',
    icon: GraduationCap,
  },
  {
    number: '04',
    title: 'Get Started',
    description: 'Once we align on the solution, we\'ll begin working on your project or training.',
    icon: Code2,
  },
];

const services = [
  {
    title: 'Software Development',
    description: 'Custom software solutions for your business needs',
    link: '/services',
  },
  {
    title: 'Training Programs',
    description: 'Upskill your team with our comprehensive training',
    link: '/training',
  },
  {
    title: 'Consultancy Services',
    description: 'Expert guidance for your technology initiatives',
    link: '/consultancy',
  },
  {
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure and migration services',
    link: '/services',
  },
];

export default function GetStartedPage() {
  const [selectedService, setSelectedService] = useState('');

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#1B1C1E] mb-6">
                Get Started with <span className="text-[#1A2BC2]">Hyperion Tech Hub</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Your journey to digital transformation starts here. Let's work together to achieve your technology goals.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center px-8 py-4 bg-[#1A2BC2] hover:bg-[#0D0D52] text-white rounded-lg transition-colors font-semibold group"
              >
                Schedule a Consultation
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
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Simple steps to get started with our services
              </p>
            </div>
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => {
                  const Icon = step.icon;
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
                What Are You Looking For?
              </h2>
              <p className="text-xl text-gray-600">
                Select a service to get started
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service, index) => (
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
                    Why Choose Hyperion Tech Hub?
                  </h2>
                  <ul className="space-y-4">
                    {[
                      'Comprehensive technology solutions',
                      'Experienced and certified team',
                      'Customized solutions for your needs',
                      'Ongoing support and maintenance',
                      'Transparent pricing and communication',
                      'Proven track record of success',
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-6 h-6 text-[#1A2BC2] mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-lg text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-[#1A2BC2] to-[#0D0D52] rounded-2xl p-12 text-white">
                  <h3 className="text-3xl mb-6">Ready to Get Started?</h3>
                  <p className="text-lg mb-8 opacity-90">
                    Schedule a free consultation to discuss your project and discover how we can help.
                  </p>
                  <Link
                    href="/consultation"
                    className="inline-flex items-center px-6 py-3 bg-white text-[#1A2BC2] rounded-lg hover:bg-gray-100 transition-colors font-semibold group"
                  >
                    Schedule Consultation
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
                Let's Build Something Great Together
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Contact us today and take the first step towards achieving your technology goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#1A2BC2] rounded-lg hover:bg-gray-100 transition-colors font-semibold group"
                >
                  Contact Us
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/consultation"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold"
                >
                  Schedule Consultation
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

