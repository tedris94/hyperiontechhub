import { useState } from 'react'
import { C, F } from '@/tokens'
import { GoldRule, SectionLabel, SectionHeading, PageHero } from '@/components/Shared'

const SUBJECTS = [
  'General Enquiry',
  'Prayer Times',
  'Events & Programmes',
  'Islamiyyah School',
  'Donations & Waqf',
  'Welfare & Zakat',
  'Media / Press',
  'Other',
]

function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem',
    border: `1px solid ${C.gold}44`, borderRadius: 4,
    fontFamily: F.body, fontSize: '0.88rem', color: C.charcoal,
    background: C.ivory, outline: 'none', boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: F.body, fontSize: '0.7rem', fontWeight: 600,
    letterSpacing: '0.08em', textTransform: 'uppercase', color: C.gray,
    display: 'block', marginBottom: '0.4rem',
  }

  if (submitted) {
    return (
      <div style={{ padding: '3rem 2rem', background: C.ivoryDim, borderRadius: 4, border: `1px solid ${C.gold}28`, textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={C.ivory} strokeWidth={2.5}><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h3 style={{ fontFamily: F.display, fontWeight: 600, fontSize: '1.15rem', color: C.charcoal, margin: '0 0 0.5rem' }}>Message Received</h3>
        <p style={{ fontFamily: F.body, fontSize: '0.88rem', color: C.gray, lineHeight: 1.7, margin: '0 0 1.5rem' }}>
          JazakAllahu Khairan. We will respond within two working days during office hours.
        </p>
        <button onClick={() => setSubmitted(false)} style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.73rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.6rem 1.5rem', border: `1px solid ${C.emerald}`, color: C.emerald, background: 'transparent', borderRadius: 4, cursor: 'pointer' }}>
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input required type="text" placeholder="Alhaji / Hajia or full name" style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Phone Number</label>
          <input type="tel" placeholder="0801 234 5678" style={fieldStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Email Address *</label>
        <input required type="email" placeholder="you@example.com" style={fieldStyle} />
      </div>

      <div>
        <label style={labelStyle}>Subject</label>
        <select style={{ ...fieldStyle, appearance: 'none' }}>
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Message *</label>
        <textarea
          required
          placeholder="Please write your message here…"
          rows={6}
          style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.65 }}
        />
      </div>

      <div>
        <button type="submit" style={{ padding: '0.9rem 2.5rem', background: C.emerald, color: C.ivory, border: 'none', borderRadius: 4, fontFamily: F.body, fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
          Send Message
        </button>
        <p style={{ fontFamily: F.body, fontSize: '0.7rem', color: C.gray, margin: '0.75rem 0 0' }}>
          We typically respond within two working days. Urgent matters may be directed to our phone lines.
        </p>
      </div>
    </form>
  )
}

function MapPlaceholder() {
  return (
    <div style={{ height: 320, background: C.ivoryDim, borderRadius: 4, border: `1px solid ${C.gold}28`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Stylised grid to suggest a map */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.charcoal} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: `0 0 0 8px ${C.emerald}22` }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={C.ivory} strokeWidth={2}><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx={12} cy={10} r={3} /></svg>
        </div>
        <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.88rem', color: C.charcoal, margin: '0 0 0.25rem' }}>
          Anas bn Malik Islamic Centre
        </p>
        <p style={{ fontFamily: F.body, fontSize: '0.78rem', color: C.gray, margin: '0 0 1rem' }}>
          Plot 312 Galadimawa District, Abuja FCT
        </p>
        <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.emerald, textDecoration: 'none', borderBottom: `1px solid ${C.emerald}55` }}>
          Open in Google Maps →
        </a>
      </div>
    </div>
  )
}

export default function Contact() {
  return (
    <>
      <PageHero
        title="Contact"
        subtitle="Reach the Centre for enquiries, pastoral support, programme registration, or general information."
      />

      <section style={{ background: C.ivory, padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,0.7fr)', gap: '5rem', alignItems: 'start' }}>

          {/* Form */}
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
              <SectionLabel>Get in Touch</SectionLabel>
              <GoldRule />
              <SectionHeading style={{ marginTop: '0.75rem' }}>Send Us a Message</SectionHeading>
            </div>
            <ContactForm />
          </div>

          {/* Info sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Map */}
            <div>
              <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.75rem' }}>Location</p>
              <GoldRule />
              <div style={{ marginTop: '1rem' }}>
                <MapPlaceholder />
              </div>
            </div>

            {/* Address */}
            <div>
              <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.75rem' }}>Address</p>
              <GoldRule />
              <p style={{ fontFamily: F.body, fontSize: '0.88rem', color: C.charcoal, lineHeight: 1.8, margin: '0.75rem 0 0' }}>
                AMSSCO Platinum City Estate<br />
                Plot 312 Galadimawa District<br />
                Abuja, FCT — Nigeria
              </p>
            </div>

            {/* Phones */}
            <div>
              <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.75rem' }}>Telephone</p>
              <GoldRule />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.75rem' }}>
                {['08062252510', '08034416661'].map(phone => (
                  <a key={phone} href={`tel:+234${phone.slice(1)}`} style={{ fontFamily: F.display, fontWeight: 600, fontSize: '1rem', color: C.emerald, textDecoration: 'none' }}>
                    {phone}
                  </a>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div>
              <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.75rem' }}>Office Hours</p>
              <GoldRule />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.75rem' }}>
                {[
                  { day: 'Saturday – Thursday', hours: '9:00 AM – 5:00 PM' },
                  { day: 'Friday', hours: '8:00 AM – 2:00 PM' },
                  { day: 'Public Holidays', hours: 'Mosque open; office closed' },
                ].map(({ day, hours }) => (
                  <div key={day} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '0.5rem' }}>
                    <span style={{ fontFamily: F.body, fontSize: '0.8rem', color: C.gray }}>{day}</span>
                    <span style={{ fontFamily: F.body, fontSize: '0.8rem', color: C.charcoal, fontWeight: 500 }}>{hours}</span>
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
