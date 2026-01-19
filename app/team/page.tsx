import Link from 'next/link';
import Image from 'next/image';
import { Users, Linkedin, Twitter, Mail, Briefcase, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const leadership = [
  {
    name: 'Dr. Emmanuel Okafor',
    role: 'Chief Executive Officer',
    image: 'https://images.unsplash.com/photo-1616805765352-beedbad46b2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3MlMjBtYW58ZW58MXx8fHwxNzY2MTU5OTY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'With over 15 years of experience in technology leadership, Dr. Okafor drives our vision to empower businesses through innovative solutions. He holds a PhD in Computer Science and has led multiple successful digital transformation initiatives.',
    linkedin: '#',
    twitter: '#',
    email: 'ceo@hyperiontechhub.com'
  },
  {
    name: 'Aisha Mohammed',
    role: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1687422808384-c896d0efd4ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3MlMjB3b21hbnxlbnwxfHx8fDE3NjYxNTk5Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Aisha brings 12+ years of expertise in software architecture and cloud solutions. She has architected scalable systems for Fortune 500 companies and is passionate about emerging technologies and AI integration.',
    linkedin: '#',
    twitter: '#',
    email: 'cto@hyperiontechhub.com'
  },
  {
    name: 'David Chen',
    role: 'Chief Operating Officer',
    image: 'https://images.unsplash.com/photo-1543132220-7bc04a0e790a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGV4ZWN1dGl2ZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjA5MjAxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'David oversees our operations and ensures seamless project delivery. With an MBA and extensive experience in tech operations, he optimizes our processes to deliver exceptional value to our clients.',
    linkedin: '#',
    twitter: '#',
    email: 'coo@hyperiontechhub.com'
  },
];

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'Lead Software Engineer',
    image: 'https://images.unsplash.com/photo-1573496358773-bdcdbd984982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHRlY2h8ZW58MXx8fHwxNzY2MTUyNTI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Full-stack developer specializing in React, Node.js, and cloud architecture. Passionate about building scalable applications.',
    linkedin: '#',
    twitter: '#',
    email: 'sarah.j@hyperiontechhub.com'
  },
  {
    name: 'Michael Adeyemi',
    role: 'Senior DevOps Engineer',
    image: 'https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1hbnxlbnwxfHx8fDE3NjYwOTE0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'AWS certified professional with expertise in CI/CD, Kubernetes, and infrastructure automation. 8+ years of experience.',
    linkedin: '#',
    twitter: '#',
    email: 'michael.a@hyperiontechhub.com'
  },
  {
    name: 'Emily Rodriguez',
    role: 'UX/UI Design Lead',
    image: 'https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFufGVufDF8fHx8MTc2NjA1NjYxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Creative designer with a focus on user-centered design. Expert in Figma, Adobe Creative Suite, and design systems.',
    linkedin: '#',
    twitter: '#',
    email: 'emily.r@hyperiontechhub.com'
  },
  {
    name: 'James Okonkwo',
    role: 'Mobile App Developer',
    image: 'https://images.unsplash.com/photo-1752859951149-7d3fc700a7ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY2MDY1MTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Specialist in React Native and Flutter. Built 20+ mobile applications with millions of downloads across iOS and Android.',
    linkedin: '#',
    twitter: '#',
    email: 'james.o@hyperiontechhub.com'
  },
  {
    name: 'Lisa Wang',
    role: 'AI/ML Engineer',
    image: 'https://images.unsplash.com/photo-1573496359773-bdcdbd984982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjA3MTIwOHww&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'PhD in Machine Learning. Specializes in NLP, computer vision, and building intelligent systems with TensorFlow and PyTorch.',
    linkedin: '#',
    twitter: '#',
    email: 'lisa.w@hyperiontechhub.com'
  },
  {
    name: 'Ibrahim Yusuf',
    role: 'Senior Backend Developer',
    image: 'https://images.unsplash.com/photo-1616805765352-beedbad46b2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3MlMjBtYW58ZW58MXx8fHwxNzY2MTU5OTY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Expert in building robust APIs and microservices. Proficient in Python, Java, and database optimization techniques.',
    linkedin: '#',
    twitter: '#',
    email: 'ibrahim.y@hyperiontechhub.com'
  },
  {
    name: 'Rachel Kim',
    role: 'Project Manager',
    image: 'https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFufGVufDF8fHx8MTc2NjA1NjYxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'PMP certified with 10+ years managing complex tech projects. Ensures timely delivery and stakeholder satisfaction.',
    linkedin: '#',
    twitter: '#',
    email: 'rachel.k@hyperiontechhub.com'
  },
  {
    name: 'Daniel Okoro',
    role: 'Cloud Solutions Architect',
    image: 'https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1hbnxlbnwxfHx8fDE3NjYwOTE0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Multi-cloud certified architect. Designs and implements enterprise-grade cloud infrastructure on AWS, Azure, and GCP.',
    linkedin: '#',
    twitter: '#',
    email: 'daniel.o@hyperiontechhub.com'
  },
  {
    name: 'Sophia Martinez',
    role: 'QA Lead',
    image: 'https://images.unsplash.com/photo-1573496358773-bdcdbd984982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHRlY2h8ZW58MXx8fHwxNzY2MTUyNTI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Quality assurance expert with focus on test automation, performance testing, and ensuring software excellence.',
    linkedin: '#',
    twitter: '#',
    email: 'sophia.m@hyperiontechhub.com'
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-[#1A2BC2]/10 px-4 py-2 rounded-full mb-6">
              <Users className="w-4 h-4 text-[#1A2BC2]" />
              <span className="text-sm text-[#1A2BC2]">Meet Our Team</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl text-[#1B1C1E] mb-6">
              The People Behind Innovation
            </h1>
            
            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed">
              A diverse team of experts passionate about delivering 
              exceptional technology solutions and driving digital transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
              Our Leadership
            </h2>
            <p className="text-xl text-gray-600">
              Experienced leaders guiding our vision
            </p>
          </div>
          
          {/* Leadership Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-24">
            {leadership.map((leader, index) => (
              <div key={index} className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-lg bg-white">
                {/* Profile Image */}
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D52]/60 to-transparent" />
                </div>
                
                <div className="p-8">
                  {/* Name & Role */}
                  <h3 className="text-2xl text-[#1B1C1E] mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-[#1A2BC2] mb-4">
                    {leader.role}
                  </p>
                  
                  {/* Bio */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {leader.bio}
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex items-center space-x-3">
                    <a 
                      href={leader.linkedin}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1A2BC2] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a 
                      href={leader.twitter}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1A2BC2] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a 
                      href={`mailto:${leader.email}`}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1A2BC2] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                      aria-label="Email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
              Our Team
            </h2>
            <p className="text-xl text-gray-600">
              Talented professionals delivering excellence
            </p>
          </div>
          
          {/* Team Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 rounded-lg bg-white">
                {/* Profile Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D52]/40 to-transparent" />
                </div>
                
                <div className="p-6">
                  {/* Name & Role */}
                  <h3 className="text-xl text-[#1B1C1E] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#1A2BC2] text-sm mb-3">
                    {member.role}
                  </p>
                  
                  {/* Short Bio */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  
                  {/* Social Links (Smaller) */}
                  <div className="flex items-center space-x-2">
                    <a 
                      href={member.linkedin}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#1A2BC2] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a 
                      href={member.twitter}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#1A2BC2] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a 
                      href={`mailto:${member.email}`}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#1A2BC2] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                      aria-label="Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-24 bg-gradient-to-r from-[#1A2BC2] to-[#0D0D52]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center text-white max-w-4xl mx-auto">
            {/* Icon */}
            <div className="inline-flex w-20 h-20 rounded-full bg-white/10 items-center justify-center mb-6">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl mb-6">
              Join Our Growing Team
            </h2>
            <p className="text-xl mb-8 text-white/90">
              We're always looking for talented individuals who share our passion 
              for innovation and excellence. Explore career opportunities at Hyperion Tech Hub.
            </p>
            
            <Link href="/careers">
              <button className="inline-flex items-center bg-white text-[#1A2BC2] hover:bg-gray-100 px-8 py-3 rounded-lg transition-colors duration-300 group font-semibold">
                View Open Positions
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

