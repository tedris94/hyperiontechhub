import { useState } from 'react'
import { C, F } from '@/tokens'
import { GoldRule, SectionLabel, SectionHeading, PageHero } from '@/components/Shared'

type Purpose = 'Sadaqah' | 'Zakat' | 'Mosque Fund' | 'Education'

const PURPOSES: { key: Purpose; label: string; desc: string }[] = [
  { key: 'Sadaqah', label: 'Sadaqah Jariyah', desc: 'General charity — continuous reward for deeds that benefit others after your passing.' },
  { key: 'Zakat', label: 'Zakat', desc: "Obligatory annual purification of wealth. Distributed to eligible recipients according to Shari'ah." },
  { key: 'Mosque Fund', label: 'Mosque Fund', desc: 'Maintenance, expansion, and running costs of the prayer hall and mosque facilities.' },
  { key: 'Education', label: 'Education', desc: 'Islamiyyah school operations, teacher salaries, student scholarships, and learning materials.' },
]

const PRESETS = ['₦1,000', '₦5,000', '₦10,000', '₦25,000', '₦50,000']

const IMPACT: Record<Purpose, { amount: string; effect: string }[]> = {
  Sadaqah: [
    { amount: '₦5,000', effect: 'feeds a family of six for one day during a welfare distribution' },
    { amount: '₦25,000', effect: 'covers a month of utilities for the mosque common areas' },
  ],
  Zakat: [
    { amount: '₦10,000', effect: "contributes to a widow's monthly support allowance" },
    { amount: '₦50,000', effect: "funds an orphan's school year including books and uniform" },
  ],
  'Mosque Fund': [
    { amount: '₦5,000', effect: "replaces a damaged wudhu' tap fitting" },
    { amount: '₦25,000', effect: 'covers a month of electricity for the prayer hall' },
  ],
  Education: [
    { amount: '₦5,000', effect: 'provides one month of learning materials for a Islamiyyah student' },
    { amount: '₦25,000', effect: "subsidises a term's tuition for a student from a low-income household" },
  ],
}

