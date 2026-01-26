import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import CmsPage from '@/components/CmsPage';

export default function TeamPage() {
  return (
    <>
      <Header />
      <CmsPage
        slug="team"
        titleFallback="Our Team"
        descriptionFallback="Meet the people behind Hyperion Tech Hub."
      />
      <Footer />
      <BackToTop />
    </>
  );
}
