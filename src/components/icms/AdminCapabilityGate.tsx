'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { IcmsCapability, IcmsRole } from '@/lib/icms/roles'
import { canAccessAdminPath } from '@/lib/icms/admin-nav'

export default function AdminCapabilityGate({
  tenantSlug,
  role,
  capabilities,
  children,
}: {
  tenantSlug: string
  role?: IcmsRole | 'platform_admin' | null
  capabilities?: IcmsCapability[]
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const allowed = canAccessAdminPath(pathname, tenantSlug, role || null, capabilities)

  if (allowed) return <>{children}</>

  return (
    <div className="mx-auto max-w-lg border border-black/10 bg-white p-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
        Access restricted
      </p>
      <h1 className="icms-display mt-3 text-2xl text-[color:var(--icms-forest)]">
        Module not granted
      </h1>
      <p className="mt-3 text-sm text-[color:var(--icms-warm-gray)]">
        Your role does not include this admin section. Ask a Hyperion super admin to grant the
        capability under Team → Visibility grants, or open a module you can access.
      </p>
      <Link
        href={`/icms/admin/${tenantSlug}`}
        className="icms-btn-primary mt-6 inline-block"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
