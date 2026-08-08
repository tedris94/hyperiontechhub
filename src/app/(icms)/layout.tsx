import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'
import { IcmsToastProvider } from '@/components/icms/toast'
import './icms-globals.css'

export const metadata: Metadata = {
  title: 'Hyperion ICMS',
  description: 'Islamic Center Management System — multi-tenant SaaS by Hyperion Tech Hub.',
}

export default function IcmsRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <IcmsToastProvider>{children}</IcmsToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
