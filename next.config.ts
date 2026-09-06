import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
]

const nextConfig: NextConfig = {
  // Pre-existing Payload ID/Where typing friction; do not block production deploys.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // Allow phone / LAN access to /_next/* in `next dev` (not just localhost).
  allowedDevOrigins: [
    '192.168.11.158',
    '127.0.0.1',
    ...(process.env.ALLOWED_DEV_ORIGINS?.split(',').map((s) => s.trim()).filter(Boolean) ?? []),
  ],
  serverExternalPackages: ['@payloadcms/db-postgres', 'payload', 'pg'],
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '80', pathname: '/testhub.com/**' },
      { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/api/media/**' },
      { protocol: 'http', hostname: '192.168.11.158', port: '3000', pathname: '/api/media/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: '**' },
    ],
    localPatterns: [
      { pathname: '/api/media/file/**' },
      { pathname: '/images/**' },
      { pathname: '/assets/**' },
      { pathname: '/tenants/**' },
      { pathname: '/icms/**' },
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
