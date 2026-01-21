import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Purpose from '@/components/Purpose';
import CTABanner from '@/components/CTABanner';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { getServices, type Service } from '@/lib/wp-api';

export default async function Home() {
  // Fetch services from WordPress API
  // If API fails, empty array will be passed and default services will show
  let services: Service[] = [];
  try {
    services = await getServices();
  } catch (error) {
    console.error('Error fetching services:', error);
    // Continue with empty array - Services component has fallback defaults
  }

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services services={services} />
      <Purpose />
      <Contact />
      <Footer />
      <BackToTop />
    </main>
  );
}

