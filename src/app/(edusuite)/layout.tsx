import type { Metadata } from 'next'
import '../(frontend)/globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { SiteContentProvider } from '@/contexts/SiteContentContext'
import { getSiteContent } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Hyperion EduSuite',
  description: 'Multi-tenant school operating system for Nigeria.',
}

export default async function EduSuiteRootLayout({ children }: { children: React.ReactNode }) {
  const siteContent = await getSiteContent()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50" suppressHydrationWarning>
        <SiteContentProvider initialContent={siteContent}>
          <AuthProvider>{children}</AuthProvider>
        </SiteContentProvider>
      </body>
    </html>
  )
}
