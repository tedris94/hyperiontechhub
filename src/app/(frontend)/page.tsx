import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import ClientLogoGarden from '@/components/ClientLogoGarden'
import FeaturedCases from '@/components/FeaturedCases'
import Partners from '@/components/Partners'
import Purpose from '@/components/Purpose'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ClientLogoGarden />
      <Services />
      <FeaturedCases />
      <Partners />
      <Purpose />
      <Contact />
      <Footer />
      <BackToTop />
    </main>
  )
}
