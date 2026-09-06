/**
 * Minimal Supabase Storage REST helpers (no @supabase/supabase-js dependency).
 * Used for ICMS uploads on Vercel where the local filesystem is ephemeral.
 */

const DEFAULT_BUCKET = 'icms'

export function isSupabaseStorageConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())
}

function supabaseConfig() {
  const baseUrl = process.env.SUPABASE_URL?.trim()?.replace(/\/$/, '')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!baseUrl || !serviceKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for storage uploads')
  }
  return {
    baseUrl,
    serviceKey,
    bucket: process.env.ICMS_STORAGE_BUCKET?.trim() || DEFAULT_BUCKET,
  }
}

async function ensurePublicBucket(baseUrl: string, serviceKey: string, bucket: string) {
  const res = await fetch(`${baseUrl}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: bucket,
      name: bucket,
      public: true,
      file_size_limit: 12 * 1024 * 1024,
    }),
  })

  if (res.ok || res.status === 200) return

  // Already exists is fine (409 / duplicate message)
  const text = await res.text().catch(() => '')
  if (res.status === 409 || /already exists|duplicate/i.test(text)) return

  // GET to confirm it exists even if create failed for another reason
  const check = await fetch(`${baseUrl}/storage/v1/bucket/${bucket}`, {
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
    },
  })
  if (check.ok) return

  throw new Error(`Failed to ensure storage bucket "${bucket}": ${res.status} ${text}`)
}

/** Upload bytes to a public Supabase Storage object; returns the public URL. */
export async function uploadPublicObject(opts: {
  objectPath: string
  body: Buffer
  contentType: string
  upsert?: boolean
}): Promise<string> {
  const { baseUrl, serviceKey, bucket } = supabaseConfig()
  await ensurePublicBucket(baseUrl, serviceKey, bucket)

  const objectPath = opts.objectPath.replace(/^\/+/, '')
  const res = await fetch(
    `${baseUrl}/storage/v1/object/${bucket}/${objectPath}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        'Content-Type': opts.contentType,
        'x-upsert': opts.upsert === false ? 'false' : 'true',
      },
      body: new Uint8Array(opts.body),
    },
  )

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Supabase storage upload failed: ${res.status} ${text}`)
  }

  return `${baseUrl}/storage/v1/object/public/${bucket}/${objectPath}`
}
