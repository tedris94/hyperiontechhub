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

interface ServicesProps {
  services: Service[];
}

export default function Services({ services }: ServicesProps) {
  // Default services with exact text and icons from Figma
  const defaultServices = [
    { 
      id: 1, 
      title: { rendered: 'AI & Native Coding' }, 
      acf: { 
        icon: Code2, 
        description: 'Advanced software development with AI-powered solutions and native application development.', 
        color: 'bg-blue-50 text-[#1A2BC2]' 
      } 
    },
    { 
      id: 2, 
      title: { rendered: 'WordPress & Web Development' }, 
      acf: { 
        icon: Globe, 
        description: 'Custom websites and WordPress solutions tailored to your business needs.', 
        color: 'bg-purple-50 text-purple-600' 
      } 
    },
    { 
      id: 3, 
      title: { rendered: 'Cloud Services' }, 
      acf: { 
        icon: Cloud, 
        description: 'Scalable cloud infrastructure and migration services for modern businesses.', 
        color: 'bg-cyan-50 text-cyan-600' 
      } 
    },
    { 
      id: 4, 
      title: { rendered: 'Android Development' }, 
      acf: { 
        icon: Smartphone, 
        description: 'Native Android applications that deliver seamless mobile experiences.', 
        color: 'bg-green-50 text-green-600' 
      } 
    },
    { 
      id: 5, 
      title: { rendered: 'Corporate Training' }, 
      acf: { 
        icon: GraduationCap, 
        description: 'Professional training programs to upskill your team in the latest technologies.', 
        color: 'bg-orange-50 text-orange-600' 
      } 
    },
    { 
      id: 6, 
      title: { rendered: 'Online Courses' }, 
      acf: { 
        icon: BookOpen, 
        description: 'Comprehensive online courses for continuous learning and skill development.', 
        color: 'bg-pink-50 text-pink-600' 
      } 
    },
    { 
      id: 7, 
      title: { rendered: 'Computer & Laptop Repairs' }, 
      acf: { 
        icon: Wrench, 
        description: 'Expert hardware repair and maintenance services for all your devices.', 
        color: 'bg-red-50 text-red-600' 
      } 
    },
    { 
      id: 8, 
      title: { rendered: 'Graphic Design & Printing' }, 
      acf: { 
        icon: Palette, 
        description: 'Creative design solutions and professional printing services.', 
        color: 'bg-yellow-50 text-yellow-700' 
      } 
    },
    { 
      id: 9, 
      title: { rendered: 'Cybersecurity' }, 
      acf: { 
        icon: Shield, 
        description: 'Comprehensive security solutions to protect your digital assets and data.', 
        color: 'bg-indigo-50 text-indigo-600' 
      } 
    },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600">
            Comprehensive technology solutions designed to meet all your digital needs
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
            href="#contact"
            className="inline-flex items-center bg-[#1A2BC2] hover:bg-[#0D0D52] text-white px-8 py-3 rounded-lg transition-colors duration-300 group"
          >
            Get In Touch
            <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

