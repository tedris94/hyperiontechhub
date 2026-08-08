'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { MODULE_NAV, roleCanAccessModule, type SchoolRole } from '@/lib/edusuite/nav'
import RequireAuth from '@/components/RequireAuth'
import { useAuth } from '@/contexts/AuthContext'

export default function EduSuiteShell({
  schoolSlug,
  schoolName,
  schoolRole,
  isAdmin,
  children,
}: {
  schoolSlug: string
  schoolName: string
  schoolRole?: SchoolRole | null
  isAdmin?: boolean
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [navOpen, setNavOpen] = useState(false)
  const base = `/edusuite/${schoolSlug}`

  const nav = MODULE_NAV.filter((item) => {
    if (isAdmin || !schoolRole) return true
    return roleCanAccessModule(schoolRole, item.id)
  })

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
      <div className="border-b border-white/10 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href="/edusuite" className="text-xs uppercase tracking-wide text-white/70">
              EduSuite
            </Link>
            <p className="mt-1 truncate font-semibold leading-snug">{schoolName}</p>
            <p className="mt-1 truncate text-xs text-white/60">{user?.email}</p>
            {(schoolRole || isAdmin) && (
              <p className="mt-1 text-xs capitalize text-[#7B8CFF]">
                {isAdmin ? 'Platform admin' : String(schoolRole).replace(/_/g, ' ')}
              </p>
            )}
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
      <nav className="flex-1 overflow-y-auto py-3 text-sm">
        {nav.map((item) => {
          const href = `${base}${item.href}`
          const active =
            item.href === ''
              ? pathname === base || pathname === `${base}/`
              : pathname.startsWith(href)
          return (
            <Link
              key={item.id}
              href={href}
              className={`block px-5 py-2 transition-colors ${
                active ? 'bg-[#1A2BC2] text-white' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="space-y-2 border-t border-white/10 p-4 text-xs">
        <Link href="/products/edusuite" className="block text-white/70 hover:text-white">
          Product page
        </Link>
        <Link href="/dashboard" className="block text-white/70 hover:text-white">
          Platform dashboard
        </Link>
      </div>
    </>
  )

  return (
    <RequireAuth message="Sign in to access Hyperion EduSuite.">
      <div className="relative flex min-h-screen bg-gray-50">
        {navOpen ? (
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setNavOpen(false)}
          />
        ) : null}

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col bg-[#0D0D52] text-white shadow-xl transition-transform duration-300 ease-out lg:static lg:z-auto lg:w-64 lg:shrink-0 lg:shadow-none ${
            navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {sidebar}
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="rounded p-1.5 text-[#0D0D52] hover:bg-gray-100 lg:hidden"
                aria-label="Open menu"
                aria-expanded={navOpen}
                onClick={() => setNavOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold text-[#1B1C1E] sm:text-lg">
                  Hyperion EduSuite
                </h1>
                <p className="truncate text-xs text-gray-500 sm:text-sm">
                  <span className="lg:hidden">{schoolName} · </span>
                  School OS · Nigeria
                </p>
              </div>
            </div>
            <Link
              href="/edusuite"
              className="shrink-0 text-sm font-medium text-[#1A2BC2] hover:underline"
            >
              Switch school
            </Link>
          </header>
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </RequireAuth>
  )
}
