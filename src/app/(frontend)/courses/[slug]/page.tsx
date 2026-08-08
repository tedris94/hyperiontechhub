import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import { CourseDetailClient } from '@/components/lms/CourseDetailClient'

type Props = { params: Promise<{ slug: string }> }

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params

  return (
    <main className="min-h-screen pt-20">
      <Header />
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <Suspense fallback={<div className="py-20 text-center">Loading…</div>}>
            <CourseDetailClient slug={slug} />
          </Suspense>
        </div>
      </section>
      <Footer />
      <BackToTop />
    </main>
  )
}
