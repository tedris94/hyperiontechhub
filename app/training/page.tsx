import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, Users, Clock, Award, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const programs = [
  {
    title: 'Corporate IT Training',
    duration: '4 weeks',
    participants: '10-50',
    description: 'Comprehensive IT skills training tailored for corporate teams. Covers essential technologies and best practices.',
    topics: ['Cloud Computing', 'Cybersecurity Fundamentals', 'DevOps Practices', 'Agile Methodologies'],
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NjMyOTQwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Software Development Bootcamp',
    duration: '12 weeks',
    participants: '5-20',
    description: 'Intensive hands-on training in modern software development practices and frameworks.',
    topics: ['Full-Stack Development', 'Database Management', 'API Design', 'Testing & Deployment'],
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BtZW50fGVufDF8fHx8MTc2MzI5NDA3NXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Cybersecurity Certification Prep',
    duration: '8 weeks',
    participants: '5-15',
    description: 'Prepare your team for industry-recognized cybersecurity certifications with expert guidance.',
    topics: ['Network Security', 'Threat Detection', 'Incident Response', 'Security Compliance'],
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5fGVufDF8fHx8MTc2MzI5NDA3NXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Cloud Technologies Workshop',
    duration: '6 weeks',
    participants: '10-30',
    description: 'Master cloud platforms and modern deployment strategies for scalable applications.',
    topics: ['AWS/Azure/GCP', 'Containerization', 'Microservices', 'Cloud Architecture'],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZ3xlbnwxfHx8fDE3NjMyOTQwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

const benefits = [
  'Expert instructors with industry experience',
  'Hands-on practical exercises',
  'Customized curriculum for your needs',
  'Flexible scheduling options',
  'Certificate of completion',
  'Post-training support',
];

export default function TrainingPage() {
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
                <GraduationCap className="w-4 h-4 text-[#1A2BC2]" />
                <span className="text-sm text-[#1A2BC2]">Professional Development</span>
              </div>
              
              {/* Heading */}
              <h1 className="text-5xl lg:text-6xl text-[#1B1C1E] mb-6">
                Corporate <span className="text-[#1A2BC2]">Training Programs</span>
              </h1>
              
              {/* Description */}
              <p className="text-xl text-gray-600 mb-8">
                Empower your team with cutting-edge technology skills through our 
                comprehensive corporate training programs.
              </p>
              
              {/* CTA Button */}
              <Link href="/consultation">
                <button className="inline-flex items-center bg-[#1A2BC2] hover:bg-[#0D0D52] text-white px-8 py-3 rounded-lg transition-colors duration-300 group font-semibold">
                  Request a Consultation
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
            
            {/* Right Column - Hero Image */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NjMyOTQwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Corporate training"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">Our Training Programs</h2>
            <p className="text-xl text-gray-600">Choose from our specialized corporate training offerings</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg bg-white overflow-hidden group">
                {/* Thumbnail Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={program.thumbnail}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                
                <div className="p-8">
                  {/* Program Title */}
                  <h3 className="text-xl text-[#1B1C1E] mb-4 font-semibold">
                    {program.title}
                  </h3>
                  
                  {/* Meta Info - Duration & Participants */}
                  <div className="flex items-center space-x-6 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-[#1A2BC2]" />
                      {program.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-[#1A2BC2]" />
                      {program.participants} people
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {program.description}
                  </p>
                  
                  {/* Key Topics Pills */}
                  <div className="space-y-2 mb-6">
                    <div className="text-sm text-[#1B1C1E] font-medium">Key Topics:</div>
                    <div className="flex flex-wrap gap-2">
                      {program.topics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-3 py-1 bg-[#1A2BC2]/10 text-[#1A2BC2] rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <Link href="/consultation">
                    <button className="w-full bg-[#1A2BC2] hover:bg-[#0D0D52] text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center group/btn">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex w-16 h-16 rounded-full bg-[#1A2BC2]/10 items-center justify-center mb-6">
              <Award className="w-8 h-8 text-[#1A2BC2]" />
            </div>
            <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
              Why Choose Our Training?
            </h2>
            <p className="text-xl text-gray-600">
              We deliver comprehensive training solutions that drive results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-lg">
                <CheckCircle className="w-6 h-6 text-[#1A2BC2] flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{benefit}</p>
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
              Ready to Upskill Your Team?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Contact us today to discuss your training needs and customize a program for your organization.
            </p>
            <Link href="/consultation">
              <button className="inline-flex items-center bg-white text-[#1A2BC2] hover:bg-gray-100 px-8 py-3 rounded-lg transition-colors duration-300 group font-semibold">
                Request a Consultation
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

