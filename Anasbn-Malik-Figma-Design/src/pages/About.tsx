import { C, F } from '@/tokens'
import { GoldRule, SectionLabel, SectionHeading, PageHero } from '@/components/Shared'

function Story() {
  return (
    <section style={{ background: C.ivory, padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: '5rem', alignItems: 'start' }}>
        {/* Left — anchor label */}
        <div style={{ position: 'sticky', top: 120 }}>
          <SectionLabel>Our Story</SectionLabel>
          <GoldRule />
          <SectionHeading size="md" style={{ marginTop: '0.75rem' }}>
            Rooted in the Tradition of a Companion
          </SectionHeading>
          <div style={{ width: 1, background: C.gold, opacity: 0.3, height: 120, margin: '2rem 0' }} />
          <p style={{ fontFamily: F.arabic, fontSize: '1.3rem', color: C.gold, lineHeight: 1.8, direction: 'rtl', textAlign: 'right', margin: 0 }}>
            خَادِمُ رَسُولِ اللَّهِ ﷺ
          </p>
          <p style={{ fontFamily: F.body, fontSize: '0.7rem', fontStyle: 'italic', color: C.gray, marginTop: '0.5rem' }}>
            "Servant of the Messenger of Allah ﷺ"<br />— said of Anas ibn Malik RA
          </p>
        </div>

        {/* Right — narrative */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {[
            {
              heading: 'A Name That Carries Weight',
              body: 'Anas ibn Malik ibn al-Nadr al-Ansari — may Allah be pleased with him — served the Prophet Muhammad ﷺ for ten years with complete dedication, asking nothing in return. His life was an embodiment of nearness to knowledge, steadfastness in worship, and generosity of spirit. It is this legacy that gives our Centre its name and its bearing.',
            },
            {
              heading: 'Founded on Service',
              body: 'Anas bn Malik Islamic Centre was established to fill a clear need in the Galadimawa community of Abuja: a space where Muslims could worship, learn, and support one another without the noise and commercial pressures of modern life. The founders — a group of residents committed to the long tradition of Nigerian Islamic scholarship — saw in this district an opportunity to plant something lasting.',
            },
            {
              heading: 'The Four Pillars',
              body: 'Everything we do flows from four convictions: that the mosque is the heart of community life; that sound Islamic knowledge is an obligation on every believer; that the care of the poor and the orphan is inseparable from worship; and that a Muslim institution must be governed with transparency and trust. These are not aspirations — they are the daily practice against which we measure ourselves.',
            },
            {
              heading: 'Looking Forward',
              body: 'We are building an endowment — a Waqf — that will sustain our programmes for generations without dependence on short-term fundraising. We are expanding our Islamiyyah classes, deepening our Friday Khutbah programme, and building welfare infrastructure that treats dignity as non-negotiable. The work is ongoing. The door is open.',
            },
          ].map(({ heading, body }) => (
            <div key={heading}>
              <h3 style={{ fontFamily: F.display, fontWeight: 600, fontSize: '1.05rem', color: C.charcoal, margin: '0 0 0.75rem' }}>{heading}</h3>
              <p style={{ fontFamily: F.body, fontSize: '0.9rem', color: C.charcoal, lineHeight: 1.85, margin: 0, opacity: 0.85 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MissionVision() {
  return (
    <section style={{ background: C.ivoryDim, padding: '5rem 2rem', borderTop: `1px solid ${C.gold}28` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem' }}>
          <SectionLabel>Purpose</SectionLabel>
          <GoldRule />
          <SectionHeading style={{ marginTop: '0.75rem' }}>Mission &amp; Vision</SectionHeading>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0', alignItems: 'start' }}>
          {/* Mission */}
          <div style={{ paddingRight: '4rem' }}>
            <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, margin: '0 0 1.25rem' }}>
              Mission
            </p>
            <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: C.charcoal, lineHeight: 1.4, margin: '0 0 1.5rem' }}>
              To establish and sustain a centre of worship, learning, and welfare that serves the Muslim community of Abuja in a manner pleasing to Allah.
            </p>
            <div style={{ height: 2, width: 48, background: C.gold, marginBottom: '1.5rem' }} />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                'Maintain the five daily prayers and Friday congregation with dignity and scholarship',
                'Deliver structured Islamic education for all age groups',
                'Administer charitable welfare with transparency and respect for recipients',
                'Preserve and transmit the classical Islamic sciences in the Nigerian context',
              ].map(item => (
                <li key={item} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: C.gold, fontFamily: F.body, fontWeight: 600, fontSize: '0.9rem', flexShrink: 0, marginTop: '0.05rem' }}>—</span>
                  <span style={{ fontFamily: F.body, fontSize: '0.86rem', color: C.charcoal, lineHeight: 1.7, opacity: 0.85 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertical rule */}
          <div style={{ background: C.gold, opacity: 0.25, alignSelf: 'stretch' }} />

          {/* Vision */}
          <div style={{ paddingLeft: '4rem' }}>
            <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, margin: '0 0 1.25rem' }}>
              Vision
            </p>
            <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: C.charcoal, lineHeight: 1.4, margin: '0 0 1.5rem' }}>
              To be a model Islamic institution in West Africa — one whose integrity, scholarship, and care for people set the standard for Muslim civic life.
            </p>
            <div style={{ height: 2, width: 48, background: C.gold, marginBottom: '1.5rem' }} />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                'A self-sustaining Waqf endowment that serves future generations without dependence on external donors',
                'A fully accredited Islamiyyah that graduates students grounded in both deen and civic responsibility',
                "A welfare infrastructure recognised by Abuja's Muslim community as trustworthy and effective",
                'A Centre others look to for guidance on governance of Islamic institutions',
              ].map(item => (
                <li key={item} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: C.gold, fontFamily: F.body, fontWeight: 600, fontSize: '0.9rem', flexShrink: 0, marginTop: '0.05rem' }}>—</span>
                  <span style={{ fontFamily: F.body, fontSize: '0.86rem', color: C.charcoal, lineHeight: 1.7, opacity: 0.85 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function AddressBlock() {
  return (
    <section style={{ background: C.emerald, padding: '3.5rem 2rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.5rem' }}>Address</p>
          <p style={{ fontFamily: F.body, fontSize: '1rem', color: C.ivory, lineHeight: 1.7, margin: 0 }}>
            AMSSCO Platinum City Estate, Plot 312 Galadimawa District,<br />Abuja, FCT — Nigeria
          </p>
        </div>
        <GoldRule style={{ width: 1, height: 48, opacity: 0.3 }} />
        <div>
          <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.5rem' }}>Telephone</p>
          <p style={{ fontFamily: F.body, fontSize: '1rem', color: C.ivory, lineHeight: 1.7, margin: 0 }}>
            08062252510<br />08034416661
          </p>
        </div>
        <GoldRule style={{ width: 1, height: 48, opacity: 0.3 }} />
        <div>
          <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.5rem' }}>Office Hours</p>
          <p style={{ fontFamily: F.body, fontSize: '1rem', color: C.ivory, lineHeight: 1.7, margin: 0 }}>
            Saturday – Thursday: 9:00 AM – 5:00 PM<br />Friday: 8:00 AM – 2:00 PM
          </p>
        </div>
      </div>
    </section>
  )
}

export default function About() {
  return (
    <>
      <PageHero
        title="About the Centre"
        subtitle="Established to serve, educate, and uplift the Muslim community of Abuja in the tradition of the Companions of the Prophet ﷺ."
      />
      <Story />
      <MissionVision />
      <AddressBlock />
    </>
  )
}
