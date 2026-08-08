import { C, F } from '@/tokens'
import { GoldRule, SectionLabel, SectionHeading } from '@/components/Shared'
import logoSrc from '@/imports/Anas_bn_Malik_Islamic_Center_logo.png'
import { Link } from 'react-router'

const HERO_URL = 'https://images.unsplash.com/photo-1521241191669-b9fba071b073?w=1800&h=1000&fit=crop&auto=format'

const PRAYERS = [
  { name: 'Fajr', time: '5:12 AM' },
  { name: 'Shuruq', time: '6:38 AM' },
  { name: 'Dhuhr', time: '12:48 PM' },
  { name: 'Asr', time: '4:05 PM' },
  { name: 'Maghrib', time: '6:52 PM' },
  { name: 'Isha', time: '8:10 PM' },
]

const EVENTS = [
  { date: { day: '09', month: 'Aug' }, title: 'Weekly Quran Tafsir Circle', category: 'Education', time: 'After Maghrib', location: 'Main Prayer Hall' },
  { date: { day: '16', month: 'Aug' }, title: "Jumuah Khutbah — Sheikh Abdullahi Umar", category: 'Friday Prayer', time: '1:30 PM', location: 'Main Prayer Hall' },
  { date: { day: '23', month: 'Aug' }, title: 'Youth Islamic Workshop: Fiqh of Fasting', category: 'Youth', time: '10:00 AM – 1:00 PM', location: 'Education Centre' },
]

const ARTICLES = [
  { category: 'Fiqh', title: 'The Conditions for a Valid Salah', excerpt: 'A structured overview of the prerequisites for a sound prayer according to classical scholarship.', date: '28 Jul 2026', photo: 'https://images.unsplash.com/photo-1542414110-ae27fdb87ee1?w=600&h=400&fit=crop&auto=format' },
  { category: 'Tarbiyah', title: 'Raising Children with Islamic Identity in Abuja', excerpt: 'Practical strategies for nurturing deen-conscious households rooted in Sunnah values.', date: '20 Jul 2026', photo: 'https://images.unsplash.com/photo-1606981693736-62d6c4954ba5?w=600&h=400&fit=crop&auto=format' },
  { category: 'Community', title: 'Waqf in West Africa: A Reviving Institution', excerpt: 'How Islamic endowments are experiencing a measured renaissance across Nigeria.', date: '10 Jul 2026', photo: 'https://images.unsplash.com/photo-1558114965-eeb97aa84c3b?w=600&h=400&fit=crop&auto=format' },
]

