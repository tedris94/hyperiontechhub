import { notFound } from 'next/navigation'
import { getTenantBySlug } from '@/lib/icms/tenants'
import { formatDisplayDate, formatNaira, getDonations } from '@/lib/icms/content'

type Props = { params: Promise<{ tenant: string }> }

export default async function AdminDonationsPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const donations = await getDonations(doc.id)
  const total = donations.reduce((s, d) => s + d.amount, 0)
  const funds = new Set(donations.map((d) => d.fund)).size

  return (
    <div className="space-y-8">
      <div>
        <h1 className="icms-display text-3xl text-[color:var(--icms-forest)]">Donations</h1>
        <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
          Transaction overview for this tenant
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
            Total
          </p>
          <p className="icms-display mt-2 text-2xl text-[color:var(--icms-emerald)]">
            {formatNaira(total)}
          </p>
        </div>
        <div className="border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
            Transactions
          </p>
          <p className="icms-display mt-2 text-2xl text-[color:var(--icms-emerald)]">
            {donations.length}
          </p>
        </div>
        <div className="border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
            Funds
          </p>
          <p className="icms-display mt-2 text-2xl text-[color:var(--icms-emerald)]">{funds}</p>
        </div>
      </div>

      <div className="overflow-x-auto border border-black/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[color:var(--icms-ivory)] text-xs uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Donor</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Fund</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-mono text-xs">{d.reference || d.id}</td>
                <td className="px-4 py-3">{d.donor}</td>
                <td className="px-4 py-3 font-semibold">{formatNaira(d.amount)}</td>
                <td className="px-4 py-3">{d.fund}</td>
                <td className="px-4 py-3">{d.status}</td>
                <td className="px-4 py-3">{formatDisplayDate(d.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
