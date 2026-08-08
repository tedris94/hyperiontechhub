import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { C, F } from '@/tokens'
import logoSrc from '@/imports/Anas_bn_Malik_Islamic_Center_logo.png'

// ── Primitive helpers ──────────────────────────────────────────────────────────

export function GoldRule({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{ height: 1, background: C.gold, opacity: 0.55, ...style }}
    />
  )
}

export function SectionLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <p style={{
      fontFamily: F.body,
      fontSize: '0.65rem',
      fontWeight: 600,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: C.gold,
      margin: '0 0 0.6rem',
    }}>
      {children}
    </p>
  )
}

export function SectionHeading({
  children,
  light = false,
  size = 'lg',
  style: extra = {},
}: {
  children: React.ReactNode
  light?: boolean
  size?: 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
}) {
  const fontSize = size === 'sm' ? '1.15rem' : size === 'md' ? 'clamp(1.35rem, 2.5vw, 1.75rem)' : 'clamp(1.6rem, 3vw, 2.5rem)'
  return (
    <h2 style={{
      fontFamily: F.display,
      fontWeight: 600,
      color: light ? C.ivory : C.charcoal,
      fontSize,
      lineHeight: 1.2,
      margin: '0.75rem 0 0',
      ...extra,
    }}>
      {children}
    </h2>
  )
}

// ── Inner-page hero band ──────────────────────────────────────────────────────

