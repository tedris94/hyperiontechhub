import { NextRequest, NextResponse } from 'next/server'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { getCurrentUser } from '@/lib/auth'
import { isPlatformAdmin } from '@/collections/edusuite/shared'
import { resolveTenantAccess } from '@/lib/edusuite/tenant'

const ALLOWED = new Set([
  'edu-students',
  'edu-classes',
  'edu-subjects',
  'edu-groups',
  'edu-staff',
  'edu-attendance',
  'edu-exams',
  'edu-marks',
  'edu-results',
  'edu-exam-results',
  'edu-class-teachers',
  'edu-fee-structures',
  'edu-invoices',
  'edu-fee-waivers',
  'edu-notices',
  'edu-library-books',
  'edu-library-issues',
  'edu-transport-routes',
  'edu-hostel-rooms',
  'edu-inventory-items',
  'edu-documents',
  'edu-events',
  'edu-alumni',
  'edu-learning-materials',
  'schools',
  'school-memberships',
])

export async function GET(req: NextRequest) {
  if (!isPayloadEnabled()) {
    return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  }
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const collection = req.nextUrl.searchParams.get('collection') || ''
  const schoolId = req.nextUrl.searchParams.get('schoolId')
  const schoolSlug = req.nextUrl.searchParams.get('schoolSlug') || ''
  if (!ALLOWED.has(collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
  }

  if (schoolSlug && collection !== 'schools') {
    const access = await resolveTenantAccess(user, schoolSlug)
    if (!access) return NextResponse.json({ error: 'Forbidden for this school' }, { status: 403 })
    if (schoolId && String(access.school.id) !== String(schoolId)) {
      return NextResponse.json({ error: 'School mismatch' }, { status: 403 })
    }
  } else if (collection === 'schools' && !isPlatformAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  } else if (collection !== 'schools' && !isPlatformAdmin(user) && !schoolId) {
    return NextResponse.json({ error: 'schoolId or schoolSlug required' }, { status: 400 })
  }

  const payload = await getPayloadSingleton()
  const where =
    collection === 'schools' || !schoolId
      ? undefined
      : { school: { equals: isNaN(Number(schoolId)) ? schoolId : Number(schoolId) } }

  const result = await payload.find({
    collection: collection as 'edu-students',
    where,
    limit: 100,
    sort: '-updatedAt',
    depth: 0,
    overrideAccess: isPlatformAdmin(user),
    user,
  })

  return NextResponse.json({ docs: result.docs })
}

export async function POST(req: NextRequest) {
  if (!isPayloadEnabled()) {
    return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  }
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const collection = String(body.collection || '')
  const schoolSlug = body.schoolSlug ? String(body.schoolSlug) : ''
  const data = { ...(body.data as Record<string, unknown>) }

  if (!ALLOWED.has(collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
  }

  if (schoolSlug && collection !== 'schools') {
    const access = await resolveTenantAccess(user, schoolSlug)
    if (!access) return NextResponse.json({ error: 'Forbidden for this school' }, { status: 403 })
    data.school = access.school.id
  } else if (collection !== 'schools' && !isPlatformAdmin(user)) {
    return NextResponse.json({ error: 'schoolSlug required' }, { status: 400 })
  }

  const payload = await getPayloadSingleton()
  const doc = await payload.create({
    collection: collection as 'edu-students',
    data: data as never,
    user,
    overrideAccess: isPlatformAdmin(user),
  })
  return NextResponse.json({ doc })
}

export async function PATCH(req: NextRequest) {
  if (!isPayloadEnabled()) {
    return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  }
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const collection = String(body.collection || '')
  const id = body.id
  const schoolSlug = body.schoolSlug ? String(body.schoolSlug) : ''
  const data = { ...(body.data as Record<string, unknown>) }
  delete data.school

  if (!ALLOWED.has(collection) || id == null) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (schoolSlug) {
    const access = await resolveTenantAccess(user, schoolSlug)
    if (!access) return NextResponse.json({ error: 'Forbidden for this school' }, { status: 403 })
  }

  const payload = await getPayloadSingleton()
  const doc = await payload.update({
    collection: collection as 'edu-students',
    id,
    data: data as never,
    user,
    overrideAccess: isPlatformAdmin(user),
  })
  return NextResponse.json({ doc })
}

export async function DELETE(req: NextRequest) {
  if (!isPayloadEnabled()) {
    return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  }
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const collection = String(body.collection || '')
  const id = body.id
  const schoolSlug = body.schoolSlug ? String(body.schoolSlug) : ''
  if (!ALLOWED.has(collection) || id == null) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (schoolSlug) {
    const access = await resolveTenantAccess(user, schoolSlug)
    if (!access) return NextResponse.json({ error: 'Forbidden for this school' }, { status: 403 })

    const payload = await getPayloadSingleton()
    const existing = await payload.findByID({
      collection: collection as 'edu-students',
      id,
      depth: 0,
      user,
      overrideAccess: isPlatformAdmin(user),
    })
    if (existing && collection !== 'schools') {
      const sid = (existing as { school?: unknown }).school
      if (sid != null && String(sid) !== String(access.school.id)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }
    await payload.delete({
      collection: collection as 'edu-students',
      id,
      user,
      overrideAccess: isPlatformAdmin(user),
    })
    return NextResponse.json({ ok: true })
  }

  if (!isPlatformAdmin(user)) {
    return NextResponse.json({ error: 'schoolSlug required' }, { status: 400 })
  }

  const payload = await getPayloadSingleton()
  await payload.delete({
    collection: collection as 'edu-students',
    id,
    user,
    overrideAccess: true,
  })
  return NextResponse.json({ ok: true })
}