function Hero() {
  return (
    <section style={{ position: 'relative', height: '100vh', minHeight: 600, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', background: C.forest }}>
      <img src={HERO_URL} alt="Mosque architecture" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,56,43,0.3) 0%, rgba(7,56,43,0.1) 40%, rgba(7,56,43,0.88) 100%)' }} />
      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '0 2rem 5rem', width: '100%' }}>
        <p style={{ fontFamily: F.body, fontSize: '0.64rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.gold, marginBottom: '1.25rem', opacity: 0.9 }}>
          ✦ &nbsp;Striving in the Cause of Allah&nbsp; ✦
        </p>
        <div style={{ width: 48, height: 1, background: C.gold, marginBottom: '1.5rem' }} />
        <h1 style={{ fontFamily: F.display, fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.ivory, lineHeight: 1.15, margin: '0 0 1.25rem', maxWidth: 700 }}>
          A House of Worship,<br />Knowledge &amp; Community
        </h1>
        <p style={{ fontFamily: F.body, fontWeight: 400, fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', color: `${C.ivory}CC`, maxWidth: 500, lineHeight: 1.75, marginBottom: '2.5rem' }}>
          Serving the Muslim community of Abuja with devotion, education, and charitable service.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/donate" style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.875rem 2rem', background: C.gold, color: C.forest, borderRadius: 4, textDecoration: 'none', border: `1px solid ${C.gold}` }}>
            Donate Now
          </Link>
          <Link to="/mosque" style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.875rem 2rem', background: 'transparent', color: C.ivory, borderRadius: 4, textDecoration: 'none', border: `1px solid ${C.ivory}55` }}>
            Prayer Times
          </Link>
        </div>
      </div>
    </section>
  )
}

function PrayerStrip() {
  return (
    <section style={{ background: C.emerald }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 0 0', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, margin: 0 }}>
            Today's Prayer Times
          </p>
          <p style={{ fontFamily: F.body, fontSize: '0.7rem', color: `${C.ivory}77`, margin: 0 }}>
            Monday, 4 August 2026 · Abuja, FCT
          </p>
        </div>
        <GoldRule style={{ margin: '0.75rem 0' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', paddingBottom: '1.2rem' }}>
          {PRAYERS.map((p, i) => (
            <div key={p.name} style={{ padding: '0.4rem 0', borderRight: i < PRAYERS.length - 1 ? `1px solid ${C.gold}28` : 'none', textAlign: 'center' }}>
              <p style={{ fontFamily: F.body, fontSize: '0.63rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.2rem' }}>{p.name}</p>
              <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.95rem', color: C.ivory, margin: 0 }}>{p.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EventsSection() {
  return (
    <section style={{ background: C.ivory, padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <SectionLabel>Upcoming Events</SectionLabel>
          <GoldRule />
          <SectionHeading>What's Happening at the Centre</SectionHeading>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {EVENTS.map((ev, i) => (
            <div key={i}>
              <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr auto', gap: '1.5rem', alignItems: 'center', padding: '1.5rem 0' }}>
                <div style={{ textAlign: 'center', background: C.emerald, borderRadius: 4, padding: '0.65rem 0.5rem' }}>
                  <p style={{ fontFamily: F.display, fontWeight: 700, fontSize: '1.4rem', color: C.ivory, margin: 0, lineHeight: 1 }}>{ev.date.day}</p>
                  <p style={{ fontFamily: F.body, fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold, margin: '0.15rem 0 0' }}>{ev.date.month}</p>
                </div>
                <div>
                  <p style={{ fontFamily: F.body, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.3rem' }}>{ev.category}</p>
                  <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)', color: C.charcoal, margin: '0 0 0.3rem' }}>{ev.title}</p>
                  <p style={{ fontFamily: F.body, fontSize: '0.76rem', color: C.gray, margin: 0 }}>{ev.time} · {ev.location}</p>
                </div>
                <Link to="/events" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, border: `1px solid ${C.gold}55`, borderRadius: 4, color: C.gold, textDecoration: 'none', flexShrink: 0 }}>
                  <svg width={15} height={15} viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </div>
              {i < EVENTS.length - 1 && <GoldRule />}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '2rem' }}>
          <Link to="/events" style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.73rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.emerald, textDecoration: 'none', borderBottom: `1px solid ${C.emerald}` }}>
            View All Events →
          </Link>
        </div>
      </div>
    </section>
  )
}

function WaqfSection() {
  return (
    <section style={{ background: C.forest, padding: '5rem 2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='%23C79A2C'/%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '4rem', alignItems: 'center' }}>
          <div>
            <SectionLabel>Waqf &amp; Endowments</SectionLabel>
            <GoldRule />
            <SectionHeading light style={{ marginTop: '0.75rem' }}>Leave a Legacy That Outlasts Your Lifetime</SectionHeading>
            <p style={{ fontFamily: F.arabic, fontSize: '1.1rem', fontStyle: 'italic', color: C.gold, margin: '1.5rem 0 0.5rem', lineHeight: 1.6, direction: 'rtl', textAlign: 'right' }}>
              إِذَا مَاتَ الْإِنسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ
            </p>
            <p style={{ fontFamily: F.body, fontSize: '0.73rem', fontStyle: 'italic', color: `${C.ivory}77`, marginBottom: '1.25rem' }}>
              "When a person dies, all his deeds end except three…" — Sahih Muslim
            </p>
            <p style={{ fontFamily: F.body, fontSize: '0.88rem', color: `${C.ivory}BB`, lineHeight: 1.8, marginBottom: '2rem' }}>
              Our Waqf programme channels endowments into the permanent infrastructure of Islamic education, community welfare, and sacred space maintenance.
            </p>
            <Link to="/waqf" style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.76rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.85rem 2rem', background: C.gold, color: C.forest, borderRadius: 4, textDecoration: 'none', display: 'inline-block' }}>
              Learn About Waqf
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingLeft: '2rem', borderLeft: `1px solid ${C.gold}28` }}>
            {[
              { value: '₦28M+', label: 'Total Waqf Contributions', sub: 'Cumulative since founding' },
              { value: '340', label: 'Beneficiary Families', sub: 'Annual welfare support' },
              { value: '12', label: 'Scholarship Recipients', sub: 'Islamic studies — 2026' },
            ].map(stat => (
              <div key={stat.value}>
                <p style={{ fontFamily: F.display, fontWeight: 700, fontSize: '2.25rem', color: C.gold, margin: '0 0 0.2rem' }}>{stat.value}</p>
                <p style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.78rem', color: C.ivory, margin: '0 0 0.15rem' }}>{stat.label}</p>
                <p style={{ fontFamily: F.body, fontSize: '0.7rem', color: `${C.ivory}55`, margin: 0 }}>{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ArticlesSection() {
  return (
    <section style={{ background: C.ivoryDim, padding: '5rem 2rem', borderTop: `1px solid ${C.gold}28` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <SectionLabel>Knowledge &amp; Reflection</SectionLabel>
            <GoldRule />
            <SectionHeading>Latest from the Centre</SectionHeading>
          </div>
          <Link to="/articles" style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.73rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.emerald, textDecoration: 'none', borderBottom: `1px solid ${C.emerald}` }}>All Articles →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {ARTICLES.map((a, i) => (
            <article key={i} style={{ background: C.ivory, borderRadius: 4, overflow: 'hidden', border: `1px solid ${C.gold}1A` }}>
              <div style={{ height: 176, overflow: 'hidden', background: C.forest }}>
                <img src={a.photo} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <p style={{ fontFamily: F.body, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.6rem' }}>{a.category}</p>
                <h3 style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.98rem', color: C.charcoal, margin: '0 0 0.6rem', lineHeight: 1.35 }}>{a.title}</h3>
                <p style={{ fontFamily: F.body, fontSize: '0.8rem', color: C.gray, lineHeight: 1.65, margin: '0 0 1.25rem' }}>{a.excerpt}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: F.body, fontSize: '0.67rem', color: `${C.gray}88` }}>{a.date}</span>
                  <Link to="/articles" style={{ fontFamily: F.body, fontSize: '0.7rem', fontWeight: 600, color: C.emerald, textDecoration: 'none', borderBottom: `1px solid ${C.emerald}55` }}>Read →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function LocationSection() {
  return (
    <section style={{ background: C.ivory, padding: '5rem 2rem', borderTop: `1px solid ${C.gold}28` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem', alignItems: 'start' }}>
        <div>
          <SectionLabel>Find Us</SectionLabel>
          <GoldRule />
          <SectionHeading size="sm">Our Location</SectionHeading>
          <p style={{ fontFamily: F.body, fontSize: '0.88rem', lineHeight: 1.8, color: C.charcoal, margin: '1rem 0 0' }}>
            AMSSCO Platinum City Estate<br />Plot 312 Galadimawa District<br />Abuja, FCT — Nigeria
          </p>
        </div>
        <div>
          <SectionLabel>Contact</SectionLabel>
          <GoldRule />
          <SectionHeading size="sm">Reach the Centre</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            {['08062252510', '08034416661'].map(phone => (
              <a key={phone} href={`tel:+234${phone.slice(1)}`} style={{ fontFamily: F.display, fontWeight: 600, fontSize: '1rem', color: C.emerald, textDecoration: 'none' }}>{phone}</a>
            ))}
          </div>
        </div>
        <div id="donate">
          <SectionLabel>Support the Centre</SectionLabel>
          <GoldRule />
          <SectionHeading size="sm">Donate Today</SectionHeading>
          <p style={{ fontFamily: F.body, fontSize: '0.84rem', color: C.gray, lineHeight: 1.7, margin: '1rem 0 1.25rem' }}>
            Your generosity sustains our mosque, education programmes, and community welfare initiatives.
          </p>
          <Link to="/donate" style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.85rem 2rem', background: C.emerald, color: C.ivory, borderRadius: 4, textDecoration: 'none', display: 'inline-block' }}>
            Give Now
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <PrayerStrip />
      <EventsSection />
      <WaqfSection />
      <ArticlesSection />
      <LocationSection />
    </>
  )
}