export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section style={{
      background: C.forest,
      paddingTop: '9rem',
      paddingBottom: '4rem',
      paddingLeft: '2rem',
      paddingRight: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle diamond pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20Z' fill='%23C79A2C'/%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px',
      }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div style={{ width: 36, height: 1, background: C.gold, marginBottom: '1.25rem' }} />
        <h1 style={{
          fontFamily: F.display,
          fontWeight: 700,
          fontSize: 'clamp(1.75rem, 4vw, 3rem)',
          color: C.ivory,
          margin: '0 0 0.75rem',
          lineHeight: 1.15,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontFamily: F.body,
            fontSize: 'clamp(0.88rem, 1.5vw, 1rem)',
            color: `${C.ivory}99`,
            margin: 0,
            maxWidth: 560,
            lineHeight: 1.7,
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}

// ── Navigation ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Mosque', to: '/mosque' },
  { label: 'Events', to: '/events' },
  { label: 'Waqf', to: '/waqf' },
  { label: 'Articles', to: '/articles' },
  { label: 'Contact', to: '/contact' },
]

export function Nav() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(!isHome)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!isHome) { setScrolled(true); return }
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const textColor = scrolled ? C.charcoal : C.ivory
  const logoFilter = scrolled ? 'none' : 'brightness(0) invert(1)'

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(250,248,242,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(8px)' : 'none',
      borderBottom: scrolled ? `1px solid ${C.gold}33` : 'none',
      transition: 'background 0.35s, border-color 0.35s',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 2rem',
        height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Wordmark */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img
            src={logoSrc}
            alt="Anas bn Malik Islamic Center"
            style={{ height: 44, width: 'auto', objectFit: 'contain', filter: logoFilter, transition: 'filter 0.35s' }}
          />
          <span style={{
            fontFamily: F.display, fontWeight: 700, fontSize: '0.85rem',
            lineHeight: 1.2, color: scrolled ? C.emerald : C.ivory,
            transition: 'color 0.35s', maxWidth: 130,
          }}>
            Anas bn Malik
          </span>
        </Link>

        {/* Desktop links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }} className="hidden md:flex">
          {NAV_LINKS.map(({ label, to }) => {
            const active = pathname === to
            return (
              <Link
                key={label}
                to={to}
                style={{
                  fontFamily: F.body, fontWeight: active ? 600 : 500,
                  fontSize: '0.77rem', letterSpacing: '0.04em',
                  padding: '0.4rem 0.8rem',
                  color: active ? C.gold : textColor,
                  textDecoration: 'none', transition: 'color 0.2s',
                  borderBottom: active ? `1px solid ${C.gold}` : '1px solid transparent',
                }}
              >
                {label}
              </Link>
            )
          })}
          <Link
            to="/donate"
            style={{
              fontFamily: F.body, fontWeight: 600, fontSize: '0.77rem',
              letterSpacing: '0.08em', padding: '0.5rem 1.2rem', marginLeft: '0.5rem',
              background: C.gold, color: C.forest, borderRadius: 4,
              textDecoration: 'none', border: `1px solid ${C.gold}`,
              transition: 'background 0.2s',
            }}
          >
            Donate
          </Link>
        </nav>

        {/* Hamburger */}
        <button
          className="flex md:hidden"
          onClick={() => setMenuOpen(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: textColor }}
          aria-label="Toggle menu"
        >
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            {menuOpen
              ? <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              : <><line x1={3} y1={6} x2={21} y2={6} /><line x1={3} y1={12} x2={21} y2={12} /><line x1={3} y1={18} x2={21} y2={18} /></>
            }
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: C.ivory, borderTop: `1px solid ${C.gold}33`, padding: '1rem 2rem 1.5rem' }}>
          {[...NAV_LINKS, { label: 'Donate', to: '/donate' }].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', fontFamily: F.body,
                fontWeight: label === 'Donate' ? 600 : 500, fontSize: '0.9rem',
                padding: '0.65rem 0', color: label === 'Donate' ? C.gold : C.charcoal,
                textDecoration: 'none', borderBottom: `1px solid ${C.gold}1A`,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

const PRAYERS = [
  { name: 'Fajr', time: '5:12 AM' },
  { name: 'Shuruq', time: '6:38 AM' },
  { name: 'Dhuhr', time: '12:48 PM' },
  { name: 'Asr', time: '4:05 PM' },
  { name: 'Maghrib', time: '6:52 PM' },
  { name: 'Isha', time: '8:10 PM' },
]

const FOOTER_LINKS = [
  ['About Us', '/about'],
  ['The Mosque', '/mosque'],
  ['Events', '/events'],
  ['Waqf', '/waqf'],
  ['Articles', '/articles'],
  ['Donate', '/donate'],
  ['Contact', '/contact'],
]

export function Footer() {
  return (
    <footer style={{ background: C.forest, padding: '4rem 2rem 2rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem', marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <img
              src={logoSrc}
              alt="Anas bn Malik Islamic Center"
              style={{ height: 56, objectFit: 'contain', marginBottom: '1rem', filter: 'brightness(0) invert(1)' }}
            />
            <p style={{ fontFamily: F.body, fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.75rem' }}>
              Striving in the Cause of Allah
            </p>
            <p style={{ fontFamily: F.body, fontSize: '0.8rem', color: `${C.ivory}88`, lineHeight: 1.7, margin: 0 }}>
              AMSSCO Platinum City Estate, Plot 312 Galadimawa District, Abuja FCT, Nigeria.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, margin: '0 0 1rem' }}>
              Quick Links
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {FOOTER_LINKS.map(([label, to]) => (
                <Link
                  key={label}
                  to={to}
                  style={{ fontFamily: F.body, fontSize: '0.82rem', color: `${C.ivory}AA`, textDecoration: 'none' }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Prayer times */}
          <div>
            <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, margin: '0 0 1rem' }}>
              Prayer Times
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {PRAYERS.map(p => (
                <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.gold}18`, paddingBottom: '0.3rem' }}>
                  <span style={{ fontFamily: F.body, fontSize: '0.78rem', color: `${C.ivory}88` }}>{p.name}</span>
                  <span style={{ fontFamily: F.display, fontSize: '0.78rem', fontWeight: 600, color: C.ivory }}>{p.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <GoldRule />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontFamily: F.body, fontSize: '0.7rem', color: `${C.ivory}55`, margin: 0 }}>
            © 2026 Anas bn Malik Islamic Center, Abuja. All rights reserved.
          </p>
          <p style={{ fontFamily: F.body, fontSize: '0.7rem', color: `${C.ivory}33`, margin: 0 }}>
            Powered by Hyperion ICMS
          </p>
        </div>
      </div>
    </footer>
  )
}
