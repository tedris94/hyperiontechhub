import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import CmsPage from '@/components/CmsPage';

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <CmsPage
        slug="portfolio"
        titleFallback="Portfolio"
        descriptionFallback="Explore our recent projects and success stories."
      />
      <Footer />
      <BackToTop />
    </>
  );
}
