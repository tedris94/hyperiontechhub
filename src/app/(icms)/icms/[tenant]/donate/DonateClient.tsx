'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { DonateFund, PageContent, TenantConfig } from '@/lib/icms/types'
import PageHero from '@/components/icms/PageHero'

type Frequency = 'One-Off' | 'Monthly' | 'Quarterly' | 'Yearly'
type PayMethod = 'transfer' | 'paystack' | null
type Phase = 'form' | 'pay' | 'transfer-done' | 'success'

const PRESETS = [
  { label: '₦1,000', value: 1000 },
  { label: '₦5,000', value: 5000 },
  { label: '₦10,000', value: 10000 },
  { label: '₦25,000', value: 25000 },
  { label: '₦50,000', value: 50000 },
]

const FREQUENCIES: Frequency[] = ['One-Off', 'Monthly', 'Quarterly', 'Yearly']

function GoldRule() {
  return <div className="h-px w-full bg-[color:var(--icms-gold)] opacity-55" aria-hidden />
}

const labelClass =
  'mb-[0.35rem] block text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[color:var(--icms-warm-gray)]'
const inputClass =
  'w-full rounded border border-[color:var(--icms-gold)]/27 bg-[color:var(--icms-ivory)] px-4 py-[0.7rem] text-[0.88rem] text-[color:var(--icms-charcoal)] outline-none'

function formatNaira(n: number) {
  return `₦${n.toLocaleString('en-NG')}`
}

function parseAmount(presetValue: number | null, custom: string): number {
  if (custom.trim()) {
    const n = Number(custom.replace(/,/g, ''))
    return Number.isFinite(n) ? Math.round(n) : 0
  }
  return presetValue ?? 0
}

