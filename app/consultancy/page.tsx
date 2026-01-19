import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, CheckCircle, Users, TrendingUp, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const services = [
  {
    title: 'Technology Strategy',
    description: 'Develop comprehensive technology roadmaps aligned with your business goals.',
    features: ['Strategic Planning', 'Technology Assessment', 'Digital Transformation', 'ROI Analysis'],
  },
  {
    title: 'Cloud Solutions',
    description: 'Migrate and optimize your infrastructure with expert cloud consulting.',
    features: ['Cloud Migration', 'Architecture Design', 'Cost Optimization', 'Security Implementation'],
  },
  {
    title: 'Cybersecurity Consulting',
    description: 'Protect your business with comprehensive security assessments and solutions.',
    features: ['Security Audits', 'Risk Assessment', 'Compliance Consulting', 'Incident Response'],
  },
  {
    title: 'Software Architecture',
    description: 'Design scalable and maintainable software systems for your business.',
    features: ['System Design', 'Code Review', 'Performance Optimization', 'Best Practices'],
  },
  {
    title: 'DevOps Transformation',
    description: 'Streamline your development and operations with modern DevOps practices.',
    features: ['CI/CD Implementation', 'Infrastructure as Code', 'Automation', 'Monitoring Setup'],
  },
  {
    title: 'AI & Data Strategy',
    description: 'Leverage artificial intelligence and data analytics for business insights.',
    features: ['AI Implementation', 'Data Analytics', 'Machine Learning', 'Business Intelligence'],
  },
];

const process = [
  {
    step: '1',
    title: 'Discovery',
    description: 'We learn about your business challenges and objectives.',
  },
  {
    step: '2',
    title: 'Analysis',
    description: 'Our experts conduct a thorough assessment of your current state.',
  },
  {
    step: '3',
    title: 'Strategy',
    description: 'We develop a customized roadmap and recommendations.',
  },
  {
    step: '4',
    title: 'Implementation',
    description: 'Execute the plan with ongoing support and guidance.',
  },
];

export default function ConsultancyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-[#1A2BC2]/10 px-4 py-2 rounded-full mb-6">
                <Briefcase className="w-4 h-4 text-[#1A2BC2]" />
                <span className="text-sm text-[#1A2BC2]">Expert Guidance</span>
              </div>
              
              {/* Heading */}
              <h1 className="text-5xl lg:text-6xl text-[#1B1C1E] mb-6">
                Technology <span className="text-[#1A2BC2]">Consultancy</span>
              </h1>
              
              {/* Description */}
              <p className="text-xl text-gray-600 mb-8">
                Transform your business with strategic technology consulting from industry experts.
              </p>
              
              {/* CTA Button */}
              <Link href="/consultation">
                <button className="inline-flex items-center bg-[#1A2BC2] hover:bg-[#0D0D52] text-white px-8 py-3 rounded-lg transition-colors duration-300 group font-semibold">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
            
            {/* Right Column - Hero Image */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbnN1bHRpbmd8ZW58MXx8fHwxNzYzMjk0MDc1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Business consulting"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">Our Consulting Services</h2>
            <p className="text-xl text-gray-600">Comprehensive technology solutions for your business</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-lg bg-white p-8">
                <h3 className="text-xl text-[#1B1C1E] mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 mr-2 text-[#1A2BC2] flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">Our Consulting Process</h2>
            <p className="text-xl text-gray-600">A proven approach to delivering results</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#1A2BC2] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-semibold">{item.step}</span>
                </div>
                <h3 className="text-xl text-[#1B1C1E] mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                icon: Users,
                number: '200+',
                label: 'Clients Served',
                description: 'Successful consulting engagements'
              },
              {
                icon: TrendingUp,
                number: '95%',
                label: 'Client Satisfaction',
                description: 'Consistently high satisfaction ratings'
              },
              {
                icon: Briefcase,
                number: '500+',
                label: 'Projects Completed',
                description: 'Delivered technology solutions'
              }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex w-16 h-16 rounded-full bg-[#1A2BC2]/10 items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-[#1A2BC2]" />
                  </div>
                  <div className="text-4xl md:text-5xl text-[#1A2BC2] mb-2 font-semibold">
                    {stat.number}
                  </div>
                  <h3 className="text-xl text-[#1B1C1E] mb-1">{stat.label}</h3>
                  <p className="text-gray-600 text-sm">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#1A2BC2] to-[#0D0D52]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Let's discuss how our consulting services can help you achieve your technology goals.
            </p>
            <Link href="/consultation">
              <button className="inline-flex items-center bg-white text-[#1A2BC2] hover:bg-gray-100 px-8 py-3 rounded-lg transition-colors duration-300 group font-semibold">
                Schedule a Consultation
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