export default function Donate() {
  const [purpose, setPurpose] = useState<Purpose>('Sadaqah')
  const [selectedPreset, setSelectedPreset] = useState<string | null>('₦5,000')
  const [custom, setCustom] = useState('')

  const handleCustom = (v: string) => {
    setCustom(v)
    setSelectedPreset(null)
  }
  const handlePreset = (p: string) => {
    setSelectedPreset(p)
    setCustom('')
  }

  return (
    <>
      <PageHero
        title="Donate"
        subtitle="Every act of giving, however small, is recorded with Allah. Give with sincerity."
      />

      <section style={{ background: C.ivory, padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,0.8fr)', gap: '5rem', alignItems: 'start' }}>

          {/* Left — form */}
          <div>
            {/* Purpose */}
            <div style={{ marginBottom: '2.5rem' }}>
              <SectionLabel>Step 1 — Purpose</SectionLabel>
              <GoldRule />
              <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.95rem', color: C.charcoal, margin: '0.75rem 0 1.25rem' }}>
                Where should your donation go?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {PURPOSES.map((p, i) => {
                  const active = purpose === p.key
                  return (
                    <div key={p.key}>
                      <label style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: '1rem', padding: '1.1rem 0', cursor: 'pointer', alignItems: 'start' }}>
                        {/* Custom radio */}
                        <div style={{ marginTop: '0.1rem', width: 18, height: 18, borderRadius: '50%', border: `2px solid ${active ? C.gold : `${C.gold}55`}`, background: active ? C.gold : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                          {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.forest }} />}
                        </div>
                        <div onClick={() => setPurpose(p.key)}>
                          <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.88rem', color: active ? C.charcoal : C.gray, margin: '0 0 0.2rem', transition: 'color 0.15s' }}>{p.label}</p>
                          <p style={{ fontFamily: F.body, fontSize: '0.8rem', color: C.gray, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                        </div>
                      </label>
                      {i < PURPOSES.length - 1 && <div style={{ height: 1, background: C.gold, opacity: 0.14 }} />}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Amount */}
            <div style={{ marginBottom: '2.5rem' }}>
              <SectionLabel>Step 2 — Amount</SectionLabel>
              <GoldRule />
              <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.95rem', color: C.charcoal, margin: '0.75rem 0 1.25rem' }}>
                Choose or enter an amount
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {PRESETS.map(p => (
                  <button
                    key={p}
                    onClick={() => handlePreset(p)}
                    style={{
                      fontFamily: F.body, fontWeight: 600, fontSize: '0.78rem',
                      padding: '0.6rem 1.1rem', borderRadius: 4,
                      border: `1px solid ${selectedPreset === p ? C.gold : `${C.gold}44`}`,
                      background: selectedPreset === p ? C.gold : 'transparent',
                      color: selectedPreset === p ? C.forest : C.emerald,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontFamily: F.body, fontWeight: 600, fontSize: '0.9rem', color: C.gray }}>₦</span>
                <input
                  type="number"
                  placeholder="Other amount"
                  value={custom}
                  onChange={e => handleCustom(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.25rem', border: `1px solid ${custom ? C.gold : `${C.gold}44`}`, borderRadius: 4, fontFamily: F.body, fontSize: '0.88rem', color: C.charcoal, background: C.ivory, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Donor details */}
            <div style={{ marginBottom: '2.5rem' }}>
              <SectionLabel>Step 3 — Your Details</SectionLabel>
              <GoldRule />
              <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.95rem', color: C.charcoal, margin: '0.75rem 0 1.25rem' }}>
                Contact information (optional for anonymous giving)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Full Name', placeholder: 'Alhaji / Hajia or full name', type: 'text' },
                  { label: 'Phone Number', placeholder: '0801 234 5678', type: 'tel' },
                  { label: 'Email Address', placeholder: 'you@example.com', type: 'email' },
                ].map(({ label, placeholder, type }) => (
                  <div key={label}>
                    <label style={{ fontFamily: F.body, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.gray, display: 'block', marginBottom: '0.35rem' }}>{label}</label>
                    <input type={type} placeholder={placeholder} style={{ width: '100%', padding: '0.7rem 1rem', border: `1px solid ${C.gold}44`, borderRadius: 4, fontFamily: F.body, fontSize: '0.88rem', color: C.charcoal, background: C.ivory, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button style={{ width: '100%', padding: '1rem', background: C.emerald, color: C.ivory, border: 'none', borderRadius: 4, fontFamily: F.body, fontWeight: 600, fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
              Proceed to Donate
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth={2}><rect x={3} y={11} width={18} height={11} rx={2} /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
              <p style={{ fontFamily: F.body, fontSize: '0.72rem', color: C.gray, margin: 0 }}>
                Secure donation — presentation mode only. No payment is processed.
              </p>
            </div>
          </div>

          {/* Right — impact notes */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ background: C.ivoryDim, borderRadius: 4, border: `1px solid ${C.gold}28`, padding: '2rem', marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.75rem' }}>
                What your giving does
              </p>
              <GoldRule />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                {IMPACT[purpose].map(({ amount, effect }) => (
                  <div key={amount} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: '0.88rem', color: C.gold, flexShrink: 0, minWidth: 72 }}>{amount}</span>
                    <span style={{ fontFamily: F.body, fontSize: '0.83rem', color: C.charcoal, lineHeight: 1.65, opacity: 0.85 }}>{effect}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '1.75rem', borderLeft: `3px solid ${C.gold}` }}>
              <p style={{ fontFamily: F.arabic, fontSize: '1.15rem', color: C.gold, margin: '0 0 0.5rem', direction: 'rtl', textAlign: 'right', lineHeight: 1.6 }}>
                مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ
              </p>
              <p style={{ fontFamily: F.body, fontSize: '0.78rem', fontStyle: 'italic', color: C.gray, margin: '0 0 0.75rem' }}>
                "Charity does not decrease wealth." — Sahih Muslim
              </p>
              <p style={{ fontFamily: F.body, fontSize: '0.82rem', color: C.charcoal, lineHeight: 1.7, margin: 0, opacity: 0.8 }}>
                There is no urgency here, no pressure. Give what you can, when you can, with a sincere heart. The intention precedes the deed, and Allah sees both.
              </p>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: C.emerald, borderRadius: 4 }}>
              <p style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.4rem' }}>Transparency</p>
              <p style={{ fontFamily: F.body, fontSize: '0.8rem', color: `${C.ivory}BB`, lineHeight: 1.65, margin: 0 }}>
                All donations are fully accounted for and published in our annual financial report. Zakat distributions follow Shari'ah guidelines verified by our scholarly committee.
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
