import { ICMS_MEDIA } from '@/lib/icms/media-assets'

export type ShowcaseArticle = {
  id: number
  category: string
  title: string
  author: string
  date: string
  readTime: string
  excerpt: string
  photo: string
  slug: string
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Figma ARTICLES_DATA — presentation showcase (local AVIF assets) */
export const ARTICLES_DATA: ShowcaseArticle[] = [
  {
    id: 1,
    category: 'Fiqh',
    title: 'The Conditions for a Valid Salah: A Practical Review',
    author: 'Sheikh Musa Abdullahi',
    date: '28 Jul 2026',
    readTime: '6 min',
    excerpt:
      'A structured overview of the prerequisites that must be met before a prayer is considered sound — covering purity, direction, time, and intention according to classical scholarship. Drawn from the Maliki and Hanafi traditions with attention to what is agreed upon by all four schools.',
    photo: ICMS_MEDIA.salah,
    slug: slugify('The Conditions for a Valid Salah: A Practical Review'),
  },
  {
    id: 2,
    category: 'Tarbiyah',
    title: 'Raising Children with Islamic Identity in a Secular City',
    author: 'Hajia Fatimah Yusuf',
    date: '20 Jul 2026',
    readTime: '8 min',
    excerpt:
      'Practical strategies for parents navigating modern Abuja while nurturing deen-conscious households. The challenge is real — and the solutions are grounded in Sunnah practice, community, and the patient example of the early Muslim families who raised scholars in difficult circumstances.',
    photo: ICMS_MEDIA.children,
    slug: slugify('Raising Children with Islamic Identity in a Secular City'),
  },
  {
    id: 3,
    category: 'Community',
    title: 'Waqf in West Africa: A Reviving Institution',
    author: 'Alhaji Umar Bello',
    date: '10 Jul 2026',
    readTime: '5 min',
    excerpt:
      'How Islamic endowments are experiencing a measured renaissance across Nigeria and what that means for Muslim institutions in Abuja. A look at historical precedents, current models in Lagos and Kano, and the long-term vision for a self-sustaining Islamic economy.',
    photo: ICMS_MEDIA.waqf,
    slug: slugify('Waqf in West Africa: A Reviving Institution'),
  },
  {
    id: 4,
    category: 'Aqeedah',
    title: 'The Names of Allah: Al-Razzaq and the Question of Provision',
    author: 'Sheikh Ibrahim al-Amin',
    date: '2 Jul 2026',
    readTime: '7 min',
    excerpt:
      'A contemplative study of the Divine Name al-Razzaq — The Provider. What does it mean that all provision comes from Allah? How do we reconcile this with effort, planning, and the unequal distribution of resources we observe in the world? A careful, non-polemical engagement.',
    photo: ICMS_MEDIA.community,
    slug: slugify('The Names of Allah: Al-Razzaq and the Question of Provision'),
  },
  {
    id: 5,
    category: 'Youth',
    title: 'On Finding Purpose Before You Find a Career',
    author: 'Mallam Ridwan Suleiman',
    date: '22 Jun 2026',
    readTime: '5 min',
    excerpt:
      'A frank address to young Muslims in Abuja navigating university, job markets, and the pressure to define themselves by what they do rather than who they are. Grounded in Prophetic guidance on intention and the Islamic concept of khilafah as personal responsibility.',
    photo: ICMS_MEDIA.ramadan,
    slug: slugify('On Finding Purpose Before You Find a Career'),
  },
]

export const ARTICLE_CATEGORIES = [
  'All',
  ...Array.from(new Set(ARTICLES_DATA.map((a) => a.category))),
]
