'use client'

import Link from 'next/link'
import type { TenantConfig } from '@/lib/icms/types'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminAccessDenied({
  tenant,
  reason,
  signedInEmail,
}: {
  tenant: TenantConfig
  reason: 'unauthenticated' | 'no_membership'
  signedInEmail?: string | null
}) {
  const { logout } = useAuth()
  const returnTo = `/icms/admin/${tenant.slug}`
  const loginHref = `/login?returnTo=${encodeURIComponent(returnTo)}&message=${encodeURIComponent(
    reason === 'unauthenticated'
      ? `Sign in to manage ${tenant.shortName}.`
      : `Sign in with an account that has membership for ${tenant.shortName}.`,
  )}`

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--icms-ivory)] px-6">
      <div className="max-w-lg border border-[color:var(--icms-gold)]/30 bg-white p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
          {tenant.shortName}
        </p>
        <h1 className="icms-display mt-3 text-3xl text-[color:var(--icms-forest)]">
          {reason === 'unauthenticated' ? 'Sign in required' : 'Access not granted'}
        </h1>
        {reason === 'no_membership' && signedInEmail && (
          <p className="mt-3 text-sm font-medium text-[color:var(--icms-charcoal)]">
            Signed in as <span className="text-[color:var(--icms-emerald)]">{signedInEmail}</span>
          </p>
        )}
        <p className="mt-3 text-sm leading-relaxed text-[color:var(--icms-warm-gray)]">
          {reason === 'unauthenticated'
            ? `You need a Hyperion account with membership for ${tenant.name} to open the tenant admin.`
            : `This account does not have an active membership for ${tenant.name}. Creating a Hyperion login is not enough — a centre Owner/Director (or super admin) must add them under Admin → Team for this centre (${tenant.slug}). Then sign out and try again.`}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {reason === 'unauthenticated' ? (
            <Link href={loginHref} className="icms-btn-primary">
              Sign in
            </Link>
          ) : (
            <button type="button" onClick={() => logout(returnTo)} className="icms-btn-primary">
              Log out &amp; switch account
            </button>
          )}
          <Link href={`/icms/${tenant.slug}`} className="icms-btn-secondary">
            View public site
          </Link>
        </div>
        {reason === 'no_membership' && (
          <p className="mt-4">
            <Link href="/icms" className="text-sm text-[color:var(--icms-emerald)] hover:underline">
              Back to ICMS hub
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
