import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import { CourseCatalog } from '@/components/lms/CourseCatalog'

export const metadata = {
  title: 'Courses | Hyperion Tech Hub',
  description: 'Browse online courses and training programs at Hyperion Tech Hub.',
}

export default function CoursesPage() {
  return (
    <main className="min-h-screen pt-20">
      <Header />
      <section className="py-16 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl text-[#1B1C1E] font-bold mb-4">Online Courses</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn in-demand tech skills with expert-led courses, hands-on projects, and
              certificates.
            </p>
          </div>
          <CourseCatalog />
        </div>
      </section>
      <Footer />
      <BackToTop />
    </main>
  )
}
