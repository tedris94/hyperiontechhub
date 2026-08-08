'use client'

import { useAuth } from '@/contexts/AuthContext'

/** Persistent banner while a Super Admin / Admin is viewing the app as another user. */
export default function ImpersonationBanner() {
  const { impersonating, impersonator, user, stopImpersonating } = useAuth()

  if (!impersonating || !impersonator || !user) return null

  return (
    <div className="sticky top-0 z-[100] border-b border-amber-700/30 bg-amber-500 text-[#1a1200]">
      <div className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-sm lg:px-8">
        <p>
          <span className="font-semibold">Impersonating</span>{' '}
          <span className="font-semibold">{user.fullName || user.email}</span>
          <span className="opacity-80"> ({user.email})</span>
          <span className="opacity-80">
            {' '}
            — signed in as {impersonator.fullName || impersonator.email}
          </span>
        </p>
        <button
          type="button"
          onClick={() => void stopImpersonating()}
          className="rounded border border-[#1a1200]/30 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider hover:bg-white"
        >
          Stop impersonating
        </button>
      </div>
    </div>
  )
}
