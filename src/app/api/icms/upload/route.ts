import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { getCurrentUser } from '@/lib/auth'
import { resolveIcmsAccess, hasCapability } from '@/lib/icms/access'
import { isSupabaseStorageConfigured, uploadPublicObject } from '@/lib/supabaseStorage'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const MAX_BYTES = 12 * 1024 * 1024

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
  'image/bmp',
  'image/x-ms-bmp',
  'image/tiff',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'image/heic',
  'image/heif',
])

const EXT_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  bmp: 'image/bmp',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  ico: 'image/x-icon',
  heic: 'image/heic',
  heif: 'image/heif',
}

function slugifyFilename(name: string) {
  return name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
}

function extOf(name: string) {
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/)
  return m?.[1] || ''
}

function isSvg(mime: string, ext: string, buffer: Buffer) {
  if (mime === 'image/svg+xml' || ext === 'svg') return true
  const head = buffer.subarray(0, 256).toString('utf8').trimStart()
  return head.startsWith('<svg') || (head.startsWith('<?xml') && head.includes('<svg'))
}

/** Upload an image for ICMS; prefers AVIF for rasters, keeps SVG as-is. */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const form = await req.formData()
    const tenantSlug = String(form.get('tenantSlug') || '').trim()
    const file = form.get('file')
    if (!tenantSlug) {
      return NextResponse.json({ error: 'tenantSlug required' }, { status: 400 })
    }
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const access = await resolveIcmsAccess(user, tenantSlug)
    if (
      !access ||
      !(
        hasCapability(access.role, 'pages') ||
        hasCapability(access.role, 'content') ||
        hasCapability(access.role, 'settings') ||
        hasCapability(access.role, 'leadership')
      )
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const blob = file as File
    if (blob.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 12MB)' }, { status: 400 })
    }

    const ext = extOf(blob.name || '')
    let mime = (blob.type || '').toLowerCase()
    if (!mime || mime === 'application/octet-stream') {
      mime = EXT_MIME[ext] || mime
    }
    if (!ALLOWED_MIME.has(mime) && !mime.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Unsupported file type. Use JPG, PNG, WebP, AVIF, GIF, SVG, BMP, TIFF, or HEIC.' },
        { status: 400 },
      )
    }

    const buffer = Buffer.from(await blob.arrayBuffer())
    const base = slugifyFilename(blob.name || 'image') || 'image'
    const stamp = Date.now()
    const relDir = path.join('icms', 'uploads', tenantSlug)

    let filename: string
    let outBuffer: Buffer
    let contentType: string

    if (isSvg(mime, ext, buffer)) {
      filename = `${base}-${stamp}.svg`
      outBuffer = buffer
      contentType = 'image/svg+xml'
    } else {
      try {
        filename = `${base}-${stamp}.avif`
        outBuffer = await sharp(buffer)
          .rotate()
          .resize({ width: 1920, withoutEnlargement: true })
          .avif({ quality: 55, effort: 4 })
          .toBuffer()
        contentType = 'image/avif'
      } catch (convertErr) {
        console.warn('[icms/upload] AVIF convert failed, trying PNG', convertErr)
        try {
          filename = `${base}-${stamp}.png`
          outBuffer = await sharp(buffer)
            .rotate()
            .resize({ width: 1920, withoutEnlargement: true })
            .png({ quality: 90 })
            .toBuffer()
          contentType = 'image/png'
        } catch {
          const keepExt = EXT_MIME[ext] ? ext : 'img'
          filename = `${base}-${stamp}.${keepExt}`
          outBuffer = buffer
          contentType = mime || 'application/octet-stream'
        }
      }
    }

    // Vercel (and any host with Supabase) — durable public object storage.
    // Local without Supabase — write under public/ for Next static serving.
    if (isSupabaseStorageConfigured()) {
      const objectPath = `${relDir.replace(/\\/g, '/')}/${filename}`
      const url = await uploadPublicObject({
        objectPath,
        body: outBuffer,
        contentType,
      })
      return NextResponse.json({ url, filename })
    }

    if (process.env.VERCEL === '1') {
      return NextResponse.json(
        {
          error:
            'Image storage is not configured for this deployment. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
        },
        { status: 503 },
      )
    }

    const absDir = path.join(process.cwd(), 'public', relDir)
    await fs.mkdir(absDir, { recursive: true })
    await fs.writeFile(path.join(absDir, filename), outBuffer)
    const url = `/${relDir.replace(/\\/g, '/')}/${filename}`
    return NextResponse.json({ url, filename })
  } catch (e) {
    console.error('[icms/upload POST]', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Upload failed' },
      { status: 500 },
    )
  }
}
