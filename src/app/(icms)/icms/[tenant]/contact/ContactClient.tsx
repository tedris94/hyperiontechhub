'use client'

import { useState } from 'react'
import type { PageContent, TenantConfig } from '@/lib/icms/types'
import PageHero from '@/components/icms/PageHero'

function GoldRule() {
  return <div className="h-px w-full bg-[color:var(--icms-gold)] opacity-55" aria-hidden />
}

const fieldClass =
  'w-full rounded border border-[color:var(--icms-gold)]/27 bg-[color:var(--icms-ivory)] px-4 py-3 text-[0.88rem] text-[color:var(--icms-charcoal)] outline-none'
const labelClass =
  'mb-[0.4rem] block text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[color:var(--icms-warm-gray)]'

export default function ContactClient({
  tenant,
  page,
  subjects,
}: {
  tenant: TenantConfig
  page?: PageContent
  subjects: string[]
}) {
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState(subjects[0] || '')
  const [message, setMessage] = useState('')

  const mapsQuery = encodeURIComponent(tenant.address)
  const mapsEmbed = `https://maps.google.com/maps?q=${mapsQuery}&z=15&output=embed`
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`
  const hours = page?.officeHours?.length
    ? page.officeHours
    : [
        { label: 'Saturday – Thursday', value: '9:00 AM – 5:00 PM' },
        { label: 'Friday', value: '8:00 AM – 2:00 PM' },
        { label: 'Public Holidays', value: 'Mosque open; office closed' },
      ]

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/icms/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug: tenant.slug,
          name,
          email,
          phone,
          subject,
          message,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not send message')
      setSubmitted(true)
      setName('')
      setPhone('')
      setEmail('')
      setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send message')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHero
        tenant={tenant}
        patterned
        title={page?.heroTitle || 'Contact'}
        subtitle={
          page?.heroSubtitle ||
          'Reach the Centre for enquiries, pastoral support, programme registration, or general information.'
        }
      />

      <section className="bg-[color:var(--icms-ivory)] px-8 py-20">
        <div className="mx-auto grid w-full max-w-[1280px] items-start gap-16 md:grid-cols-[1.3fr_0.7fr] md:gap-20">
          <div>
            <div className="mb-10">
              <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
                Get in Touch
              </p>
              <GoldRule />
              <h2 className="icms-display mt-3 text-[clamp(1.4rem,3vw,2rem)] font-semibold text-[color:var(--icms-charcoal)]">
                Send Us a Message
              </h2>
            </div>

            {submitted ? (
              <div className="rounded border border-[color:var(--icms-gold)]/16 bg-[#F2EFE7] px-8 py-12 text-center">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--icms-emerald)]">
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="var(--icms-ivory)"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="icms-display mb-2 text-[1.15rem] font-semibold text-[color:var(--icms-charcoal)]">
                  Message Received
                </h3>
                <p className="mb-6 text-[0.88rem] leading-[1.7] text-[color:var(--icms-warm-gray)]">
                  JazakAllahu Khairan. We will respond within two working days during office hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="rounded border border-[color:var(--icms-emerald)] bg-transparent px-6 py-[0.6rem] text-[0.73rem] font-semibold uppercase tracking-[0.08em] text-[color:var(--icms-emerald)]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={(e) => void onSubmit(e)}>
                {error ? (
                  <p className="text-sm text-red-700" role="alert">
                    {error}
                  </p>
                ) : null}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alhaji / Hajia or full name"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0801 234 5678"
                      className={fieldClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Subject</label>
                  <select
                    className={`${fieldClass} appearance-none`}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Message *</label>
                  <textarea
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please write your message here…"
                    className={`${fieldClass} resize-y leading-[1.65]`}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={busy}
                    className="rounded bg-[color:var(--icms-emerald)] px-10 py-[0.9rem] text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--icms-ivory)] disabled:opacity-50"
                  >
                    {busy ? 'Sending…' : 'Send Message'}
                  </button>
                  <p className="mt-3 text-[0.7rem] text-[color:var(--icms-warm-gray)]">
                    We typically respond within two working days. Urgent matters may be directed to
                    our phone lines.
                  </p>
                </div>
              </form>
            )}
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <p className="icms-display mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
                {page?.findUsEyebrow || 'Location'}
              </p>
              <GoldRule />
              <div className="mt-4 overflow-hidden rounded border border-[color:var(--icms-gold)]/16">
                <iframe
                  title="Centre location"
                  src={mapsEmbed}
                  className="h-80 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block border-b border-[color:var(--icms-emerald)]/33 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[color:var(--icms-emerald)]"
              >
                {page?.mapCtaLabel || 'Open in Google Maps →'}
              </a>
            </div>

            <div>
              <p className="icms-display mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
                Address
              </p>
              <GoldRule />
              <p className="mt-3 whitespace-pre-line text-[0.88rem] leading-[1.8] text-[color:var(--icms-charcoal)]">
                {tenant.address.replace(/,\s*/g, '\n')}
              </p>
            </div>

            <div>
              <p className="icms-display mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
                Telephone
              </p>
              <GoldRule />
              <div className="mt-3 flex flex-col gap-[0.4rem]">
                {tenant.phones.map((phoneLine) => (
                  <a
                    key={phoneLine}
                    href={`tel:${phoneLine}`}
                    className="icms-display text-base font-semibold text-[color:var(--icms-emerald)] no-underline"
                  >
                    {phoneLine}
                  </a>
                ))}
                {tenant.email ? (
                  <a
                    href={`mailto:${tenant.email}`}
                    className="mt-1 text-sm text-[color:var(--icms-warm-gray)] hover:text-[color:var(--icms-emerald)]"
                  >
                    {tenant.email}
                  </a>
                ) : null}
              </div>
            </div>

            <div>
              <p className="icms-display mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--icms-gold)]">
                Office Hours
              </p>
              <GoldRule />
              <div className="mt-3 flex flex-col gap-[0.35rem]">
                {hours.map((h) => (
                  <div key={h.label} className="grid grid-cols-[160px_1fr] gap-2 text-[0.8rem]">
                    <span className="text-[color:var(--icms-warm-gray)]">{h.label}</span>
                    <span className="font-medium text-[color:var(--icms-charcoal)]">{h.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
