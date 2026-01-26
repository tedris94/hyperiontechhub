import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import CmsPage from '@/components/CmsPage';

export default function AboutPage() {
  return (
    <>
      <Header />
      <CmsPage
        slug="about"
        titleFallback="About Hyperion Tech Hub"
        descriptionFallback="Learn about our mission, values, and commitment to technology excellence."
      />
      <Footer />
      <BackToTop />
    </>
  );
}
