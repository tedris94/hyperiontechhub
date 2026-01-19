'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const categories = [
  { id: 'all', label: 'All Questions' },
  { id: 'general', label: 'General' },
  { id: 'services', label: 'Services' },
  { id: 'training', label: 'Training & Courses' },
  { id: 'billing', label: 'Billing' },
  { id: 'technical', label: 'Technical' },
  { id: 'account', label: 'Account' }
];

const faqs = [
  {
    category: 'general',
    question: 'What is Hyperion Tech Hub?',
    answer: 'Hyperion Tech Hub is a comprehensive technology solutions provider offering software development, training, cloud services, cybersecurity, and more. We bridge the gap between technology and people, making technology accessible and impactful for everyone.'
  },
  {
    category: 'general',
    question: 'What services do you offer?',
    answer: 'We offer a wide range of services including Software Development (AI & Native Coding), WordPress and Web Development, Cloud Services, Android Development, Corporate Training, Online Courses, Computer and Laptop Repairs, Graphic Design and Printing Services, and Cybersecurity solutions.'
  },
  {
    category: 'general',
    question: 'Where are you located?',
    answer: 'Our main office is located at Plot 624, No. 9 Clifford Omozeghian Ave., Gbazango Extension II, Arab Road, Arab Junction by Kubwa Express, Kubwa, FCT-Abuja, Nigeria. We also offer remote services and can work with clients globally.'
  },
  {
    category: 'services',
    question: 'How do I request a custom software development project?',
    answer: 'You can request a custom project by visiting our Consultancy page and filling out the consultation form, or by contacting us directly via email or phone. We\'ll schedule a meeting to discuss your requirements and provide a detailed proposal.'
  },
  {
    category: 'services',
    question: 'Do you offer maintenance and support after project completion?',
    answer: 'Yes! We provide ongoing maintenance and support packages for all our development projects. This includes bug fixes, updates, security patches, and feature enhancements based on your needs.'
  },
  {
    category: 'services',
    question: 'What is your typical project timeline?',
    answer: 'Project timelines vary depending on complexity and scope. A simple website might take 2-4 weeks, while complex software solutions can take 3-6 months or more. We provide detailed timelines during the consultation phase.'
  },
  {
    category: 'training',
    question: 'How do I enroll in a course?',
    answer: 'Visit our Courses page, browse available courses, and click "Enroll Now" on the course you\'re interested in. You\'ll need to create an account (or log in) and complete the payment process to gain access.'
  },
  {
    category: 'training',
    question: 'Are the courses self-paced or scheduled?',
    answer: 'We offer both options! Online courses are typically self-paced with lifetime access to materials. Corporate training programs are scheduled based on client requirements and can be conducted on-site or remotely.'
  },
  {
    category: 'training',
    question: 'Do I get a certificate after completing a course?',
    answer: 'Yes, you will receive a certificate of completion for all our courses upon successfully finishing the course requirements and assessments.'
  },
  {
    category: 'billing',
    question: 'What payment methods do you accept?',
    answer: 'We accept various payment methods including bank transfers, credit/debit cards, and online payment platforms. Payment terms are discussed during project consultation.'
  },
  {
    category: 'technical',
    question: 'What technologies do you work with?',
    answer: 'We work with a wide range of technologies including React, Node.js, Python, Java, AWS, Azure, WordPress, React Native, Flutter, and many more. Our team stays updated with the latest technologies and best practices.'
  },
  {
    category: 'account',
    question: 'How do I create an account?',
    answer: 'You can create an account by clicking the "Register" button in the header or visiting the registration page. You\'ll need to provide your email address and create a password.'
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-[#1A2BC2]/10 px-4 py-2 rounded-full mb-6">
              <HelpCircle className="w-4 h-4 text-[#1A2BC2]" />
              <span className="text-sm text-[#1A2BC2]">Frequently Asked Questions</span>
            </div>
            <h1 className="text-5xl md:text-6xl text-[#1B1C1E] mb-6">
              How Can We Help?
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Find answers to common questions about our services, training programs, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Categories */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1A2BC2] focus:ring-2 focus:ring-[#1A2BC2]/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-[#1A2BC2] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <h3 className="text-lg text-[#1B1C1E] font-semibold pr-4">
                      {faq.question}
                    </h3>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-[#1A2BC2] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No questions found. Try a different search term or category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex w-16 h-16 rounded-full bg-[#1A2BC2]/10 items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-[#1A2BC2]" />
            </div>
            <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link href="/#contact">
              <button className="inline-flex items-center bg-[#1A2BC2] hover:bg-[#0D0D52] text-white px-8 py-3 rounded-lg transition-colors duration-300 font-semibold">
                Contact Support
                <MessageCircle className="ml-2 w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}

