import crypto from 'crypto'

export function getBunnyConfig() {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID
  const apiKey = process.env.BUNNY_STREAM_API_KEY
  const cdnHostname = process.env.BUNNY_CDN_HOSTNAME
  const tokenAuthKey = process.env.BUNNY_TOKEN_AUTH_KEY

  if (!libraryId || !apiKey || !cdnHostname) {
    throw new Error('Bunny Stream is not configured. Set BUNNY_STREAM_LIBRARY_ID, BUNNY_STREAM_API_KEY, and BUNNY_CDN_HOSTNAME.')
  }

  return { libraryId, apiKey, cdnHostname, tokenAuthKey }
}

export function isBunnyConfigured(): boolean {
  return Boolean(
    process.env.BUNNY_STREAM_LIBRARY_ID &&
      process.env.BUNNY_STREAM_API_KEY &&
      process.env.BUNNY_CDN_HOSTNAME,
  )
}

const BUNNY_API = 'https://video.bunnycdn.com/library'

export async function createBunnyVideo(title: string): Promise<{ guid: string }> {
  const { libraryId, apiKey } = getBunnyConfig()
  const res = await fetch(`${BUNNY_API}/${libraryId}/videos`, {
    method: 'POST',
    headers: {
      AccessKey: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to create Bunny video: ${text}`)
  }

  return res.json() as Promise<{ guid: string }>
}

export async function deleteBunnyVideo(videoId: string): Promise<void> {
  const { libraryId, apiKey } = getBunnyConfig()
  const res = await fetch(`${BUNNY_API}/${libraryId}/videos/${videoId}`, {
    method: 'DELETE',
    headers: { AccessKey: apiKey },
  })

  if (!res.ok && res.status !== 404) {
    const text = await res.text()
    throw new Error(`Failed to delete Bunny video: ${text}`)
  }
}

export async function getBunnyVideo(videoId: string): Promise<{
  guid: string
  title: string
  length: number
  status: number
}> {
  const { libraryId, apiKey } = getBunnyConfig()
  const res = await fetch(`${BUNNY_API}/${libraryId}/videos/${videoId}`, {
    headers: { AccessKey: apiKey },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch Bunny video: ${text}`)
  }

  return res.json()
}

export function getBunnyUploadUrl(videoId: string): string {
  const { libraryId } = getBunnyConfig()
  return `${BUNNY_API}/${libraryId}/videos/${videoId}`
}

export function getBunnyUploadHeaders(): Record<string, string> {
  const { apiKey } = getBunnyConfig()
  return { AccessKey: apiKey }
}

export function getSignedPlaybackUrl(videoId: string, expiresInSeconds = 3600): string {
  const { cdnHostname, tokenAuthKey } = getBunnyConfig()
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds
  const path = `/${videoId}/playlist.m3u8`

  if (!tokenAuthKey) {
    return `https://${cdnHostname}${path}`
  }

  const hash = crypto
    .createHash('sha256')
    .update(tokenAuthKey + path + expires)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  return `https://${cdnHostname}${path}?token=${hash}&expires=${expires}`
}

export function getSignedThumbnailUrl(videoId: string, expiresInSeconds = 3600): string {
  const { cdnHostname, tokenAuthKey } = getBunnyConfig()
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds
  const path = `/${videoId}/thumbnail.jpg`

  if (!tokenAuthKey) {
    return `https://${cdnHostname}${path}`
  }

  const hash = crypto
    .createHash('sha256')
    .update(tokenAuthKey + path + expires)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  return `https://${cdnHostname}${path}?token=${hash}&expires=${expires}`
}
