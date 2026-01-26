import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import CmsPage from '@/components/CmsPage';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <CmsPage
        slug="privacy"
        titleFallback="Privacy Policy"
        descriptionFallback="Read how we collect, use, and protect your information."
      />
      <Footer />
      <BackToTop />
    </>
  );
}
