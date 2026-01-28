import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { SiteContentProvider } from '@/contexts/SiteContentContext';
import { getSiteContent } from '@/lib/site-content';
import PageViewTracker from '@/components/PageViewTracker';

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await getSiteContent();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteContent.site.url || 'http://localhost:3000';

  return {
    metadataBase: new URL(siteUrl),
    title: siteContent.site.name,
    description: siteContent.site.description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: siteContent.site.name,
      title: siteContent.site.name,
      description: siteContent.site.description,
      images: [
        {
          url: siteContent.home.hero.image.src,
          width: 1200,
          height: 630,
          alt: siteContent.site.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteContent.site.name,
      description: siteContent.site.description,
      images: [siteContent.home.hero.image.src],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteContent = await getSiteContent();

  return (
    <html lang="en">
      <body>
        <SiteContentProvider initialContent={siteContent}>
          <AuthProvider>
            <PageViewTracker />
            {children}
          </AuthProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}

