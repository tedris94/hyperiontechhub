import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import CmsPage from '@/components/CmsPage';

export default function ConsultancyPage() {
  return (
    <>
      <Header />
      <CmsPage
        slug="consultancy"
        titleFallback="Consultancy"
        descriptionFallback="Talk to our experts and plan the right technology strategy."
      />
      <Footer />
      <BackToTop />
    </>
  );
}
