export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null
  const trimmed = url.trim()

  if (trimmed.startsWith('/')) return trimmed

  try {
    const parsed = new URL(trimmed)
    if (parsed.pathname.startsWith('/api/media/file/')) {
      return `${parsed.pathname}${parsed.search}`
    }
  } catch {
    if (trimmed.includes('/api/media/file/')) {
      const idx = trimmed.indexOf('/api/media/file/')
      return trimmed.slice(idx)
    }
  }

  return trimmed
}

export function mediaUrlFromFilename(filename: string | null | undefined): string | null {
  if (!filename?.trim()) return null
  return `/api/media/file/${filename.trim()}`
}

export function resolveMediaFromDoc(
  media: { url?: string | null; filename?: string | null } | number | null | undefined,
): string | null {
  if (!media || typeof media !== 'object') return null
  return resolveMediaUrl(media.url) ?? mediaUrlFromFilename(media.filename)
}
