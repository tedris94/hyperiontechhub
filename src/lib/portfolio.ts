import fallbackCases from '@/content/portfolio-cases.json'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { resolveMediaFromDoc } from '@/lib/mediaUrl'

export type PortfolioCase = {
  id?: string | number
  slug: string
  title: string
  client: string
  industry: string
  category: string
  summary: string
  challenge: string
  solution: string
  results: string[]
  technologies: string[]
  projectUrl: string
  previewImage: string
  /** Use contain + padding when the card image is a crest/logo rather than a UI screenshot */
  previewFit?: 'cover' | 'contain'
  logo: string
  logoSecondary?: string
  brandColors: string[]
  featured: boolean
  sortOrder: number
}

type FallbackCase = (typeof fallbackCases)[number]

function fromFallback(c: FallbackCase): PortfolioCase {
  const fallbackWithExtras = c as typeof c & { previewFit?: string; logoSecondary?: string }

  return {
    slug: c.slug,
    title: c.title,
    client: c.client,
    industry: c.industry,
    category: c.category,
    summary: c.summary,
    challenge: c.challenge,
    solution: c.solution,
    results: [...c.results],
    technologies: [...c.technologies],
    projectUrl: c.projectUrl || '',
    previewImage: c.previewImage,
    previewFit: fallbackWithExtras.previewFit === 'contain' ? 'contain' : 'cover',
    logo: c.logo,
    logoSecondary: typeof fallbackWithExtras.logoSecondary === 'string' ? fallbackWithExtras.logoSecondary : undefined,
    brandColors: [...(c.brandColors || [])],
    featured: Boolean(c.featured),
    sortOrder: c.sortOrder,
  }
}

function mapDoc(doc: Record<string, unknown>): PortfolioCase {
  const slug = String(doc.slug || '')
  const fallback = fallbackCases.find((c) => c.slug === slug)

  const resultsRaw = Array.isArray(doc.results) ? doc.results : []
  const results = resultsRaw
    .map((r) => (typeof r === 'object' && r && 'item' in r ? String((r as { item: unknown }).item) : ''))
    .filter(Boolean)

  const techRaw = Array.isArray(doc.technologies) ? doc.technologies : []
  const technologies = techRaw
    .map((t) => (typeof t === 'object' && t && 'name' in t ? String((t as { name: unknown }).name) : ''))
    .filter(Boolean)

  const colorsRaw = Array.isArray(doc.brandColors) ? doc.brandColors : []
  const brandColors = colorsRaw
    .map((c) =>
      typeof c === 'object' && c && 'color' in c ? String((c as { color: unknown }).color) : '',
    )
    .filter(Boolean)

  const logoUpload = resolveMediaFromDoc(
    doc.logo as { url?: string | null; filename?: string | null } | number | null | undefined,
  )
  const previewUpload = resolveMediaFromDoc(
    doc.featuredImage as { url?: string | null; filename?: string | null } | number | null | undefined,
  )

  const logoPath = typeof doc.logoPath === 'string' ? doc.logoPath.trim() : ''
  const previewPath = typeof doc.previewImagePath === 'string' ? doc.previewImagePath.trim() : ''

  return {
    id: doc.id as string | number | undefined,
    slug,
    title: String(doc.title || fallback?.title || ''),
    client: String(doc.client || fallback?.client || ''),
    industry: String(doc.industry || fallback?.industry || 'other'),
    category: String(doc.category || fallback?.category || ''),
    summary: String(doc.summary || fallback?.summary || ''),
    challenge: String(doc.challenge || fallback?.challenge || ''),
    solution: String(doc.solution || fallback?.solution || ''),
    results: results.length ? results : [...(fallback?.results || [])],
    technologies: technologies.length ? technologies : [...(fallback?.technologies || [])],
    projectUrl: String(doc.projectUrl || fallback?.projectUrl || ''),
    // Prefer JSON/static brand assets so portfolio logos stay in sync with content files
    previewImage: fallback?.previewImage || previewUpload || previewPath || '',
    previewFit: fallback && 'previewFit' in fallback && fallback.previewFit === 'contain' ? 'contain' : 'cover',
    logo: fallback?.logo || logoUpload || logoPath || '',
    logoSecondary:
      fallback && 'logoSecondary' in fallback && typeof (fallback as { logoSecondary?: unknown }).logoSecondary === 'string'
        ? (fallback as { logoSecondary: string }).logoSecondary
        : undefined,
    brandColors: brandColors.length ? brandColors : [...(fallback?.brandColors || [])],
    featured: Boolean(doc.featured ?? fallback?.featured),
    sortOrder: Number(doc.sortOrder ?? fallback?.sortOrder ?? 0),
  }
}

/** Sync fallback for components that cannot await (prefer getPortfolioCasesAsync). */
export function getPortfolioCases(): PortfolioCase[] {
  return fallbackCases.map(fromFallback).sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getPortfolioCase(slug: string): PortfolioCase | undefined {
  return getPortfolioCases().find((c) => c.slug === slug)
}

export async function getPortfolioCasesAsync(): Promise<PortfolioCase[]> {
  if (!isPayloadEnabled()) return getPortfolioCases()

  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'portfolio-items',
      limit: 100,
      sort: 'sortOrder',
      depth: 1,
      overrideAccess: true,
    })

    if (!result.docs.length) return getPortfolioCases()

    const fromCms = result.docs.map((d) => mapDoc(d as unknown as Record<string, unknown>))
    const cmsSlugs = new Set(fromCms.map((c) => c.slug))

    // Keep JSON-only cases that are not yet seeded in CMS
    const missing = getPortfolioCases().filter((c) => !cmsSlugs.has(c.slug))
    return [...fromCms, ...missing].sort((a, b) => a.sortOrder - b.sortOrder)
  } catch (e) {
    console.error('[portfolio] CMS load failed, using JSON fallback', e)
    return getPortfolioCases()
  }
}

export async function getPortfolioCaseAsync(slug: string): Promise<PortfolioCase | undefined> {
  const all = await getPortfolioCasesAsync()
  return all.find((c) => c.slug === slug)
}
