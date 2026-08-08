import { NextResponse } from 'next/server'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!isPayloadEnabled()) {
    return NextResponse.json({ error: 'Applications unavailable' }, { status: 503 })
  }

  let body: {
    jobId?: string | number
    fullName?: string
    email?: string
    phone?: string
    coverLetter?: string
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { jobId, fullName, email, phone, coverLetter } = body
  if (!jobId || !fullName || !email || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const parsedJobId = typeof jobId === 'number' ? jobId : Number(jobId)
  if (!Number.isFinite(parsedJobId)) {
    return NextResponse.json({ error: 'Invalid job id' }, { status: 400 })
  }

  try {
    const payload = await getPayloadSingleton()
    const doc = await payload.create({
      collection: 'applications',
      data: {
        job: parsedJobId,
        fullName,
        email,
        phone,
        coverLetter: coverLetter || undefined,
        status: 'pending',
      },
      overrideAccess: true,
    })
    return NextResponse.json({ success: true, id: doc.id }, { status: 201 })
  } catch (error) {
    console.error('[applications POST]', error)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}
