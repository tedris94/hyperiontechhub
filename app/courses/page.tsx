import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Clock, Users, Star, Play, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const courses = [
  {
    title: 'Web Development Fundamentals',
    instructor: 'John Smith',
    duration: '8 weeks',
    students: 1245,
    rating: 4.8,
    level: 'Beginner',
    description: 'Learn HTML, CSS, and JavaScript from scratch to build modern websites.',
    price: '$199',
    image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGluZ3xlbnwxfHx8fDE3NjYxMjU1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Python for Data Science',
    instructor: 'Sarah Johnson',
    duration: '10 weeks',
    students: 892,
    rating: 4.9,
    level: 'Intermediate',
    description: 'Master Python programming and data analysis with real-world projects.',
    price: '$249',
    image: 'https://images.unsplash.com/photo-1617240016072-d92174e44171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHByb2dyYW1taW5nfGVufDF8fHx8MTc2NjEyNzY3Nnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Mobile App Development with React Native',
    instructor: 'Mike Davis',
    duration: '12 weeks',
    students: 654,
    rating: 4.7,
    level: 'Intermediate',
    description: 'Build cross-platform mobile applications for iOS and Android.',
    price: '$299',
    image: 'https://images.unsplash.com/photo-1633250391894-397930e3f5f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NjYwODE2MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Cloud Computing with AWS',
    instructor: 'Emily Chen',
    duration: '6 weeks',
    students: 1089,
    rating: 4.8,
    level: 'Advanced',
    description: 'Learn to architect and deploy scalable cloud solutions on AWS.',
    price: '$279',
    image: 'https://images.unsplash.com/photo-1667984390553-7f439e6ae401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY2MDk2OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Cybersecurity Essentials',
    instructor: 'David Williams',
    duration: '8 weeks',
    students: 734,
    rating: 4.9,
    level: 'Beginner',
    description: 'Understand security fundamentals and protect against cyber threats.',
    price: '$229',
    image: 'https://images.unsplash.com/photo-1762340916350-ad5a3d620c16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwcHJvdGVjdGlvbnxlbnwxfHx8fDE3NjYxMzI4ODR8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'AI & Machine Learning',
    instructor: 'Dr. Lisa Martinez',
    duration: '14 weeks',
    students: 567,
    rating: 4.9,
    level: 'Advanced',
    description: 'Dive deep into artificial intelligence and machine learning algorithms.',
    price: '$349',
    image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjYwOTI2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Diploma in Computer Studies',
    instructor: 'Prof. James Anderson',
    duration: '24 weeks',
    students: 423,
    rating: 4.8,
    level: 'Beginner',
    description: 'Comprehensive program covering Computer Appreciation, Word Processing, Presentations, and Spreadsheet Analysis.',
    price: '$399',
    image: 'https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHN0dWRpZXMlMjBlZHVjYXRpb258ZW58MXx8fHwxNzY2MTc1MDUyfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Computer Engineering',
    instructor: 'Robert Thompson',
    duration: '16 weeks',
    students: 512,
    rating: 4.7,
    level: 'Intermediate',
    description: 'Master Operating System fundamentals, Windows installations, and expert-level Troubleshooting Skills.',
    price: '$329',
    image: 'https://images.unsplash.com/photo-1610576661719-0d537b24b50e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGVuZ2luZWVyaW5nJTIwaGFyZHdhcmV8ZW58MXx8fHwxNzY2MTc1MDUyfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Full Stack Development',
    instructor: 'Alex Rodriguez',
    duration: '16 weeks',
    students: 789,
    rating: 4.8,
    level: 'Intermediate',
    description: 'Complete web development course covering frontend, backend, and database technologies.',
    price: '$379',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdWxsJTIwc3RhY2slMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NjYxNzUwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
];

const levelColors: Record<string, string> = {
  'Beginner': 'bg-green-100 text-green-700',
  'Intermediate': 'bg-blue-100 text-blue-700',
  'Advanced': 'bg-purple-100 text-purple-700',
};

export default function CoursesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-[#1A2BC2]/10 px-4 py-2 rounded-full mb-6">
              <BookOpen className="w-4 h-4 text-[#1A2BC2]" />
              <span className="text-sm text-[#1A2BC2]">Learn at Your Own Pace</span>
            </div>
            
            {/* Heading */}
            <h1 className="text-5xl lg:text-6xl text-[#1B1C1E] mb-6">
              Online <span className="text-[#1A2BC2]">Courses</span>
            </h1>
            
            {/* Description */}
            <p className="text-xl text-gray-600 mb-8">
              Master new skills with our comprehensive online courses. 
              Learn from industry experts and advance your career.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col rounded-lg bg-white overflow-hidden"
              >
                {/* Course Image with Level Badge */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Level Badge - Top Right */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium ${levelColors[course.level] || 'bg-gray-100 text-gray-700'}`}>
                      {course.level}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  {/* Course Title */}
                  <h3 className="text-lg text-[#1B1C1E] mb-1">
                    {course.title}
                  </h3>
                  
                  {/* Instructor */}
                  <div className="text-sm text-gray-600 mb-4">
                    by {course.instructor}
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                    {course.description}
                  </p>
                  
                  {/* Meta Information */}
                  <div className="space-y-2 mb-4">
                    {/* Duration */}
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-[#1A2BC2]" />
                      {course.duration}
                    </div>
                    
                    {/* Students Enrolled */}
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-[#1A2BC2]" />
                      {course.students.toLocaleString()} students
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
                      {course.rating} rating
                    </div>
                  </div>

                  {/* Price & Enroll Section */}
                  <div className="mt-auto pt-4 border-t border-gray-200">
                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-semibold text-[#1A2BC2]">
                        {course.price}
                      </span>
                    </div>
                    
                    {/* Enroll Button */}
                    <Link href="/register">
                      <button className="w-full inline-flex items-center justify-center bg-[#1A2BC2] hover:bg-[#0D0D52] text-white px-6 py-3 rounded-lg transition-colors duration-300 group">
                        <Play className="w-4 h-4 mr-2" />
                        Enroll Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
              Why Choose Our Courses?
            </h2>
            <p className="text-xl text-gray-600">
              Experience world-class online learning designed for your success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: '🎓',
                title: 'Expert Instructors',
                description: 'Learn from industry professionals with years of real-world experience'
              },
              {
                icon: '📚',
                title: 'Comprehensive Content',
                description: 'In-depth courses covering all aspects of each technology'
              },
              {
                icon: '🏆',
                title: 'Certificates',
                description: 'Earn recognized certificates upon course completion'
              },
              {
                icon: '⏰',
                title: 'Self-Paced Learning',
                description: 'Study at your own pace with lifetime access to course materials'
              },
              {
                icon: '💬',
                title: 'Community Support',
                description: 'Join a community of learners and get help when you need it'
              },
              {
                icon: '🔄',
                title: 'Regular Updates',
                description: 'Courses are regularly updated with latest industry practices'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl text-[#1B1C1E] mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
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
              Ready to Start Learning?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of students already advancing their careers with our courses.
            </p>
            <Link href="/register">
              <button className="inline-flex items-center bg-white text-[#1A2BC2] hover:bg-gray-100 px-8 py-3 rounded-lg transition-colors duration-300 group font-semibold">
                Get Started Today
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

