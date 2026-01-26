import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import CmsPage from '@/components/CmsPage';

export default function HelpCenterPage() {
  return (
    <>
      <Header />
      <CmsPage
        slug="help-center"
        titleFallback="Help Center"
        descriptionFallback="Find support resources and guides for our services."
      />
      <Footer />
      <BackToTop />
    </>
  );
}
