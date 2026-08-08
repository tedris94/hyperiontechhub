import { C, F } from '@/tokens'
import { GoldRule, SectionLabel, SectionHeading, PageHero } from '@/components/Shared'
import { Link } from 'react-router'

export type Article = {
  id: number
  category: string
  title: string
  author: string
  date: string
  readTime: string
  excerpt: string
  photo: string
}

export const ARTICLES_DATA: Article[] = [
  {
    id: 1,
    category: 'Fiqh',
    title: 'The Conditions for a Valid Salah: A Practical Review',
    author: 'Sheikh Musa Abdullahi',
    date: '28 Jul 2026',
    readTime: '6 min',
    excerpt: 'A structured overview of the prerequisites that must be met before a prayer is considered sound — covering purity, direction, time, and intention according to classical scholarship. Drawn from the Maliki and Hanafi traditions with attention to what is agreed upon by all four schools.',
    photo: 'https://images.unsplash.com/photo-1542414110-ae27fdb87ee1?w=800&h=500&fit=crop&auto=format',
  },
  {
    id: 2,
    category: 'Tarbiyah',
    title: 'Raising Children with Islamic Identity in a Secular City',
    author: 'Hajia Fatimah Yusuf',
    date: '20 Jul 2026',
    readTime: '8 min',
    excerpt: 'Practical strategies for parents navigating modern Abuja while nurturing deen-conscious households. The challenge is real — and the solutions are grounded in Sunnah practice, community, and the patient example of the early Muslim families who raised scholars in difficult circumstances.',
    photo: 'https://images.unsplash.com/photo-1606981693736-62d6c4954ba5?w=800&h=500&fit=crop&auto=format',
  },
  {
    id: 3,
    category: 'Community',
    title: 'Waqf in West Africa: A Reviving Institution',
    author: 'Alhaji Umar Bello',
    date: '10 Jul 2026',
    readTime: '5 min',
    excerpt: 'How Islamic endowments are experiencing a measured renaissance across Nigeria and what that means for Muslim institutions in Abuja. A look at historical precedents, current models in Lagos and Kano, and the long-term vision for a self-sustaining Islamic economy.',
    photo: 'https://images.unsplash.com/photo-1558114965-eeb97aa84c3b?w=800&h=500&fit=crop&auto=format',
  },
  {
    id: 4,
    category: 'Aqeedah',
    title: "The Names of Allah: Al-Razzaq and the Question of Provision",
    author: 'Sheikh Ibrahim al-Amin',
    date: '2 Jul 2026',
    readTime: '7 min',
    excerpt: 'A contemplative study of the Divine Name al-Razzaq — The Provider. What does it mean that all provision comes from Allah? How do we reconcile this with effort, planning, and the unequal distribution of resources we observe in the world? A careful, non-polemical engagement.',
    photo: 'https://images.unsplash.com/photo-1521241191669-b9fba071b073?w=800&h=500&fit=crop&auto=format',
  },
  {
    id: 5,
    category: 'Youth',
    title: 'On Finding Purpose Before You Find a Career',
    author: 'Mallam Ridwan Suleiman',
    date: '22 Jun 2026',
    readTime: '5 min',
    excerpt: 'A frank address to young Muslims in Abuja navigating university, job markets, and the pressure to define themselves by what they do rather than who they are. Grounded in Prophetic guidance on intention and the Islamic concept of khilafah as personal responsibility.',
    photo: 'https://images.unsplash.com/photo-1698967406711-ede239b6c07e?w=800&h=500&fit=crop&auto=format',
  },
]

const CATEGORIES = ['All', ...Array.from(new Set(ARTICLES_DATA.map(a => a.category)))]

import { useState } from 'react'

export default function Articles() {
  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? ARTICLES_DATA : ARTICLES_DATA.filter(a => a.category === cat)

  return (
    <>
      <PageHero
        title="Articles"
        subtitle="Knowledge, reflection, and commentary from the scholars and community of Anas bn Malik Islamic Centre."
      />

      <section style={{ background: C.ivory, padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                style={{
                  fontFamily: F.body, fontWeight: 500, fontSize: '0.73rem', letterSpacing: '0.08em',
                  padding: '0.4rem 1rem', borderRadius: 3,
                  border: `1px solid ${cat === c ? C.gold : `${C.gold}44`}`,
                  background: cat === c ? C.gold : 'transparent',
                  color: cat === c ? C.forest : C.gray,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Article list */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((article, i) => (
              <div key={article.id}>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', padding: '2rem 0', alignItems: 'start' }}>
                  {/* Photo */}
                  <div style={{ height: 130, borderRadius: 3, overflow: 'hidden', background: C.forest, flexShrink: 0 }}>
                    <img src={article.photo} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* Content */}
                  <div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontFamily: F.body, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold }}>{article.category}</span>
                      <span style={{ width: 3, height: 3, borderRadius: '50%', background: C.gold, opacity: 0.5, display: 'inline-block' }} />
                      <span style={{ fontFamily: F.body, fontSize: '0.7rem', color: C.gray }}>{article.date}</span>
                      <span style={{ fontFamily: F.body, fontSize: '0.7rem', color: `${C.gray}88` }}>· {article.readTime} read</span>
                    </div>

                    <h3 style={{ fontFamily: F.display, fontWeight: 600, fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)', color: C.charcoal, margin: '0 0 0.4rem', lineHeight: 1.3 }}>
                      {article.title}
                    </h3>

                    <p style={{ fontFamily: F.body, fontSize: '0.72rem', color: C.gold, margin: '0 0 0.65rem' }}>
                      By {article.author}
                    </p>

                    <p style={{ fontFamily: F.body, fontSize: '0.83rem', color: C.gray, lineHeight: 1.7, margin: '0 0 1rem', maxWidth: 560 }}>
                      {article.excerpt}
                    </p>

                    <Link to={`/articles/${article.id}`} style={{ fontFamily: F.body, fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.08em', color: C.emerald, textDecoration: 'none', borderBottom: `1px solid ${C.emerald}55` }}>
                      Read article →
                    </Link>
                  </div>
                </div>
                {i < filtered.length - 1 && <div style={{ height: 1, background: C.gold, opacity: 0.15 }} />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
