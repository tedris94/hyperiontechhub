import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import CmsPage from '@/components/CmsPage';

export default function ServicesPage() {
  return (
    <>
      <Header />
      <CmsPage
        slug="services"
        titleFallback="Our Services"
        descriptionFallback="Explore our full range of technology services and solutions."
      />
      <Footer />
      <BackToTop />
    </>
  );
}
