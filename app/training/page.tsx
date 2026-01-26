import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import CmsPage from '@/components/CmsPage';

export default function TrainingPage() {
  return (
    <>
      <Header />
      <CmsPage
        slug="training"
        titleFallback="Training Programs"
        descriptionFallback="Upskill your team with expert-led training programs."
      />
      <Footer />
      <BackToTop />
    </>
  );
}
