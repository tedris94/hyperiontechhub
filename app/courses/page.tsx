import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import CmsPage from '@/components/CmsPage';

export default function CoursesPage() {
  return (
    <>
      <Header />
      <CmsPage
        slug="courses"
        titleFallback="Online Courses"
        descriptionFallback="Learn at your own pace with our online courses."
      />
      <Footer />
      <BackToTop />
    </>
  );
}
