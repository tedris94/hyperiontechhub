'use client';

import { useState } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, CheckCircle, Upload, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const jobOpenings = [
  {
    id: 1,
    title: 'Senior Full-Stack Developer',
    department: 'Engineering',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    salary: '$80,000 - $120,000',
    experience: '5+ years',
    description: 'We are looking for an experienced Full-Stack Developer to join our engineering team and help build innovative solutions for our clients.',
    responsibilities: [
      'Design and develop scalable web applications',
      'Collaborate with cross-functional teams',
      'Write clean, maintainable code',
      'Mentor junior developers',
      'Participate in code reviews and architecture decisions'
    ],
    requirements: [
      'Strong experience with React, Node.js, and TypeScript',
      'Knowledge of cloud platforms (AWS, Azure, or GCP)',
      'Experience with databases (SQL and NoSQL)',
      'Excellent problem-solving skills',
      'Strong communication abilities'
    ]
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'On-site',
    type: 'Full-time',
    salary: '$60,000 - $90,000',
    experience: '3+ years',
    description: 'Join our creative team to design intuitive and beautiful user experiences for web and mobile applications.',
    responsibilities: [
      'Create wireframes, prototypes, and high-fidelity designs',
      'Conduct user research and usability testing',
      'Collaborate with developers to implement designs',
      'Maintain design systems and style guides'
    ],
    requirements: [
      'Proficiency in Figma, Adobe XD, or Sketch',
      'Strong portfolio demonstrating UX/UI skills',
      'Understanding of user-centered design principles',
      'Experience with responsive design'
    ]
  },
  {
    id: 3,
    title: 'Cloud Solutions Architect',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$100,000 - $150,000',
    experience: '7+ years',
    description: 'Lead cloud infrastructure design and implementation for enterprise clients.',
    responsibilities: [
      'Design scalable cloud architectures',
      'Lead cloud migration projects',
      'Provide technical guidance to teams',
      'Optimize cloud costs and performance'
    ],
    requirements: [
      'AWS, Azure, or GCP certifications',
      'Experience with infrastructure as code',
      'Strong knowledge of DevOps practices',
      'Excellent architectural design skills'
    ]
  }
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Application submitted! We will contact you soon.');
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-[#1A2BC2]/10 px-4 py-2 rounded-full mb-6">
              <Briefcase className="w-4 h-4 text-[#1A2BC2]" />
              <span className="text-sm text-[#1A2BC2]">Join Our Team</span>
            </div>
            <h1 className="text-5xl md:text-6xl text-[#1B1C1E] mb-6">
              Build Your Career with Us
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join a team of passionate professionals working on cutting-edge technology solutions.
              We're always looking for talented individuals who share our vision.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">Why Join Hyperion Tech Hub?</h2>
            <p className="text-xl text-gray-600">We offer more than just a job</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: '💼', title: 'Career Growth', desc: 'Opportunities for professional development' },
              { icon: '⚖️', title: 'Work-Life Balance', desc: 'Flexible hours and remote options' },
              { icon: '🎓', title: 'Learning Culture', desc: 'Continuous learning and training' },
              { icon: '🤝', title: 'Great Team', desc: 'Collaborative and supportive environment' },
              { icon: '💰', title: 'Competitive Pay', desc: 'Attractive compensation packages' },
              { icon: '🏆', title: 'Impact', desc: 'Work on meaningful projects' }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl text-[#1B1C1E] mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">Open Positions</h2>
            <p className="text-xl text-gray-600">Explore current job opportunities</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {jobOpenings.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 cursor-pointer"
                onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl text-[#1B1C1E] mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-[#1A2BC2]" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-[#1A2BC2]" />
                        {job.type}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-[#1A2BC2]" />
                        {job.salary}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{job.description}</p>
                {selectedJob === job.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                    <div>
                      <h4 className="text-lg text-[#1B1C1E] mb-2">Responsibilities:</h4>
                      <ul className="space-y-2">
                        {job.responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex items-start text-gray-700">
                            <CheckCircle className="w-5 h-5 text-[#1A2BC2] mr-2 flex-shrink-0 mt-0.5" />
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg text-[#1B1C1E] mb-2">Requirements:</h4>
                      <ul className="space-y-2">
                        {job.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start text-gray-700">
                            <CheckCircle className="w-5 h-5 text-[#1A2BC2] mr-2 flex-shrink-0 mt-0.5" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Full Name"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1A2BC2]"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1A2BC2]"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1A2BC2]"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                      <textarea
                        placeholder="Cover Letter"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1A2BC2]"
                        value={formData.coverLetter}
                        onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                        required
                      />
                      <div className="flex items-center gap-4">
                        <label className="flex items-center cursor-pointer">
                          <Upload className="w-5 h-5 mr-2 text-[#1A2BC2]" />
                          <span className="text-sm text-gray-600">Upload Resume</span>
                          <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#1A2BC2] hover:bg-[#0D0D52] text-white px-6 py-3 rounded-lg transition-colors duration-300 font-semibold"
                      >
                        Submit Application
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#1A2BC2] to-[#0D0D52]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl mb-6">Don't See a Role That Fits?</h2>
            <p className="text-xl mb-8 text-white/90">
              We're always interested in hearing from talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <a href="mailto:careers@hyperiontechhub.com">
              <button className="inline-flex items-center bg-white text-[#1A2BC2] hover:bg-gray-100 px-8 py-3 rounded-lg transition-colors duration-300 group font-semibold">
                Send Your Resume
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}

