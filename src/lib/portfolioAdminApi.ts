import { resolveMediaFromDoc } from '@/lib/mediaUrl'

export function mediaIdForPayload(
  id: number | string | null | undefined,
): number | null | undefined {
  if (id === undefined) return undefined
  if (id === null || id === '') return null
  const n = typeof id === 'number' ? id : Number(id)
  return Number.isFinite(n) ? n : undefined
}

export function mediaIdFromDoc(
  media: { id?: number | string } | number | null | undefined,
) {
  if (!media) return null
  if (typeof media === 'object') return media.id ?? null
  return media
}

export function toPortfolioAdminResponse(doc: Record<string, unknown>) {
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

  const logo = doc.logo as { id?: number | string; url?: string | null; filename?: string | null } | number | null
  const featuredImage = doc.featuredImage as
    | { id?: number | string; url?: string | null; filename?: string | null }
    | number
    | null

  return {
    id: doc.id as string | number,
    title: String(doc.title || ''),
    slug: String(doc.slug || ''),
    client: String(doc.client || ''),
    industry: String(doc.industry || 'other'),
    category: String(doc.category || ''),
    summary: String(doc.summary || ''),
    challenge: String(doc.challenge || ''),
    solution: String(doc.solution || ''),
    results,
    technologies,
    projectUrl: String(doc.projectUrl || ''),
    logoPath: String(doc.logoPath || ''),
    previewImagePath: String(doc.previewImagePath || ''),
    brandColors,
    featured: Boolean(doc.featured),
    sortOrder: Number(doc.sortOrder ?? 0),
    logoId: mediaIdFromDoc(logo),
    logoUrl: resolveMediaFromDoc(logo),
    featuredImageId: mediaIdFromDoc(featuredImage),
    featuredImageUrl: resolveMediaFromDoc(featuredImage),
  }
}
