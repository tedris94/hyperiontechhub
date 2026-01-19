'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FolderOpen, ExternalLink, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

type ProjectCategory = 'all' | 'web' | 'mobile' | 'cloud' | 'ai' | 'design';

interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  tech: string[];
  image: string;
  category: ProjectCategory;
}

const allProjects: Project[] = [
  // Web Development
  {
    id: 'web-1',
    title: 'E-Commerce Platform',
    client: 'RetailCo',
    description: 'Full-featured online shopping platform with payment integration and inventory management',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    image: 'https://images.unsplash.com/photo-1658297063569-162817482fb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjB3ZWJzaXRlfGVufDF8fHx8MTc2NjA3NzI1NHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'web'
  },
  {
    id: 'web-2',
    title: 'Corporate Website Redesign',
    client: 'TechCorp Inc.',
    description: 'Modern responsive website with CMS integration and custom WordPress theme',
    tech: ['WordPress', 'PHP', 'MySQL', 'Custom Theme'],
    image: 'https://images.unsplash.com/photo-1621857093087-7daa85ab14a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjB3ZWJzaXRlfGVufDF8fHwxNzY2MTU5NDM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'web'
  },
  {
    id: 'web-3',
    title: 'Real Estate Portal',
    client: 'PropertyHub',
    description: 'Property listing and management platform with advanced search and filtering',
    tech: ['Vue.js', 'Laravel', 'PostgreSQL', 'Google Maps API'],
    image: 'https://images.unsplash.com/photo-1668911494509-14baf3b42fda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHwxNzY2MTU2MjA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'web'
  },
  // Mobile Apps
  {
    id: 'mobile-1',
    title: 'Fitness Tracking App',
    client: 'FitLife',
    description: 'iOS and Android app for workout and nutrition tracking with social features',
    tech: ['React Native', 'Firebase', 'HealthKit', 'Google Fit'],
    image: 'https://images.unsplash.com/photo-1758599881121-c31bde092252?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwbW9iaWxlJTIwcGhvbmV8ZW58MXx8fHwxNzY2MTU5NDQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'mobile'
  },
  {
    id: 'mobile-2',
    title: 'Food Delivery App',
    client: 'QuickEats',
    description: 'On-demand food ordering and delivery platform with real-time tracking',
    tech: ['Flutter', 'Node.js', 'MongoDB', 'Stripe'],
    image: 'https://images.unsplash.com/photo-1729860649884-40ec104f9dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjBzbWFydHBob25lfGVufDF8fHwxNzY2MTIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'mobile'
  },
  {
    id: 'mobile-3',
    title: 'Banking Mobile App',
    client: 'SecureBank',
    description: 'Secure mobile banking with biometric authentication and transaction management',
    tech: ['Native Android', 'Native iOS', 'REST API', 'OAuth'],
    image: 'https://images.unsplash.com/photo-1758611974022-ca3182694951?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBiYW5raW5nJTIwcGhvbmV8ZW58MXx8fHwxNzY2MTMwMjAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'mobile'
  },
  // Cloud Services
  {
    id: 'cloud-1',
    title: 'Cloud Infrastructure Migration',
    client: 'Enterprise Ltd.',
    description: 'Migrated legacy systems to AWS cloud infrastructure with zero downtime',
    tech: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    image: 'https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGluZnJhc3RydWN0dXJlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjYxNTk0NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'cloud'
  },
  {
    id: 'cloud-2',
    title: 'Serverless Application',
    client: 'StartupXYZ',
    description: 'Scalable serverless API and microservices architecture on AWS',
    tech: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'CloudFormation'],
    image: 'https://images.unsplash.com/photo-1668854096791-df5455fb60ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2ZXJsZXNzJTIwY29tcHV0aW5nfGVufDF8fHx8MTc2NjE1OTQ0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'cloud'
  },
  {
    id: 'cloud-3',
    title: 'Multi-Cloud Strategy',
    client: 'GlobalCorp',
    description: 'Hybrid cloud deployment across AWS and Azure with seamless integration',
    tech: ['AWS', 'Azure', 'Cloud Migration', 'DevOps'],
    image: 'https://images.unsplash.com/photo-1667372283496-893f0b1e7c16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGRhdGElMjBjZW50ZXJ8ZW58MXx8fHwxNzY2MTU5NDQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'cloud'
  },
  // AI/ML
  {
    id: 'ai-1',
    title: 'AI Chatbot Solution',
    client: 'CustomerFirst',
    description: 'Intelligent customer service chatbot with natural language processing',
    tech: ['Python', 'TensorFlow', 'NLP', 'AWS'],
    image: 'https://images.unsplash.com/photo-1757310998437-b2e8a7bd2e97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMGNoYXRib3QlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY2MTU5NDQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'ai'
  },
  {
    id: 'ai-2',
    title: 'Predictive Analytics Platform',
    client: 'DataInsights',
    description: 'Machine learning platform for business forecasting and data analysis',
    tech: ['Python', 'Scikit-learn', 'Pandas', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwY2hhcnRzfGVufDF8fHx8MTc2NjEyMzI2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'ai'
  },
  {
    id: 'ai-3',
    title: 'Computer Vision System',
    client: 'SecurityPro',
    description: 'Automated security monitoring using computer vision and AI',
    tech: ['Python', 'OpenCV', 'TensorFlow', 'Raspberry Pi'],
    image: 'https://images.unsplash.com/photo-1667372283496-893f0b1e7c16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGRhdGElMjBjZW50ZXJ8ZW58MXx8fHwxNzY2MTU5NDQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'ai'
  },
  // Design
  {
    id: 'design-1',
    title: 'Brand Identity Design',
    client: 'InnovateCo',
    description: 'Complete brand identity including logo, color palette, and brand guidelines',
    tech: ['Figma', 'Adobe Illustrator', 'Brand Strategy'],
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGRlc2lnbnxlbnwxfHx8fDE3NjYxNTk0NDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'design'
  },
  {
    id: 'design-2',
    title: 'UI/UX Design System',
    client: 'TechStart',
    description: 'Comprehensive design system with component library and style guide',
    tech: ['Figma', 'Design Tokens', 'Component Library'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1aSUyMGRlc2lnbnxlbnwxfHx8fDE3NjYxNTk0NDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'design'
  },
];

const categories: { value: ProjectCategory; label: string }[] = [
  { value: 'all', label: 'All Projects' },
  { value: 'web', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile Apps' },
  { value: 'cloud', label: 'Cloud Services' },
  { value: 'ai', label: 'AI/ML' },
  { value: 'design', label: 'Design' },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');

  const filteredProjects = activeCategory === 'all' 
    ? allProjects 
    : allProjects.filter(project => project.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-[#1A2BC2]/10 px-4 py-2 rounded-full mb-6">
              <FolderOpen className="w-4 h-4 text-[#1A2BC2]" />
              <span className="text-sm text-[#1A2BC2]">Our Work</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl text-[#1B1C1E] mb-6">
              Portfolio
            </h1>
            
            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed">
              Explore our successful projects across web development, mobile apps, 
              cloud infrastructure, and more. Each project represents our commitment 
              to excellence and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-12 bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="inline-flex h-12 items-center justify-start w-full bg-gray-100 p-1 rounded-lg overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                className={`px-6 py-2 rounded-md transition-all whitespace-nowrap ${
                  activeCategory === category.value
                    ? 'bg-[#1A2BC2] text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1 rounded-lg bg-white"
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D52]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="inline-flex items-center bg-white text-[#1A2BC2] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                      View Project
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Client Name */}
                  <p className="text-sm text-[#1A2BC2] mb-2">{project.client}</p>
                  
                  {/* Project Title */}
                  <h3 className="text-xl text-[#1B1C1E] mb-3 line-clamp-1">
                    {project.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '150+', label: 'Projects Completed' },
              { number: '100+', label: 'Happy Clients' },
              { number: '50+', label: 'Team Members' },
              { number: '15+', label: 'Years Experience' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl text-[#1A2BC2] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#1A2BC2] to-[#0D0D52]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl mb-6">
              Have a Project in Mind?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Let's discuss how we can bring your vision to life with innovative technology solutions.
            </p>
            <Link href="/#contact">
              <button className="inline-flex items-center bg-white text-[#1A2BC2] hover:bg-gray-100 px-8 py-3 rounded-lg transition-colors duration-300 group font-semibold">
                Start Your Project
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

