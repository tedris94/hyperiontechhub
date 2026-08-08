import Link from 'next/link'
import { listTenants } from '@/lib/icms/tenants'

export default async function IcmsIndexPage() {
  const tenants = await listTenants()

  return (
    <div className="icms-root min-h-screen px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
          Hyperion ICMS
        </p>
        <h1 className="icms-display mt-3 text-4xl text-[color:var(--icms-forest)]">
          Tenant showcase
        </h1>
        <p className="mt-3 text-[color:var(--icms-warm-gray)]">
          Select a tenant portal for the presentation demo.
        </p>
        <p className="mt-2">
          <Link href="/icms/platform" className="text-sm font-semibold text-[color:var(--icms-emerald)]">
            Platform Super Admin →
          </Link>
        </p>
        <ul className="mt-10 space-y-3">
          {tenants.map((t) => (
            <li key={t.slug} className="border border-[color:var(--icms-gold)]/30 bg-white p-5">
              <p className="icms-display text-xl text-[color:var(--icms-forest)]">{t.name}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-[color:var(--icms-gold)]">
                {t.motto}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={`/icms/${t.slug}`} className="icms-btn-primary">
                  Public site
                </Link>
                <Link href={`/icms/admin/${t.slug}`} className="icms-btn-secondary">
                  Admin portal
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
