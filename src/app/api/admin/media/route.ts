import { NextResponse } from 'next/server'
import { authorizeCapability } from '@/lib/dashboardAuth'
import { getPayloadSingleton } from '@/lib/payload'
import { resolveMediaFromDoc } from '@/lib/mediaUrl'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type MediaDoc = {
  id: number | string
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  alt?: string | null
  url?: string | null
  createdAt: string
}

function serialize(doc: MediaDoc) {
  return {
    id: doc.id,
    filename: doc.filename ?? 'file',
    mimeType: doc.mimeType ?? '',
    filesize: doc.filesize ?? 0,
    width: doc.width ?? null,
    height: doc.height ?? null,
    alt: doc.alt ?? '',
    url: resolveMediaFromDoc(doc),
    createdAt: doc.createdAt,
  }
}

export async function GET(request: Request) {
  const auth = await authorizeCapability(request, 'cms.media.manage')
  if (!auth.ok) return auth.response

  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'media',
      limit: 200,
      sort: '-createdAt',
      depth: 0,
      overrideAccess: true,
    })
    return NextResponse.json(
      { docs: (result.docs as MediaDoc[]).map(serialize), totalDocs: result.totalDocs },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
  } catch (e) {
    console.error('[admin/media GET]', e)
    return NextResponse.json({ error: 'Failed to load media' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await authorizeCapability(request, 'cms.media.manage')
  if (!auth.ok) return auth.response

  try {
    const form = await request.formData()
    const file = form.get('file')
    const alt = (form.get('alt') as string | null)?.trim() || ''
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    const blob = file as File
    const buffer = Buffer.from(await blob.arrayBuffer())

    const payload = await getPayloadSingleton()
    const created = (await payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: buffer,
        mimetype: blob.type || 'application/octet-stream',
        name: blob.name || `upload-${Date.now()}`,
        size: buffer.length,
      },
      overrideAccess: true,
    })) as unknown as MediaDoc

    return NextResponse.json({ doc: serialize(created) }, { status: 201 })
  } catch (e) {
    console.error('[admin/media POST]', e)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
