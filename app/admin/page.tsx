import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import RequireAuth from '@/components/RequireAuth';

export default function AdminHomePage() {
  return (
    <>
      <RequireAuth message="Please sign in to access admin tools.">
        <Header />
        <main className="min-h-screen pt-20 bg-gray-50">
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-3xl mx-auto text-center mb-10">
                <h1 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
                  Admin Tools
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage site content and generate CMS access tokens.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <Link
                  href="/admin/site-content"
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#1A2BC2] hover:shadow-lg transition-all"
                >
                  <h2 className="text-2xl text-[#1B1C1E] mb-2">Site Content</h2>
                  <p className="text-gray-600">
                    Edit headers, footers, homepage sections, and shared content.
                  </p>
                </Link>

                <Link
                  href="/admin/token"
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#1A2BC2] hover:shadow-lg transition-all"
                >
                  <h2 className="text-2xl text-[#1B1C1E] mb-2">Token Generator</h2>
                  <p className="text-gray-600">
                    Generate a secure token for <code>CMS_ADMIN_TOKEN</code>.
                  </p>
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <BackToTop />
      </RequireAuth>
    </>
  );
}
