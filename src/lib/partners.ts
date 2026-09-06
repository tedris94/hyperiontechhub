import partners from '@/content/partners.json'

export type Partner = {
  slug: string
  name: string
  tagline: string
  url: string
  logo: string
  logoBg: 'dark' | 'light'
  sortOrder: number
}

export function getPartners(): Partner[] {
  return [...partners]
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      url: p.url || '',
      logo: p.logo,
      logoBg: (p.logoBg === 'light' ? 'light' : 'dark') as Partner['logoBg'],
      sortOrder: p.sortOrder,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder)
}
