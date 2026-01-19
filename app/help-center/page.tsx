'use client';

import { useState } from 'react';
import { Search, BookOpen, MessageCircle, Video, FileText, HelpCircle, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const helpCategories = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    description: 'New to Hyperion Tech Hub? Start here to learn the basics.',
    link: '/help-center/getting-started',
    color: 'bg-blue-500',
  },
  {
    icon: MessageCircle,
    title: 'Account & Billing',
    description: 'Manage your account, subscriptions, and billing information.',
    link: '/help-center/account-billing',
    color: 'bg-purple-500',
  },
  {
    icon: Video,
    title: 'Training & Courses',
    description: 'Learn about our training programs and online courses.',
    link: '/help-center/training-courses',
    color: 'bg-green-500',
  },
  {
    icon: FileText,
    title: 'Services & Support',
    description: 'Get help with our services and technical support.',
    link: '/help-center/services-support',
    color: 'bg-orange-500',
  },
];

const popularArticles = [
  {
    title: 'How do I create an account?',
    category: 'Account',
    link: '/help-center/articles/create-account',
  },
  {
    title: 'How do I enroll in a course?',
    category: 'Training',
    link: '/help-center/articles/enroll-course',
  },
  {
    title: 'What payment methods do you accept?',
    category: 'Billing',
    link: '/help-center/articles/payment-methods',
  },
  {
    title: 'How do I request a custom project?',
    category: 'Services',
    link: '/help-center/articles/request-project',
  },
  {
    title: 'Do you offer maintenance and support?',
    category: 'Services',
    link: '/help-center/articles/maintenance-support',
  },
  {
    title: 'How do I contact support?',
    category: 'Support',
    link: '/help-center/articles/contact-support',
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#1B1C1E] mb-6">
                How can we help you?
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Find answers to common questions or get in touch with our support team.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for help articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2BC2] focus:border-[#1A2BC2] text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-6">
                Browse by Category
              </h2>
              <p className="text-xl text-gray-600">
                Find help organized by topic
              </p>
            </div>
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {helpCategories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={index}
                      href={category.link}
                      className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <div className={`w-14 h-14 rounded-xl ${category.color} text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl text-[#1B1C1E] mb-3 font-semibold">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center text-[#1A2BC2] group-hover:translate-x-1 transition-transform">
                        <span className="text-sm font-medium">Learn more</span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-6">
                Popular Articles
              </h2>
              <p className="text-xl text-gray-600">
                Most frequently asked questions
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg divide-y divide-gray-200">
                {popularArticles.map((article, index) => (
                  <Link
                    key={index}
                    href={article.link}
                    className="block p-6 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-xs font-medium text-[#1A2BC2] bg-[#1A2BC2]/10 px-3 py-1 rounded-full">
                            {article.category}
                          </span>
                        </div>
                        <h3 className="text-lg text-[#1B1C1E] group-hover:text-[#1A2BC2] transition-colors">
                          {article.title}
                        </h3>
                      </div>
                      <ArrowRight className="ml-4 w-5 h-5 text-gray-400 group-hover:text-[#1A2BC2] group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-[#1A2BC2] to-[#0D0D52] rounded-2xl p-12 text-white">
                <div className="max-w-4xl mx-auto text-center mb-12">
                  <h2 className="text-4xl md:text-5xl mb-6">
                    Still need help?
                  </h2>
                  <p className="text-xl opacity-90 mb-8">
                    Our support team is here to assist you. Get in touch with us through any of these channels.
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                    <a
                      href="mailto:info@hyperiontechhub.com"
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      info@hyperiontechhub.com
                    </a>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                    <a
                      href="tel:+2349064951938"
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      (+234) 906 4951 938
                    </a>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                    <p className="text-white/80 text-sm">
                      Plot 624, No. 9 Clifford Omozeghian Ave., Gbazango Extension II, Kubwa, FCT-Abuja
                    </p>
                  </div>
                </div>
                <div className="text-center mt-12">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center px-8 py-4 bg-white text-[#1A2BC2] rounded-lg hover:bg-gray-100 transition-colors font-semibold group"
                  >
                    Contact Support
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-6">
                Quick Links
              </h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/faq"
                  className="flex items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all group"
                >
                  <HelpCircle className="w-8 h-8 text-[#1A2BC2] mr-4" />
                  <div className="flex-1">
                    <h3 className="text-lg text-[#1B1C1E] font-semibold mb-1 group-hover:text-[#1A2BC2] transition-colors">
                      Frequently Asked Questions
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Browse our FAQ section for quick answers
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#1A2BC2] group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/services"
                  className="flex items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all group"
                >
                  <FileText className="w-8 h-8 text-[#1A2BC2] mr-4" />
                  <div className="flex-1">
                    <h3 className="text-lg text-[#1B1C1E] font-semibold mb-1 group-hover:text-[#1A2BC2] transition-colors">
                      Our Services
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Learn more about what we offer
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#1A2BC2] group-hover:translate-x-1 transition-all" />
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