export default function DonateClient({
  tenant,
  funds = [],
  page,
}: {
  tenant: TenantConfig
  funds?: DonateFund[]
  page?: PageContent
}) {
  const searchParams = useSearchParams()
  const purposes = funds.length
    ? funds
    : [
        {
          id: 's',
          key: 'Sadaqah',
          label: 'Sadaqah Jariyah',
          description: 'General charity',
          impactLines: [],
        },
      ]
  const [purposeKey, setPurposeKey] = useState(purposes[0]?.key || 'Sadaqah')
  const purposeFund = purposes.find((p) => p.key === purposeKey) || purposes[0]
  const purpose = purposeFund.key
  const [selectedPreset, setSelectedPreset] = useState<number | null>(5000)
  const [custom, setCustom] = useState('')
  const [frequency, setFrequency] = useState<Frequency>('One-Off')
  const [anonymous, setAnonymous] = useState(false)
  const [donorName, setDonorName] = useState('')
  const [donorPhone, setDonorPhone] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [phase, setPhase] = useState<Phase>('form')
  const [payMethod, setPayMethod] = useState<PayMethod>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [verifyNote, setVerifyNote] = useState('')

  const amount = useMemo(() => parseAmount(selectedPreset, custom), [selectedPreset, custom])
  const bank = tenant.bank
  const hasBank = Boolean(bank?.bankName && bank?.accountName && bank?.accountNumber)
  const paystackEnabled = Boolean(tenant.paystackEnabled)

  const verifyPayment = useCallback(
    async (reference: string) => {
      setBusy(true)
      setError('')
      try {
        const res = await fetch('/api/icms/donate/paystack', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference, tenantSlug: tenant.slug }),
        })
        const data = (await res.json()) as { error?: string; amount?: number }
        if (!res.ok) throw new Error(data.error || 'Could not verify payment')
        setVerifyNote(
          data.amount
            ? `Jazakumullahu khayran — we received ${formatNaira(data.amount)}.`
            : 'Jazakumullahu khayran — your payment was confirmed.',
        )
        setPhase('success')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Verification failed')
        setPhase('pay')
      } finally {
        setBusy(false)
      }
    },
    [tenant.slug],
  )

  useEffect(() => {
    const payment = searchParams.get('payment')
    const reference = searchParams.get('reference')
    if (payment === 'verify' && reference) {
      void verifyPayment(reference)
    }
  }, [searchParams, verifyPayment])

  function proceedToPay() {
    setError('')
    if (amount < 100) {
      setError('Please enter an amount of at least ₦100.')
      return
    }
    if (!anonymous && !donorName.trim()) {
      setError('Please enter your full name, or choose anonymous.')
      return
    }
    setPayMethod(null)
    setPhase('pay')
  }

  async function startPaystack() {
    setError('')
    if (!anonymous && !donorEmail.trim()) {
      setError('Email is required for Paystack payments.')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/icms/donate/paystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug: tenant.slug,
          amount,
          purpose,
          frequency,
          anonymous,
          donorName: anonymous ? '' : donorName.trim(),
          donorPhone: anonymous ? '' : donorPhone.trim(),
          donorEmail: anonymous ? '' : donorEmail.trim(),
        }),
      })
      const data = (await res.json()) as { error?: string; authorizationUrl?: string }
      if (!res.ok || !data.authorizationUrl) {
        throw new Error(data.error || 'Could not start Paystack payment')
      }
      window.location.href = data.authorizationUrl
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed to start')
      setBusy(false)
    }
  }

  async function copyAccount() {
    if (!bank?.accountNumber) return
    try {
      await navigator.clipboard.writeText(bank.accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <PageHero
        tenant={tenant}
        patterned
        title={page?.heroTitle || 'Donate'}
        subtitle={
          page?.heroSubtitle ||
          'Every act of giving, however small, is recorded with Allah. Give with sincerity.'
        }
      />

      <section className="bg-[color:var(--icms-ivory)] px-8 py-20">
        <div className="mx-auto grid w-full max-w-[1280px] items-start gap-16 md:grid-cols-[1.2fr_0.8fr] md:gap-20">
          <div>
            {phase === 'success' ? (
              <div className="rounded border border-[color:var(--icms-gold)]/30 bg-[#F2EFE7] p-8">
                <p className="icms-display mb-2 text-[1.1rem] font-semibold text-[color:var(--icms-emerald)]">
                  Donation received
                </p>
                <p className="m-0 text-[0.9rem] leading-relaxed text-[color:var(--icms-charcoal)]">
                  {verifyNote || 'Jazakumullahu khayran for your contribution.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPhase('form')
                    setPayMethod(null)
                    setVerifyNote('')
                    setError('')
                  }}
                  className="mt-6 rounded bg-[color:var(--icms-emerald)] px-6 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-ivory)]"
                >
                  Make another donation
                </button>
              </div>
            ) : null}

            {phase === 'transfer-done' ? (
              <div className="rounded border border-[color:var(--icms-gold)]/30 bg-[#F2EFE7] p-8">
                <p className="icms-display mb-2 text-[1.1rem] font-semibold text-[color:var(--icms-emerald)]">
                  Transfer instructions noted
                </p>
                <p className="mb-4 text-[0.9rem] leading-relaxed text-[color:var(--icms-charcoal)]">
                  Please complete a bank transfer of{' '}
                  <strong>{formatNaira(amount)}</strong> ({purpose}
                  {frequency !== 'One-Off' ? `, ${frequency}` : ''}) to the centre account below.
                  Once credited, the finance team will reconcile your gift.
                </p>
                {hasBank ? (
                  <dl className="mb-6 space-y-3 text-[0.88rem]">
                    <div>
                      <dt className={labelClass}>Bank</dt>
                      <dd className="m-0 font-semibold text-[color:var(--icms-charcoal)]">
                        {bank?.bankName}
                      </dd>
                    </div>
                    <div>
                      <dt className={labelClass}>Account name</dt>
                      <dd className="m-0 font-semibold text-[color:var(--icms-charcoal)]">
                        {bank?.accountName}
                      </dd>
                    </div>
                    <div>
                      <dt className={labelClass}>Account number</dt>
                      <dd className="m-0 flex flex-wrap items-center gap-3 font-semibold tracking-wide text-[color:var(--icms-charcoal)]">
                        {bank?.accountNumber}
                        <button
                          type="button"
                          onClick={() => void copyAccount()}
                          className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[color:var(--icms-emerald)] underline-offset-2 hover:underline"
                        >
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </dd>
                    </div>
                    {bank?.transferNote ? (
                      <p className="m-0 text-[0.8rem] leading-relaxed text-[color:var(--icms-warm-gray)]">
                        {bank.transferNote}
                      </p>
                    ) : null}
                  </dl>
                ) : (
                  <p className="mb-6 text-[0.88rem] text-[color:var(--icms-warm-gray)]">
                    Bank details are being updated. Please contact {tenant.email || 'the centre'} for
                    transfer instructions.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setPhase('form')
                    setPayMethod(null)
                  }}
                  className="rounded border border-[color:var(--icms-emerald)] px-6 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-emerald)]"
                >
                  Back to form
                </button>
              </div>
            ) : null}

            {phase === 'pay' ? (
              <div>
                <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
                  Step 5 — Payment method
                </p>
                <GoldRule />
                <p className="icms-display mt-3 mb-2 text-[0.95rem] font-semibold text-[color:var(--icms-charcoal)]">
                  How would you like to give {formatNaira(amount)}?
                </p>
                <p className="mb-6 text-[0.82rem] text-[color:var(--icms-warm-gray)]">
                  {purpose} · {frequency}
                  {anonymous ? ' · Anonymous' : donorName ? ` · ${donorName}` : ''}
                </p>

                <div className="mb-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setPayMethod('transfer')}
                    className={`rounded border px-5 py-4 text-left transition-colors ${
                      payMethod === 'transfer'
                        ? 'border-[color:var(--icms-gold)] bg-[#F2EFE7]'
                        : 'border-[color:var(--icms-gold)]/27 bg-transparent'
                    }`}
                  >
                    <p className="icms-display m-0 text-[0.9rem] font-semibold text-[color:var(--icms-charcoal)]">
                      Manual bank transfer
                    </p>
                    <p className="mt-1 mb-0 text-[0.8rem] leading-snug text-[color:var(--icms-warm-gray)]">
                      Transfer to the centre&apos;s account. We will reconcile once funds arrive.
                    </p>
                  </button>
                  {paystackEnabled ? (
                    <button
                      type="button"
                      onClick={() => setPayMethod('paystack')}
                      className={`rounded border px-5 py-4 text-left transition-colors ${
                        payMethod === 'paystack'
                          ? 'border-[color:var(--icms-gold)] bg-[#F2EFE7]'
                          : 'border-[color:var(--icms-gold)]/27 bg-transparent'
                      }`}
                    >
                      <p className="icms-display m-0 text-[0.9rem] font-semibold text-[color:var(--icms-charcoal)]">
                        Pay with Paystack
                      </p>
                      <p className="mt-1 mb-0 text-[0.8rem] leading-snug text-[color:var(--icms-warm-gray)]">
                        Card, bank, USSD, or transfer via Paystack. You will be redirected to complete
                        payment securely.
                      </p>
                    </button>
                  ) : (
                    <p className="m-0 rounded border border-dashed border-[color:var(--icms-gold)]/30 px-5 py-4 text-[0.8rem] text-[color:var(--icms-warm-gray)]">
                      Online Paystack payments are not enabled for this centre yet. Use bank transfer,
                      or ask the centre admin to add Paystack keys under Settings.
                    </p>
                  )}
                </div>

                {payMethod === 'transfer' && hasBank ? (
                  <div className="mb-6 rounded border border-[color:var(--icms-gold)]/20 bg-[#F2EFE7] p-5">
                    <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-gold)]">
                      Centre account
                    </p>
                    <p className="m-0 text-[0.88rem] text-[color:var(--icms-charcoal)]">
                      <span className="font-semibold">{bank?.bankName}</span>
                      <br />
                      {bank?.accountName}
                      <br />
                      <span className="tracking-wide">{bank?.accountNumber}</span>
                    </p>
                    {bank?.transferNote ? (
                      <p className="mt-3 mb-0 text-[0.78rem] text-[color:var(--icms-warm-gray)]">
                        {bank.transferNote}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {error ? (
                  <p className="mb-4 text-[0.82rem] text-red-700" role="alert">
                    {error}
                  </p>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={!payMethod || busy}
                    onClick={() => {
                      if (payMethod === 'transfer') setPhase('transfer-done')
                      else if (payMethod === 'paystack') void startPaystack()
                    }}
                    className="w-full rounded bg-[color:var(--icms-emerald)] py-4 text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-ivory)] disabled:opacity-50"
                  >
                    {busy
                      ? 'Connecting…'
                      : payMethod === 'paystack'
                        ? 'Continue to Paystack'
                        : payMethod === 'transfer'
                          ? 'Show transfer details'
                          : 'Select a method'}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setPhase('form')
                      setPayMethod(null)
                      setError('')
                    }}
                    className="w-full rounded border border-[color:var(--icms-emerald)] py-4 text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-emerald)] sm:w-auto sm:px-8"
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : null}

            {phase === 'form' ? (
              <>
                <div className="mb-10">
                  <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
                    Step 1 — Purpose
                  </p>
                  <GoldRule />
                  <p className="icms-display mt-3 mb-5 text-[0.95rem] font-semibold text-[color:var(--icms-charcoal)]">
                    Where should your donation go?
                  </p>
                  <div role="radiogroup" aria-label="Donation purpose">
                    {purposes.map((p, i) => {
                      const active = purposeKey === p.key
                      return (
                        <div key={p.id}>
                          <button
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setPurposeKey(p.key)}
                            className="grid w-full cursor-pointer grid-cols-[20px_1fr] items-start gap-4 py-[1.1rem] text-left"
                          >
                            <span
                              className={`mt-[0.1rem] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                                active
                                  ? 'border-[color:var(--icms-gold)] bg-[color:var(--icms-gold)]'
                                  : 'border-[color:var(--icms-gold)]/33 bg-transparent'
                              }`}
                              aria-hidden
                            >
                              {active ? (
                                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--icms-forest)]" />
                              ) : null}
                            </span>
                            <span>
                              <p
                                className={`icms-display mb-[0.2rem] text-[0.88rem] font-semibold ${
                                  active
                                    ? 'text-[color:var(--icms-charcoal)]'
                                    : 'text-[color:var(--icms-warm-gray)]'
                                }`}
                              >
                                {p.label}
                              </p>
                              <p className="m-0 text-[0.8rem] leading-[1.6] text-[color:var(--icms-warm-gray)]">
                                {p.description}
                              </p>
                            </span>
                          </button>
                          {i < purposes.length - 1 ? (
                            <div
                              className="h-px bg-[color:var(--icms-gold)] opacity-14"
                              aria-hidden
                            />
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mb-10">
                  <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
                    Step 2 — Amount
                  </p>
                  <GoldRule />
                  <p className="icms-display mt-3 mb-5 text-[0.95rem] font-semibold text-[color:var(--icms-charcoal)]">
                    Choose or enter an amount
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setSelectedPreset(p.value)
                          setCustom('')
                        }}
                        className={`rounded px-[1.1rem] py-[0.6rem] text-[0.78rem] font-semibold transition-colors ${
                          selectedPreset === p.value && !custom
                            ? 'border border-[color:var(--icms-gold)] bg-[color:var(--icms-gold)] text-[color:var(--icms-forest)]'
                            : 'border border-[color:var(--icms-gold)]/27 bg-transparent text-[color:var(--icms-emerald)]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[0.9rem] font-semibold text-[color:var(--icms-warm-gray)]">
                      ₦
                    </span>
                    <input
                      type="number"
                      placeholder="Other amount"
                      value={custom}
                      onChange={(e) => {
                        setCustom(e.target.value)
                        setSelectedPreset(null)
                      }}
                      className={`${inputClass} pl-9 ${custom ? 'border-[color:var(--icms-gold)]' : ''}`}
                    />
                  </div>
                </div>

                <div className="mb-10">
                  <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
                    Step 3 — Frequency
                  </p>
                  <GoldRule />
                  <p className="icms-display mt-3 mb-5 text-[0.95rem] font-semibold text-[color:var(--icms-charcoal)]">
                    How often would you like to give?
                  </p>
                  <div
                    className="flex flex-wrap gap-2"
                    role="radiogroup"
                    aria-label="Donation frequency"
                  >
                    {FREQUENCIES.map((f) => (
                      <button
                        key={f}
                        type="button"
                        role="radio"
                        aria-checked={frequency === f}
                        onClick={() => setFrequency(f)}
                        className={`rounded px-[1.1rem] py-[0.6rem] text-[0.78rem] font-semibold transition-colors ${
                          frequency === f
                            ? 'border border-[color:var(--icms-gold)] bg-[color:var(--icms-gold)] text-[color:var(--icms-forest)]'
                            : 'border border-[color:var(--icms-gold)]/27 bg-transparent text-[color:var(--icms-emerald)]'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  {frequency !== 'One-Off' ? (
                    <p className="mt-3 mb-0 text-[0.78rem] text-[color:var(--icms-warm-gray)]">
                      Paystack charges the first payment now. Recurring schedules can be arranged
                      with the centre after this gift.
                    </p>
                  ) : null}
                </div>

                <div className="mb-10">
                  <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
                    Step 4 — Your Details
                  </p>
                  <GoldRule />
                  <p className="icms-display mt-3 mb-5 text-[0.95rem] font-semibold text-[color:var(--icms-charcoal)]">
                    Contact information
                  </p>
                  <label className="mb-5 flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-[color:var(--icms-emerald)]"
                    />
                    <span className="text-[0.88rem] leading-snug text-[color:var(--icms-charcoal)]">
                      I would like to remain anonymous
                    </span>
                  </label>
                  {!anonymous ? (
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className={labelClass} htmlFor="donor-name">
                          Full Name
                        </label>
                        <input
                          id="donor-name"
                          type="text"
                          placeholder="Alhaji / Hajia or full name"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="donor-phone">
                          Phone Number
                        </label>
                        <input
                          id="donor-phone"
                          type="tel"
                          placeholder="0801 234 5678"
                          value={donorPhone}
                          onChange={(e) => setDonorPhone(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="donor-email">
                          Email Address
                        </label>
                        <input
                          id="donor-email"
                          type="email"
                          placeholder="you@example.com"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>

                {error ? (
                  <p className="mb-4 text-[0.82rem] text-red-700" role="alert">
                    {error}
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={proceedToPay}
                  className="w-full rounded bg-[color:var(--icms-emerald)] py-4 text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-ivory)]"
                >
                  Proceed to Donate
                </button>
                <div className="mt-4 flex items-center gap-2">
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
                    <rect
                      x={3}
                      y={11}
                      width={18}
                      height={11}
                      rx={2}
                      stroke="var(--icms-warm-gray)"
                      strokeWidth={2}
                    />
                    <path
                      d="M7 11V7a5 5 0 0110 0v4"
                      stroke="var(--icms-warm-gray)"
                      strokeWidth={2}
                    />
                  </svg>
                  <p className="m-0 text-[0.72rem] text-[color:var(--icms-warm-gray)]">
                    Bank transfer to the centre account
                    {paystackEnabled ? ', or pay securely with this centre’s Paystack.' : '.'}
                  </p>
                </div>
              </>
            ) : null}
          </div>

          <div className="md:sticky md:top-24">
            <div className="mb-6 rounded border border-[color:var(--icms-gold)]/16 bg-[#F2EFE7] p-8">
              <p className="icms-display mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
                What your giving does
              </p>
              <GoldRule />
              <div className="mt-4 flex flex-col gap-5">
                {purposeFund.impactLines.map(({ amountLabel, effect }) => (
                  <div key={amountLabel + effect} className="flex gap-3">
                    <span className="icms-display min-w-[72px] shrink-0 text-[0.88rem] font-bold text-[color:var(--icms-gold)]">
                      {amountLabel}
                    </span>
                    <span className="text-[0.83rem] leading-[1.65] text-[color:var(--icms-charcoal)]/85">
                      {effect}
                    </span>
                  </div>
                ))}
                {!purposeFund.impactLines.length ? (
                  <p className="text-[0.83rem] text-[color:var(--icms-warm-gray)]">
                    Your gift to {purposeFund.label} supports the centre&apos;s ongoing work.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="border-l-[3px] border-[color:var(--icms-gold)] py-1 pl-7">
              <p
                className="icms-arabic mb-2 text-right text-[1.15rem] leading-relaxed text-[color:var(--icms-gold)]"
                dir="rtl"
              >
                مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ
              </p>
              <p className="mb-3 text-[0.78rem] italic text-[color:var(--icms-warm-gray)]">
                &ldquo;Charity does not decrease wealth.&rdquo; — Sahih Muslim
              </p>
              <p className="m-0 text-[0.82rem] leading-[1.7] text-[color:var(--icms-charcoal)]/80">
                There is no urgency here, no pressure. Give what you can, when you can, with a
                sincere heart. The intention precedes the deed, and Allah sees both.
              </p>
            </div>

            <div className="mt-6 rounded bg-[color:var(--icms-emerald)] p-5">
              <p className="mb-[0.4rem] text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-gold)]">
                Transparency
              </p>
              <p className="m-0 text-[0.8rem] leading-[1.65] text-white/73">
                All donations are fully accounted for and published in our annual financial report.
                Zakat distributions follow Shari&apos;ah guidelines verified by our scholarly
                committee.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
