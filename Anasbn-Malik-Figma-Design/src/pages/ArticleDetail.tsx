import { useParams, Link } from 'react-router'
import { C, F } from '@/tokens'
import { GoldRule } from '@/components/Shared'
import { ARTICLES_DATA } from './Articles'

export default function ArticleDetail() {
  const { id } = useParams()
  const article = ARTICLES_DATA.find(a => a.id === Number(id)) ?? ARTICLES_DATA[0]
  const related = ARTICLES_DATA.filter(a => a.id !== article.id).slice(0, 3)

  return (
    <>
      {/* Article hero */}
      <div style={{ height: 420, position: 'relative', background: C.forest, overflow: 'hidden' }}>
        <img src={article.photo} alt={article.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,56,43,0.9) 0%, rgba(7,56,43,0.3) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, maxWidth: 1280, margin: '0 auto', padding: '0 2rem 3rem' }}>
          <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
            <Link to="/articles" style={{ fontFamily: F.body, fontSize: '0.7rem', color: `${C.ivory}88`, textDecoration: 'none' }}>Articles</Link>
            <span style={{ color: `${C.ivory}55`, fontSize: '0.7rem' }}>›</span>
            <span style={{ fontFamily: F.body, fontSize: '0.7rem', color: C.gold }}>{article.category}</span>
          </nav>
          <h1 style={{ fontFamily: F.display, fontWeight: 700, fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', color: C.ivory, margin: '0 0 1rem', lineHeight: 1.2, maxWidth: 720 }}>
            {article.title}
          </h1>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: F.body, fontSize: '0.75rem', color: C.gold }}>By {article.author}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: `${C.ivory}55`, display: 'inline-block' }} />
            <span style={{ fontFamily: F.body, fontSize: '0.75rem', color: `${C.ivory}88` }}>{article.date}</span>
            <span style={{ fontFamily: F.body, fontSize: '0.75rem', color: `${C.ivory}66` }}>· {article.readTime} read</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <section style={{ background: C.ivory, padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: '5rem', alignItems: 'start' }}>

          {/* Article body */}
          <article>
            {/* Opening */}
            <p style={{ fontFamily: F.body, fontSize: '1rem', color: C.charcoal, lineHeight: 1.9, margin: '0 0 1.5rem', fontWeight: 500 }}>
              {article.excerpt}
            </p>
            <GoldRule style={{ margin: '2rem 0' }} />

            <p style={{ fontFamily: F.body, fontSize: '0.9rem', color: C.charcoal, lineHeight: 1.9, margin: '0 0 1.5rem', opacity: 0.85 }}>
              Classical Islamic scholarship does not treat religious knowledge as separate from practical life. The conditions of valid worship — the shuroot — are not bureaucratic hurdles but an expression of the comprehensive nature of Islam's concern for the inner state of the believer. To approach Allah in prayer, one must first address the body, the direction, the time, and the intention.
            </p>

            <p style={{ fontFamily: F.body, fontSize: '0.9rem', color: C.charcoal, lineHeight: 1.9, margin: '0 0 1.5rem', opacity: 0.85 }}>
              The scholars have enumerated these conditions with care across the generations, and while there are minor differences between the legal schools, the points of agreement are far more numerous than the points of difference. This article focuses on the consensus positions — the conditions no school disputes — to give the reader a stable foundation.
            </p>

            {/* Pull quote */}
            <blockquote style={{ margin: '2.5rem 0', padding: '1.75rem 2rem', borderLeft: `4px solid ${C.gold}`, background: C.ivoryDim }}>
              <p style={{ fontFamily: F.arabic, fontSize: '1.2rem', color: C.gold, direction: 'rtl', textAlign: 'right', lineHeight: 1.8, margin: '0 0 0.75rem' }}>
                الصَّلَاةُ عِمَادُ الدِّينِ
              </p>
              <p style={{ fontFamily: F.body, fontSize: '0.85rem', fontStyle: 'italic', color: C.charcoal, margin: '0 0 0.5rem', lineHeight: 1.6, opacity: 0.85 }}>
                "Prayer is the pillar of the religion. Whoever establishes it has established the religion; whoever abandons it has demolished the religion."
              </p>
              <cite style={{ fontFamily: F.body, fontSize: '0.7rem', color: C.gray, fontStyle: 'normal' }}>— Reported by al-Bayhaqi</cite>
            </blockquote>

            <p style={{ fontFamily: F.body, fontSize: '0.9rem', color: C.charcoal, lineHeight: 1.9, margin: '0 0 1.5rem', opacity: 0.85 }}>
              The first condition is purity of body — tahara. This includes being free from major ritual impurity (requiring ghusl) and minor impurity (requiring wudhu'). The second is purity of clothing and place. The prayer garment and the ground on which one prostrates must be free from najasa. The third is covering the 'awra — the portions of the body that must be concealed.
            </p>

            <p style={{ fontFamily: F.body, fontSize: '0.9rem', color: C.charcoal, lineHeight: 1.9, margin: '0 0 1.5rem', opacity: 0.85 }}>
              The fourth condition is facing the qibla — the direction of Masjid al-Haram in Makkah. The fifth is that the prayer is performed within its prescribed time. And the sixth — often underemphasised in popular discourse — is the niyyah: the intention of the heart that distinguishes worship from habit. Without it, the physical acts carry no legal or spiritual weight.
            </p>

            <p style={{ fontFamily: F.body, fontSize: '0.9rem', color: C.charcoal, lineHeight: 1.9, margin: 0, opacity: 0.85 }}>
              For detailed rulings on each condition — and the legitimate dispensations that apply in travel, illness, and extreme circumstances — the student of knowledge is encouraged to consult the works of their own legal school. The Centre's weekly Tafsir and Fiqh circles are open for questions and discussion.
            </p>

            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: `1px solid ${C.gold}22` }}>
              <p style={{ fontFamily: F.body, fontSize: '0.75rem', color: C.gray }}>
                Published: {article.date} · {article.readTime} read · Category: {article.category}
              </p>
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: 100 }}>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.75rem' }}>
                About the Author
              </p>
              <GoldRule />
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', margin: '1rem 0' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: C.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `2px solid ${C.gold}55` }}>
                  <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: '0.9rem', color: C.ivory }}>
                    {article.author.split(' ').filter(w => /^[A-Z]/.test(w)).slice(-2).map(w => w[0]).join('')}
                  </span>
                </div>
                <div>
                  <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.85rem', color: C.charcoal, margin: 0 }}>{article.author}</p>
                  <p style={{ fontFamily: F.body, fontSize: '0.7rem', color: C.gray, margin: 0 }}>Anas bn Malik Islamic Centre</p>
                </div>
              </div>
            </div>

            <div>
              <p style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.75rem' }}>
                Related Articles
              </p>
              <GoldRule />
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                {related.map((r, i) => (
                  <div key={r.id}>
                    <div style={{ padding: '0.85rem 0' }}>
                      <p style={{ fontFamily: F.body, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.3rem' }}>{r.category}</p>
                      <Link to={`/articles/${r.id}`} style={{ fontFamily: F.display, fontWeight: 600, fontSize: '0.85rem', color: C.charcoal, textDecoration: 'none', lineHeight: 1.35, display: 'block', marginBottom: '0.2rem' }}>
                        {r.title}
                      </Link>
                      <p style={{ fontFamily: F.body, fontSize: '0.68rem', color: C.gray, margin: 0 }}>{r.date}</p>
                    </div>
                    {i < related.length - 1 && <div style={{ height: 1, background: C.gold, opacity: 0.14 }} />}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1.25rem', background: C.emerald, borderRadius: 4 }}>
              <p style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gold, margin: '0 0 0.4rem' }}>Join Our Circles</p>
              <p style={{ fontFamily: F.body, fontSize: '0.78rem', color: `${C.ivory}CC`, lineHeight: 1.65, margin: '0 0 0.75rem' }}>
                The Centre holds weekly Tafsir and Fiqh study circles. All are welcome.
              </p>
              <Link to="/events" style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.7rem', color: C.gold, textDecoration: 'none', borderBottom: `1px solid ${C.gold}66` }}>
                See upcoming events →
              </Link>
            </div>
          </aside>

        </div>
      </section>
    </>
  )
}
