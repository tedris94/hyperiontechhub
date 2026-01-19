import Link from 'next/link';
import { 
  Code2, 
  Globe, 
  Cloud, 
  Smartphone, 
  GraduationCap, 
  BookOpen, 
  Wrench, 
  Palette, 
  Shield,
  CheckCircle,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const services = [
  {
    icon: Code2,
    title: 'Software Development',
    subtitle: 'AI & Native Coding',
    description: 'Custom software solutions powered by cutting-edge AI technology and native coding expertise.',
    features: [
      'AI-powered applications',
      'Native mobile & desktop apps',
      'Custom software solutions',
      'API development & integration',
      'Machine learning models',
      'Full-stack development'
    ],
    color: 'bg-blue-500',
    link: '/consultancy'
  },
  {
    icon: Globe,
    title: 'WordPress & Web Development',
    subtitle: 'Dynamic Web Solutions',
    description: 'Professional websites and web applications built with modern frameworks and WordPress.',
    features: [
      'Custom WordPress themes',
      'E-commerce solutions',
      'Responsive web design',
      'CMS development',
      'Website optimization',
      'Maintenance & support'
    ],
    color: 'bg-purple-500',
    link: '/portfolio'
  },
  {
    icon: Cloud,
    title: 'Cloud Services',
    subtitle: 'Scalable Infrastructure',
    description: 'Enterprise-grade cloud solutions for deployment, scaling, and infrastructure management.',
    features: [
      'Cloud migration',
      'AWS, Azure, Google Cloud',
      'DevOps implementation',
      'Container orchestration',
      'Serverless architecture',
      'Cloud security'
    ],
    color: 'bg-cyan-500',
    link: '/consultancy'
  },
  {
    icon: Smartphone,
    title: 'Android Development',
    subtitle: 'Mobile Excellence',
    description: 'Native Android applications with modern architecture and seamless user experiences.',
    features: [
      'Native Android apps',
      'Kotlin & Java development',
      'Material Design UI/UX',
      'App Store deployment',
      'Performance optimization',
      'Ongoing maintenance'
    ],
    color: 'bg-green-500',
    link: '/consultancy'
  },
  {
    icon: GraduationCap,
    title: 'Corporate Training',
    subtitle: 'Professional Development',
    description: 'Comprehensive training programs designed to upskill your team with latest technologies.',
    features: [
      'Custom training programs',
      'On-site & remote options',
      'Industry certifications',
      'Hands-on workshops',
      'Expert instructors',
      'Progress tracking'
    ],
    color: 'bg-orange-500',
    link: '/training'
  },
  {
    icon: BookOpen,
    title: 'Online Courses',
    subtitle: 'Learn at Your Pace',
    description: 'Self-paced online courses covering various technology domains and skill levels.',
    features: [
      'Video-based learning',
      'Interactive assignments',
      'Lifetime access',
      'Certificate of completion',
      'Expert instructors',
      'Community support'
    ],
    color: 'bg-pink-500',
    link: '/courses'
  },
  {
    icon: Wrench,
    title: 'Computer & Laptop Repairs',
    subtitle: 'Expert Hardware Services',
    description: 'Professional repair and maintenance services for all your computing devices.',
    features: [
      'Hardware diagnostics',
      'Component replacement',
      'Software troubleshooting',
      'Data recovery',
      'Preventive maintenance',
      'Warranty support'
    ],
    color: 'bg-red-500',
    link: '/contact'
  },
  {
    icon: Palette,
    title: 'Graphic Design & Printing',
    subtitle: 'Creative Solutions',
    description: 'Professional design services and high-quality printing for all your visual needs.',
    features: [
      'Brand identity design',
      'Print & digital graphics',
      'Marketing materials',
      'Professional printing',
      'Packaging design',
      'Design consultation'
    ],
    color: 'bg-indigo-500',
    link: '/contact'
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    subtitle: 'Protect Your Assets',
    description: 'Comprehensive security solutions to safeguard your digital infrastructure and data.',
    features: [
      'Security audits',
      'Threat detection',
      'Data encryption',
      'Network security',
      'Compliance consulting',
      '24/7 monitoring'
    ],
    color: 'bg-teal-500',
    link: '/consultancy'
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-[#1A2BC2]/10 px-4 py-2 rounded-full mb-6">
              <Briefcase className="w-4 h-4 text-[#1A2BC2]" />
              <span className="text-sm text-[#1A2BC2]">Comprehensive Solutions</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl text-[#1B1C1E] mb-6">
              Our Services
            </h1>
            
            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed">
              From software development to cloud services and training, we provide 
              end-to-end technology solutions tailored to your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white rounded-lg"
                >
                  <div className="p-8 flex-1 flex flex-col">
                    {/* Icon with Colored Background */}
                    <div className="inline-flex mb-4">
                      <div className={`w-14 h-14 rounded-xl ${service.color} text-white flex items-center justify-center`}>
                        <Icon className="w-7 h-7" />
                      </div>
                    </div>
                    
                    {/* Service Title */}
                    <h3 className="text-2xl text-[#1B1C1E] mb-2">
                      {service.title}
                    </h3>
                    
                    {/* Subtitle */}
                    <p className="text-sm text-gray-500 mb-4">
                      {service.subtitle}
                    </p>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-3 mb-6 flex-1">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-[#1A2BC2] mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* CTA Button */}
                    <Link href={service.link}>
                      <button className="w-full inline-flex items-center justify-center bg-[#1A2BC2] hover:bg-[#0D0D52] text-white px-6 py-3 rounded-lg transition-colors duration-300 group">
                        Learn More
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600">
              We deliver exceptional results through expertise, innovation, and dedication
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Expert Team',
                description: 'Experienced professionals with proven track records'
              },
              {
                title: 'Custom Solutions',
                description: 'Tailored to your specific business needs'
              },
              {
                title: '24/7 Support',
                description: 'Round-the-clock assistance when you need it'
              },
              {
                title: 'Proven Results',
                description: 'Track record of successful project deliveries'
              }
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl text-[#1B1C1E] mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#1A2BC2] to-[#0D0D52]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss how we can help transform your technology needs into solutions.
            </p>
            <Link href="/#contact">
              <button className="inline-flex items-center bg-white text-[#1A2BC2] hover:bg-gray-100 px-8 py-3 rounded-lg transition-colors duration-300 group font-semibold">
                Contact Us Today
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

