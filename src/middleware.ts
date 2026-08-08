import { NextResponse, type NextRequest } from 'next/server'
import {
  isPlatformHost,
  normalizeHost,
  PLATFORM_APEX,
  PLATFORM_HOST,
} from '@/lib/icms/public-base'

const RESERVED_SUBDOMAINS = new Set([
  'www',
  'api',
  'admin',
  'app',
  'icms',
  'platform',
  'mail',
  'ftp',
  'cdn',
  'static',
])

/** First path segment that must never be treated as a tenant page on vanity hosts. */
const RESERVED_VANITY_PATHS = new Set([
  'platform',
  'admin',
  'login',
  'dashboard',
  'api',
  'courses',
  'edusuite',
  'portfolio',
  'careers',
  'products',
  'industries',
  'instructor',
  'client',
  'consultant',
  'subscriber',
  'student',
  'documents',
])

function platformOrigin(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (env) return env
  const proto = req.headers.get('x-forwarded-proto') || 'https'
  return `${proto}://${PLATFORM_HOST}`
}

function withVanityHeaders(req: NextRequest, slug: string): Headers {
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-icms-tenant', slug)
  requestHeaders.set('x-icms-vanity', '1')
  return requestHeaders
}

function rewriteToTenant(req: NextRequest, slug: string): NextResponse {
  const url = req.nextUrl.clone()
  const prefix = `/icms/${slug}`
  const requestHeaders = withVanityHeaders(req, slug)
  // Links generated in path-mode must not be rewritten again on vanity hosts
  if (url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }
  const path = url.pathname === '/' ? '' : url.pathname
  url.pathname = `${prefix}${path}`
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
}

function firstSegment(pathname: string): string {
  return pathname.split('/').filter(Boolean)[0] || ''
}

async function resolveCustomDomainSlug(req: NextRequest, host: string): Promise<string | null> {
  try {
    const origin = req.nextUrl.origin
    const res = await fetch(
      `${origin}/api/icms/resolve-host?host=${encodeURIComponent(host)}`,
      {
        headers: { 'x-icms-internal': '1' },
        next: { revalidate: 60 },
      },
    )
    if (!res.ok) return null
    const data = (await res.json()) as { slug?: string; status?: string }
    if (!data.slug) return null
    if (data.status === 'error' || data.status === 'none') return null
    return data.slug
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const host = normalizeHost(req.headers.get('x-forwarded-host') || req.headers.get('host'))
  const { pathname } = req.nextUrl

  // Skip static / internal
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/tenants/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Common mistake: /icms/[tenant]/platform → real platform console
  const tenantPlatform = pathname.match(/^\/icms\/([^/]+)\/platform\/?$/)
  if (tenantPlatform) {
    const dest = new URL('/icms/platform' + req.nextUrl.search, req.nextUrl.origin)
    return NextResponse.redirect(dest)
  }

  // Vanity hosts must not serve platform/admin under rewritten paths
  if (!isPlatformHost(host)) {
    if (pathname.startsWith('/icms/admin') || pathname.startsWith('/icms/platform')) {
      const dest = new URL(pathname + req.nextUrl.search, platformOrigin(req))
      return NextResponse.redirect(dest)
    }
    const seg = firstSegment(pathname)
    if (seg && RESERVED_VANITY_PATHS.has(seg)) {
      const dest = new URL(pathname + req.nextUrl.search, platformOrigin(req))
      return NextResponse.redirect(dest)
    }
  }

  // Localhost subdomain: {slug}.localhost
  const localhostSub = host.match(/^([a-z0-9-]+)\.localhost$/)
  if (localhostSub) {
    const label = localhostSub[1]
    if (!RESERVED_SUBDOMAINS.has(label)) {
      return rewriteToTenant(req, label)
    }
  }

  // Production subdomain: {slug}.hyperiontechhub.com
  if (host.endsWith(`.${PLATFORM_APEX}`) && host !== PLATFORM_HOST) {
    const label = host.slice(0, -(PLATFORM_APEX.length + 1))
    if (label && !label.includes('.') && !RESERVED_SUBDOMAINS.has(label)) {
      return rewriteToTenant(req, label)
    }
  }

  // Platform hosts: path-based ICMS unchanged
  if (isPlatformHost(host)) {
    return NextResponse.next()
  }

  // Custom domain
  const slug = await resolveCustomDomainSlug(req, host)
  if (slug) {
    return rewriteToTenant(req, slug)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
