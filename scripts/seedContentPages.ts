import type { Payload } from 'payload'

type Lex = Record<string, unknown>

function txt(text: string, bold = false): Lex {
  return { type: 'text', detail: 0, format: bold ? 1 : 0, mode: 'normal', style: '', text, version: 1 }
}

function para(children: Lex[] | string): Lex {
  const kids = typeof children === 'string' ? [txt(children)] : children
  return { type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, children: kids }
}

function heading(text: string, tag: 'h2' | 'h3' = 'h2'): Lex {
  return { type: 'heading', tag, format: '', indent: 0, version: 1, direction: 'ltr', children: [txt(text)] }
}

function doc(children: Lex[]): Lex {
  return { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children } }
}

const pageHeader = (opts: {
  title: string
  subtitle?: string
  icon?: string
  align?: 'center' | 'left'
}): Lex => ({
  blockType: 'pageHeader',
  title: opts.title,
  subtitle: opts.subtitle,
  icon: opts.icon,
  align: opts.align ?? 'center',
  showBreadcrumb: false,
})

const richText = (children: Lex[]): Lex => ({
  blockType: 'richText',
  variant: 'prose',
  content: doc(children),
})

function basicPageLayout(title: string, paragraphs: string[]) {
  return [
    pageHeader({ title, subtitle: 'Hyperion Tech Hub' }),
    richText(paragraphs.map((p) => para(p))),
  ]
}

const PAGE_DEFINITIONS = [
  {
    slug: 'about',
    title: 'About Us',
    metaTitle: 'About Us | Hyperion Tech Hub',
    metaDescription: 'Abuja digital partner for schools and SMEs — EduSuite, SME Kits, Hyperion Care, and training.',
    layout: basicPageLayout('About Us', [
      'Hyperion Tech Hub is Abuja’s trusted digital partner for schools and growing SMEs. We build, host, train on, and support systems — EduSuite for schools, SME Digital Business Kits, Hyperion Care retainers, and skills training.',
      'Walk-in repairs and printing keep our Kubwa hub useful locally. Our brand identity is named case studies and recurring support — not a generic one-stop shop.',
    ]),
  },
  {
    slug: 'services',
    title: 'Our Services',
    metaTitle: 'Services | Hyperion Tech Hub',
    metaDescription: 'EduSuite, SME Kits, Hyperion Care retainers, and training from Hyperion Tech Hub.',
    layout: basicPageLayout('Our Services', [
      'Our public pillars are Hyperion EduSuite (school OS), SME Digital Business Kit, Hyperion Care managed retainers, and training/LMS. Custom software is available when a kit is not enough. Hub walk-in services (repairs, printing) remain cash-side convenience.',
      'Explore products at /products/edusuite, /products/sme-kit, and /products/hyperion-care — or start at /get-started.',
    ]),
  },
  {
    slug: 'team',
    title: 'Our Team',
    metaTitle: 'Team | Hyperion Tech Hub',
    metaDescription: 'Meet the Hyperion Tech Hub team.',
    layout: basicPageLayout('Our Team', [
      'Our team brings together experienced instructors, consultants, and engineers dedicated to delivering excellence for schools and SMEs.',
    ]),
  },
  {
    slug: 'portfolio',
    title: 'Portfolio',
    metaTitle: 'Portfolio | Hyperion Tech Hub',
    metaDescription: 'Named school and SME case studies from Hyperion Tech Hub.',
    layout: basicPageLayout('Portfolio', [
      'See our live case studies at /portfolio — Bright Olivelight Schools, Haqqul Mubeen Islamic Schools, and Fizam Table Water.',
    ]),
  },
  {
    slug: 'training',
    title: 'Training',
    metaTitle: 'Training | Hyperion Tech Hub',
    metaDescription: 'Corporate and career technology training at Hyperion Tech Hub, Abuja.',
    layout: basicPageLayout('Training Programs', [
      'Paid cohorts and corporate workshops — Web, React, WordPress, AI-for-business, and cybersecurity basics — delivered at our Kubwa hub and on the LMS.',
    ]),
  },
  {
    slug: 'courses',
    title: 'Courses',
    metaTitle: 'Courses | Hyperion Tech Hub',
    metaDescription: 'Browse technology courses at Hyperion Tech Hub.',
    layout: basicPageLayout('Courses', [
      'Structured courses for beginners and professionals looking to advance their technology careers.',
    ]),
  },
  {
    slug: 'consultancy',
    title: 'Consultancy',
    metaTitle: 'Consultancy | Hyperion Tech Hub',
    metaDescription: 'IT and technology consultancy services from Hyperion Tech Hub.',
    layout: basicPageLayout('Consultancy', [
      'Strategic technology consultancy to help your organization plan, build, and scale digital solutions.',
    ]),
  },
  {
    slug: 'faq',
    title: 'FAQ',
    metaTitle: 'FAQ | Hyperion Tech Hub',
    metaDescription: 'Frequently asked questions about Hyperion Tech Hub services.',
    layout: basicPageLayout('Frequently Asked Questions', [
      'Find answers to common questions about our services, training programs, and consultancy offerings.',
    ]),
  },
  {
    slug: 'help-center',
    title: 'Help Center',
    metaTitle: 'Help Center | Hyperion Tech Hub',
    metaDescription: 'Get help and support from Hyperion Tech Hub.',
    layout: basicPageLayout('Help Center', [
      'Need assistance? Browse our help resources or contact our team for support.',
    ]),
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    metaTitle: 'Privacy Policy | Hyperion Tech Hub',
    metaDescription: 'Privacy policy for hyperiontechhub.com.',
    layout: [
      pageHeader({ title: 'Privacy Policy', subtitle: 'Last updated: 2026' }),
      richText([
        heading('Information we collect'),
        para('We collect information you provide when contacting us, booking consultations, or applying for careers.'),
        heading('How we use your data'),
        para('We use your information to respond to inquiries, deliver services, and improve our website.'),
        heading('Contact'),
        para('For privacy questions, contact us at privacy@hyperiontechhub.com.'),
      ]),
    ],
  },
]

export async function seedContentPages(payload: Payload) {
  for (const page of PAGE_DEFINITIONS) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.totalDocs > 0) continue

    await payload.create({
      collection: 'pages',
      data: {
        title: page.title,
        slug: page.slug,
        status: 'published',
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        layout: page.layout,
      } as never,
      overrideAccess: true,
    })
    console.log(`Seeded page: /${page.slug}`)
  }
}
