'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import type { TenantConfig } from '@/lib/icms/types'
import type { IcmsCapability, IcmsRole } from '@/lib/icms/roles'
import { getIcmsRoleMeta } from '@/lib/icms/roles'
import { cn } from '@/lib/icms/utils'
import RequireAuth from '@/components/RequireAuth'
import ImpersonationBanner from '@/components/ImpersonationBanner'
import { useAuth } from '@/contexts/AuthContext'
import type { AdminNavItem } from '@/lib/icms/admin-nav'

export default function AdminShell({
  tenant,
  role,
  isAdmin,
  capabilities = [],
  navItems,
  children,
}: {
  tenant: TenantConfig
  role?: IcmsRole | 'platform_admin' | null
  isAdmin?: boolean
  capabilities?: IcmsCapability[]
  /** Server-computed visible nav — do not recompute on client. */
  navItems: AdminNavItem[]
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [navOpen, setNavOpen] = useState(false)
  const base = `/icms/admin/${tenant.slug}`
  const publicBase = `/icms/${tenant.slug}`
  const effectiveRole = isAdmin ? 'platform_admin' : role || null
  const isSuperAdmin = user?.role === 'super_admin'
  const roleLabel =
    effectiveRole === 'platform_admin'
      ? 'Platform admin'
      : effectiveRole
        ? getIcmsRoleMeta(effectiveRole).label
        : 'Member'
  const capCount = capabilities.length

  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!navOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [navOpen])

  const sidebar = (
    <>
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src={tenant.logo}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-full bg-white object-contain p-0.5"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{tenant.shortName}</p>
              <p className="text-[10px] uppercase tracking-wider text-[color:var(--icms-gold)]">
                {roleLabel}
              </p>
              <p className="mt-0.5 text-[10px] text-white/40">
                {capCount === 0 ? 'No modules granted' : `${capCount} module cap${capCount === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded p-1.5 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
            onClick={() => setNavOpen(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const href = item.href ? `${base}/${item.href}` : base
          const active =
            item.href === ''
              ? pathname === base
              : pathname.startsWith(`${base}/${item.href}`)
          return (
            <Link
              key={item.label}
              href={href}
              className={cn(
                'block px-3 py-2.5 text-sm transition-colors',
                active
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white',
              )}
            >
              {item.label}
            </Link>
          )
        })}
        {isSuperAdmin ? (
          <>
            <div className="my-3 border-t border-white/10" />
            <Link
              href="/dashboard"
              className="block px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              Hyperion dashboard
            </Link>
            <Link
              href="/icms/platform"
              className="block px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              ICMS platform
            </Link>
            <Link
              href="/dashboard/audit"
              className="block px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              Audit trail
            </Link>
          </>
        ) : null}
      </nav>

      <div className="border-t border-white/10 px-5 py-4 text-xs text-white/50">
        <p>Hyperion ICMS</p>
        <p className="mt-1 truncate text-white/40">{user?.email}</p>
        <Link
          href={publicBase}
          className="mt-2 inline-block text-[color:var(--icms-gold)] hover:underline"
        >
          View public site →
        </Link>
        <Link
          href={`${publicBase}/committee`}
          className="mt-1 inline-block text-[color:var(--icms-gold)] hover:underline"
        >
          Public Shurah page →
        </Link>
        <button
          type="button"
          onClick={() => logout(base)}
          className="mt-3 block w-full text-left text-white/70 transition-colors hover:text-white"
        >
          Log out
        </button>
      </div>
    </>
  )

  return (
    <RequireAuth message="Sign in to access Hyperion ICMS tenant admin.">
      <div className="flex min-h-screen flex-col bg-[color:var(--icms-ivory)]">
        <ImpersonationBanner />
        <div className="relative flex min-h-0 flex-1">
          {navOpen ? (
            <button
              type="button"
              aria-label="Close menu overlay"
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setNavOpen(false)}
            />
          ) : null}

          <aside
            className={cn(
              'fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col bg-[color:var(--icms-forest)] text-white shadow-xl transition-transform duration-300 ease-out lg:static lg:z-auto lg:w-64 lg:shrink-0 lg:shadow-none',
              navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            )}
          >
            {sidebar}
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-black/5 bg-white px-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  className="rounded p-1.5 text-[color:var(--icms-forest)] hover:bg-black/5 lg:hidden"
                  aria-label="Open menu"
                  aria-expanded={navOpen}
                  onClick={() => setNavOpen(true)}
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[color:var(--icms-forest)] lg:hidden">
                    {tenant.shortName}
                  </p>
                  <p className="truncate text-xs text-[color:var(--icms-warm-gray)] sm:text-sm">
                    {roleLabel}
                    {capCount === 0 && !isAdmin ? ' · locked' : ''}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                {isSuperAdmin ? (
                  <Link
                    href="/dashboard"
                    className="hidden text-sm font-medium text-[color:var(--icms-emerald)] hover:underline sm:inline"
                  >
                    Hyperion
                  </Link>
                ) : null}
                <div className="flex h-8 w-8 items-center justify-center bg-[color:var(--icms-emerald)] text-xs font-semibold text-white">
                  {(user?.email || 'IC').slice(0, 2).toUpperCase()}
                </div>
                <button
                  type="button"
                  onClick={() => logout(base)}
                  className="text-sm font-medium text-[color:var(--icms-forest)] hover:text-[color:var(--icms-emerald)]"
                >
                  Log out
                </button>
              </div>
            </header>
            <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">{children}</div>
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}
