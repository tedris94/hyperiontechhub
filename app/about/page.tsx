import { Target, Users, Lightbulb, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

export const metadata = {
  title: 'About Us | Hyperion Tech Hub',
  description: 'Learn about Hyperion Tech Hub - Our mission, vision, values, and commitment to bridging the gap between technology and people.',
};

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To bridge the gap between technology and the people who use it, making cutting-edge solutions accessible and impactful for everyone.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We stay at the forefront of technology, continuously learning and adapting to bring the latest solutions to our clients.',
  },
  {
    icon: Users,
    title: 'People First',
    description: 'Technology serves people. We prioritize understanding our clients\' needs and creating solutions that truly make a difference.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We are committed to delivering the highest quality work, maintaining professional standards, and exceeding expectations.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#1B1C1E] mb-6">
                About Hyperion Tech Hub
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                A one-stop destination for tech solutions, education, and innovation. 
                Empowering businesses and individuals through cutting-edge technology.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-6">
                    Our Story
                  </h2>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p className="text-lg">
                      At Hyperion Tech Hub, our purpose is to bridge the gap between technology 
                      and the people who use it. We believe that technology should be accessible, 
                      understandable, and empowering for everyone—from small businesses to large 
                      enterprises, from students to professionals.
                    </p>
                    <p>
                      Founded with a vision to make cutting-edge technology solutions available to 
                      all, we have grown into a comprehensive technology partner offering software 
                      development, training, cloud services, cybersecurity, and more.
                    </p>
                    <p>
                      Our team of experienced professionals combines technical expertise with a 
                      deep understanding of business needs, ensuring that every solution we deliver 
                      not only meets but exceeds expectations.
                    </p>
                  </div>
                </div>
                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/assets/img/purpose.jpg"
                    alt="Our Team at Work"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1A2BC2]/30 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Purpose Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-6">
                Our Purpose
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Hyperion Tech Hub exists to be a catalyst for change, transforming how businesses 
                and individuals interact with technology.
              </p>
            </div>
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-[#1A2BC2] to-[#0D0D52] rounded-2xl p-12 text-white">
                <p className="text-2xl leading-relaxed text-center">
                  We exist to be a <span className="font-semibold">catalyst for change</span>, 
                  transforming how businesses and individuals interact with technology. Through 
                  innovative solutions, comprehensive training, and unwavering support, we empower 
                  our clients to achieve their goals and realize their full potential in the 
                  digital age.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-6">
                Our Core Values
              </h2>
              <p className="text-xl text-gray-600">
                The principles that guide everything we do
              </p>
            </div>
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div
                      key={index}
                      className="text-center space-y-4 p-6 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="inline-flex w-16 h-16 rounded-full bg-[#1A2BC2]/10 items-center justify-center">
                        <Icon className="w-8 h-8 text-[#1A2BC2]" />
                      </div>
                      <h3 className="text-xl text-[#1B1C1E] font-semibold">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-6">
                    Why Choose Us?
                  </h2>
                  <ul className="space-y-4">
                    {[
                      'Comprehensive technology solutions under one roof',
                      'Experienced team with proven track record',
                      'Customized solutions tailored to your needs',
                      'Ongoing support and maintenance',
                      'Affordable pricing with transparent costs',
                      'Commitment to excellence and quality',
                    ].map((item, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-[#1A2BC2] mr-3 mt-2 flex-shrink-0" />
                        <span className="text-lg leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl text-[#1B1C1E] mb-4 font-semibold">
                    Get in Touch
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Ready to transform your technology experience? Let's start a conversation 
                    about how we can help you achieve your goals.
                  </p>
                  <Link
                    href="/#contact"
                    className="inline-flex items-center px-6 py-3 bg-[#1A2BC2] hover:bg-[#0D0D52] text-white rounded-lg transition-colors group"
                  >
                    Contact Us
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Explore our services and discover how we can help transform your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#1A2BC2] rounded-lg hover:bg-gray-100 transition-colors font-semibold group"
                >
                  View Our Services
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold"
                >
                  Get in Touch
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

