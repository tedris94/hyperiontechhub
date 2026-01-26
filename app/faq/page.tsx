import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import CmsPage from '@/components/CmsPage';

export default function FaqPage() {
  return (
    <>
      <Header />
      <CmsPage
        slug="faq"
        titleFallback="FAQ"
        descriptionFallback="Find answers to common questions about our services."
      />
      <Footer />
      <BackToTop />
    </>
  );
}
