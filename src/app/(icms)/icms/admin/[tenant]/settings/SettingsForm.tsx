'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useIcmsToast } from '@/components/icms/toast'

type Initial = {
  name: string
  motto: string
  address: string
  phone1: string
  phone2: string
  email: string
  domainLabel: string
  bankName: string
  accountName: string
  accountNumber: string
  transferNote: string
  paystackPublicKey: string
  hasPaystackSecret: boolean
  latitude: string
  longitude: string
  timezone: string
  locationLabel: string
  calculationMethod: string
  madhab: string
}

export default function SettingsForm({
  tenantId,
  tenantSlug,
  initial,
}: {
  tenantId: string
  tenantSlug: string
  initial: Initial
}) {
  const toast = useIcmsToast()
  const [form, setForm] = useState(initial)
  const [paystackSecret, setPaystackSecret] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setOk(false)
    try {
      const phones = [form.phone1, form.phone2].filter(Boolean).map((number) => ({ number }))
      const paystack: { publicKey: string; secretKey?: string } = {
        publicKey: form.paystackPublicKey.trim(),
      }
      if (paystackSecret.trim()) {
        paystack.secretKey = paystackSecret.trim()
      }

      const res = await fetch('/api/icms/records', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'icms-tenants',
          id: isNaN(Number(tenantId)) ? tenantId : Number(tenantId),
          tenantSlug,
          data: {
            name: form.name,
            motto: form.motto,
            address: form.address,
            email: form.email,
            phones,
            bank: {
              bankName: form.bankName,
              accountName: form.accountName,
              accountNumber: form.accountNumber,
              transferNote: form.transferNote,
            },
            prayer: {
              latitude: Number(form.latitude),
              longitude: Number(form.longitude),
              timezone: form.timezone,
              locationLabel: form.locationLabel,
              calculationMethod: form.calculationMethod,
              madhab: form.madhab,
            },
            paystack,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setOk(true)
      setPaystackSecret('')
      if (paystack.secretKey) {
        setForm((s) => ({ ...s, hasPaystackSecret: true }))
      }
      toast.success('Settings saved')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed'
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 border border-black/10 bg-white p-6">
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
          Contact & domain
        </h2>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {ok && <p className="text-sm text-[color:var(--icms-emerald)]">Settings saved.</p>}
        <p className="text-xs text-[color:var(--icms-warm-gray)]">
          Logo and brand colors live under{' '}
          <Link
            href={`/icms/admin/${tenantSlug}/brand`}
            className="font-semibold text-[color:var(--icms-emerald)] hover:underline"
          >
            Brand tokens
          </Link>
          .
        </p>
        <label className="block text-sm font-medium">
          Organization name
          <input
            className="icms-input mt-1.5"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          />
        </label>
        <label className="block text-sm font-medium">
          Motto
          <input
            className="icms-input mt-1.5"
            value={form.motto}
            onChange={(e) => setForm((s) => ({ ...s, motto: e.target.value }))}
          />
        </label>

        <label className="block text-sm font-medium">
          Address
          <textarea
            className="icms-input mt-1.5"
            rows={3}
            value={form.address}
            onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
          />
        </label>
        <label className="block text-sm font-medium">
          Phone 1
          <input
            className="icms-input mt-1.5"
            value={form.phone1}
            onChange={(e) => setForm((s) => ({ ...s, phone1: e.target.value }))}
          />
        </label>
        <label className="block text-sm font-medium">
          Phone 2
          <input
            className="icms-input mt-1.5"
            value={form.phone2}
            onChange={(e) => setForm((s) => ({ ...s, phone2: e.target.value }))}
          />
        </label>
        <label className="block text-sm font-medium">
          Email
          <input
            className="icms-input mt-1.5"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          />
        </label>
      </div>

      <div className="space-y-4 border-t border-black/10 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
          Prayer times location
        </h2>
        <p className="text-xs text-[color:var(--icms-warm-gray)]">
          Coordinates and method for live Adhan calculation on the public site.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Latitude
            <input
              className="icms-input mt-1.5"
              type="number"
              step="0.0001"
              value={form.latitude}
              onChange={(e) => setForm((s) => ({ ...s, latitude: e.target.value }))}
            />
          </label>
          <label className="block text-sm font-medium">
            Longitude
            <input
              className="icms-input mt-1.5"
              type="number"
              step="0.0001"
              value={form.longitude}
              onChange={(e) => setForm((s) => ({ ...s, longitude: e.target.value }))}
            />
          </label>
        </div>
        <label className="block text-sm font-medium">
          Timezone
          <input
            className="icms-input mt-1.5"
            value={form.timezone}
            onChange={(e) => setForm((s) => ({ ...s, timezone: e.target.value }))}
          />
        </label>
        <label className="block text-sm font-medium">
          Location label
          <input
            className="icms-input mt-1.5"
            value={form.locationLabel}
            onChange={(e) => setForm((s) => ({ ...s, locationLabel: e.target.value }))}
          />
        </label>
        <label className="block text-sm font-medium">
          Calculation method
          <select
            className="icms-input mt-1.5"
            value={form.calculationMethod}
            onChange={(e) => setForm((s) => ({ ...s, calculationMethod: e.target.value }))}
          >
            {[
              'MuslimWorldLeague',
              'Egyptian',
              'Karachi',
              'UmmAlQura',
              'NorthAmerica',
              'Dubai',
              'Kuwait',
              'Qatar',
              'Singapore',
              'MoonsightingCommittee',
              'Tehran',
              'Turkey',
            ].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Madhab (Asr)
          <select
            className="icms-input mt-1.5"
            value={form.madhab}
            onChange={(e) => setForm((s) => ({ ...s, madhab: e.target.value }))}
          >
            <option value="Shafi">Shafi</option>
            <option value="Hanafi">Hanafi</option>
          </select>
        </label>
      </div>

      <div className="space-y-4 border-t border-black/10 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
          Donation bank account
        </h2>
        <p className="text-xs text-[color:var(--icms-warm-gray)]">
          Shown when donors choose manual transfer on the donate page.
        </p>
        <label className="block text-sm font-medium">
          Bank name
          <input
            className="icms-input mt-1.5"
            value={form.bankName}
            onChange={(e) => setForm((s) => ({ ...s, bankName: e.target.value }))}
            placeholder="Guaranty Trust Bank"
          />
        </label>
        <label className="block text-sm font-medium">
          Account name
          <input
            className="icms-input mt-1.5"
            value={form.accountName}
            onChange={(e) => setForm((s) => ({ ...s, accountName: e.target.value }))}
          />
        </label>
        <label className="block text-sm font-medium">
          Account number
          <input
            className="icms-input mt-1.5"
            value={form.accountNumber}
            onChange={(e) => setForm((s) => ({ ...s, accountNumber: e.target.value }))}
          />
        </label>
        <label className="block text-sm font-medium">
          Transfer note
          <textarea
            className="icms-input mt-1.5"
            rows={2}
            value={form.transferNote}
            onChange={(e) => setForm((s) => ({ ...s, transferNote: e.target.value }))}
            placeholder="Use donor name and purpose as narration"
          />
        </label>
      </div>

      <div className="space-y-4 border-t border-black/10 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
          Paystack (this tenant)
        </h2>
        <p className="text-xs text-[color:var(--icms-warm-gray)]">
          Each centre must use its own Paystack keys. Platform .env keys are not used for ICMS
          donations.
        </p>
        <p className="text-xs font-medium text-[color:var(--icms-charcoal)]">
          Secret key:{' '}
          {form.hasPaystackSecret ? (
            <span className="text-[color:var(--icms-emerald)]">Configured</span>
          ) : (
            <span className="text-amber-700">Not set — Paystack option hidden on donate</span>
          )}
        </p>
        <label className="block text-sm font-medium">
          Secret key {form.hasPaystackSecret ? '(leave blank to keep current)' : ''}
          <input
            type="password"
            autoComplete="off"
            className="icms-input mt-1.5"
            value={paystackSecret}
            onChange={(e) => setPaystackSecret(e.target.value)}
            placeholder="sk_live_… or sk_test_…"
          />
        </label>
        <label className="block text-sm font-medium">
          Public key
          <input
            className="icms-input mt-1.5"
            value={form.paystackPublicKey}
            onChange={(e) => setForm((s) => ({ ...s, paystackPublicKey: e.target.value }))}
            placeholder="pk_live_… or pk_test_…"
          />
        </label>
      </div>

      <button type="submit" className="icms-btn-primary" disabled={saving}>
        {saving ? 'Saving…' : 'Save settings'}
      </button>
    </form>
  )
}
