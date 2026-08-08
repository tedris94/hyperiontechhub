import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { resolveIcmsAccess } from '@/lib/icms/access'
import {
  formatDisplayDate,
  formatNaira,
  getDashboardCounts,
  getPrayerTimesToday,
} from '@/lib/icms/content'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ tenant: string }> }

export default async function AdminDashboard({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)

  const user = await getCurrentUser()
  const access = user ? await resolveIcmsAccess(user, slug) : null
  const caps = access?.capabilities || []
  const isLocked = Boolean(access && !access.isAdmin && caps.length === 0)

  const base = `/icms/admin/${tenant.slug}`

  if (isLocked) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">Dashboard</h1>
          <p className="mt-1 text-sm capitalize text-[color:var(--icms-warm-gray)]">
            Role: {(access?.role || 'member').replace(/_/g, ' ')} · 0 capabilities
          </p>
        </div>
        <div className="border border-black/10 bg-white p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
            No modules granted
          </p>
          <h2 className="icms-display mt-3 text-2xl text-[color:var(--icms-forest)]">
            Waiting for access
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[color:var(--icms-warm-gray)]">
            This account has no admin modules on <strong>{tenant.shortName}</strong>. Membership is
            per centre — set the role on this centre&apos;s Team page, then grant capabilities under
            Visibility grants if needed.
          </p>
          <Link href={`/icms/${tenant.slug}`} className="icms-btn-secondary mt-6 inline-block">
            View public site
          </Link>
        </div>
      </div>
    )
  }

  const canContent = caps.includes('content') || access?.isAdmin
  const canFinance = caps.includes('finance') || access?.isAdmin
  const canPrayer = caps.includes('prayer') || caps.includes('settings') || access?.isAdmin

  const [counts, prayerTimesToday] = await Promise.all([
    getDashboardCounts(doc.id),
    getPrayerTimesToday(doc.id),
  ])

  const kpis = [
    canFinance
      ? { label: 'Donations (MTD)', value: formatNaira(counts.donationTotal) }
      : null,
    canContent ? { label: 'Active events', value: String(counts.eventCount) } : null,
    canContent ? { label: 'Published articles', value: String(counts.articleCount) } : null,
    canFinance ? { label: 'Transactions', value: String(counts.donations.length) } : null,
  ].filter(Boolean) as { label: string; value: string }[]

  const recentDonations = canFinance
    ? [...new Map(counts.donations.map((d) => [d.id, d])).values()].slice(0, 4)
    : []
  const upcomingEvents = canContent
    ? [
        ...new Map(counts.events.map((e) => [`${e.title}|${e.date}|${e.time}`, e])).values(),
      ].slice(0, 4)
    : []

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">Dashboard</h1>
          <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
            Welcome back —{' '}
            {new Date().toLocaleDateString('en-NG', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            {access?.role ? (
              <span className="capitalize">
                {' '}
                · {(access.role || '').replace(/_/g, ' ')}
              </span>
            ) : null}
          </p>
        </div>
        {canContent ? (
          <Link href={`${base}/articles`} className="icms-btn-primary">
            Publish article
          </Link>
        ) : null}
      </div>

      {kpis.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="border border-black/10 bg-white p-5">
              <p className="text-xs uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
                {kpi.label}
              </p>
              <p className="icms-display mt-2 text-2xl text-[color:var(--icms-emerald)]">
                {kpi.value}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-black/10 bg-white p-6 text-sm text-[color:var(--icms-warm-gray)]">
          No dashboard widgets for your current capabilities. Open a module from the sidebar.
        </div>
      )}

      {canPrayer ? (
        <div className="border border-black/10 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
            Today&apos;s prayer times
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-6">
            {prayerTimesToday.map((t) => (
              <div key={t.name} className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
                  {t.name}
                </p>
                <p className="mt-1 text-sm font-semibold text-[color:var(--icms-forest)]">{t.time}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {(canFinance || canContent) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {canFinance ? (
            <div className="border border-black/10 bg-white p-5">
              <h2 className="text-sm font-semibold text-[color:var(--icms-forest)]">
                Recent donations
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[20rem] text-left text-sm">
                  <tbody>
                    {recentDonations.map((d) => (
                      <tr key={d.id} className="border-t border-black/5">
                        <td className="py-2.5 pr-3">{d.donor}</td>
                        <td className="py-2.5 pr-3">{d.fund}</td>
                        <td className="py-2.5 text-right font-semibold">
                          {formatNaira(d.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
          {canContent ? (
            <div className="border border-black/10 bg-white p-5">
              <h2 className="text-sm font-semibold text-[color:var(--icms-forest)]">
                Upcoming events
              </h2>
              <ul className="mt-4 space-y-3">
                {upcomingEvents.map((e) => (
                  <li key={e.id} className="border-t border-black/5 pt-3 text-sm">
                    <p className="font-medium text-[color:var(--icms-charcoal)]">{e.title}</p>
                    <p className="text-xs text-[color:var(--icms-warm-gray)]">
                      {formatDisplayDate(e.date)} · {e.time}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
