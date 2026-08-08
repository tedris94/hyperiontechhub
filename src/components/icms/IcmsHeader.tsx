'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import type { TenantConfig } from '@/lib/icms/types'
import type { HeaderStyle } from '@/lib/icms/ui-variants'
import { useAuth } from '@/contexts/AuthContext'

const links = [
  { label: 'About', href: 'about' },
  { label: 'Mosque', href: 'mosque' },
  { label: 'Islamiyyah', href: 'islamiyyah' },
  { label: 'Events', href: 'events' },
  { label: 'Waqf', href: 'waqf' },
  { label: 'Shurah', href: 'committee' },
  { label: 'Articles', href: 'articles' },
  { label: 'Contact', href: 'contact' },
]

function hrefJoin(base: string, path: string) {
  if (!path) return base || '/'
  if (!base) return `/${path}`
  return `${base}/${path}`
}

export default function IcmsHeader({
  tenant,
  basePath = '',
  adminHref,
  headerStyle = 'classic',
}: {
  tenant: TenantConfig
  /** Public path prefix: `/icms/slug` or `` on vanity hosts */
  basePath?: string
  /** Always prefer www absolute for admin when on vanity hosts */
  adminHref?: string
  headerStyle?: HeaderStyle
}) {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, loading } = useAuth()
  const base = basePath ?? `/icms/${tenant.slug}`
  const adminPath = adminHref || `/icms/admin/${tenant.slug}`
  const loginHref = `/login?returnTo=${encodeURIComponent(adminPath)}&message=${encodeURIComponent(
    `Sign in to manage ${tenant.shortName}.`,
  )}`

  const height =
    headerStyle === 'slim' || headerStyle === 'minimal'
      ? 'h-14'
      : headerStyle === 'quiet'
        ? 'h-16'
        : 'h-[4.5rem]'

  const headerChrome =
    headerStyle === 'slim'
      ? 'border-b border-black/8 bg-white/95'
      : headerStyle === 'minimal'
        ? 'border-b border-black/5 bg-[color:var(--icms-ivory)]'
        : headerStyle === 'quiet'
          ? 'border-b border-transparent bg-[color:var(--icms-ivory)]/90'
          : 'border-b border-black/5 bg-[color:var(--icms-ivory)]/95 backdrop-blur-sm'

  const navClass =
    headerStyle === 'quiet'
      ? 'text-sm font-normal text-[color:var(--icms-warm-gray)] transition-colors hover:text-[color:var(--icms-forest)]'
      : headerStyle === 'slim' || headerStyle === 'minimal'
        ? 'text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--icms-charcoal)] transition-colors hover:text-[color:var(--icms-emerald)]'
        : 'text-sm font-medium text-[color:var(--icms-charcoal)] transition-colors hover:text-[color:var(--icms-emerald)]'

  const showSubtitle = headerStyle === 'classic' || headerStyle === 'quiet'

  return (
    <header className={`sticky top-0 z-50 ${headerChrome}`}>
      <div className={`icms-container flex ${height} items-center justify-between px-4 md:px-8`}>
        <Link href={base || '/'} className="flex items-center gap-3">
          <Image
            src={tenant.logo}
            alt={tenant.name}
            width={headerStyle === 'minimal' ? 36 : 48}
            height={headerStyle === 'minimal' ? 36 : 48}
            className={
              headerStyle === 'minimal'
                ? 'h-9 w-9 rounded-full bg-white object-contain p-0.5'
                : 'h-11 w-11 rounded-full bg-white object-contain p-0.5'
            }
            priority
          />
          <div className="leading-tight">
            <p
              className={`icms-display font-semibold tracking-wide text-[color:var(--icms-emerald)] ${
                headerStyle === 'minimal' ? 'text-sm' : 'text-sm md:text-base'
              }`}
            >
              {tenant.shortName}
            </p>
            {showSubtitle ? (
              <p className="hidden text-[10px] uppercase tracking-[0.18em] text-[color:var(--icms-gold)] sm:block">
                Islamic Center
              </p>
            ) : null}
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((item) => (
            <Link key={item.href} href={hrefJoin(base, item.href)} className={navClass}>
              {item.label}
            </Link>
          ))}
          {!loading &&
            (isAuthenticated ? (
              <Link
                href={adminPath}
                className="text-sm font-semibold text-[color:var(--icms-emerald)] hover:underline"
              >
                Admin
              </Link>
            ) : (
              <Link
                href={loginHref}
                className="text-sm font-semibold text-[color:var(--icms-emerald)] hover:underline"
              >
                Login
              </Link>
            ))}
          <Link
            href={hrefJoin(base, 'donate')}
            className={headerStyle === 'minimal' ? 'icms-btn-primary !px-3 !py-1.5 text-xs' : 'icms-btn-primary'}
          >
            Donate
          </Link>
        </nav>

        <button
          type="button"
          className="p-2 lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-[color:var(--icms-ivory)] px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {links.map((item) => (
              <Link
                key={item.href}
                href={hrefJoin(base, item.href)}
                className="py-1 text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {!loading &&
              (isAuthenticated ? (
                <Link href={adminPath} className="py-1 text-sm font-semibold" onClick={() => setOpen(false)}>
                  Admin
                </Link>
              ) : (
                <Link href={loginHref} className="py-1 text-sm font-semibold" onClick={() => setOpen(false)}>
                  Login
                </Link>
              ))}
            <Link
              href={hrefJoin(base, 'donate')}
              className="icms-btn-primary mt-2 w-full"
              onClick={() => setOpen(false)}
            >
              Donate
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
