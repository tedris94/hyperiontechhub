import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { isPlatformAdmin, type SchoolRole } from '@/collections/edusuite/shared'
import { canManageSchoolSettings } from '@/lib/edusuite/access'
import { resolveTenantAccess } from '@/lib/edusuite/tenant'

type Ctx = { params: Promise<{ slug: string }> }

export async function GET(req: NextRequest, ctx: Ctx) {
  if (!isPayloadEnabled()) return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug } = await ctx.params
  const access = await resolveTenantAccess(user, slug)
  if (!access) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const payload = await getPayloadSingleton()
  const school = await payload.findByID({
    collection: 'schools',
    id: access.school.id,
    depth: 0,
    user,
    overrideAccess: isPlatformAdmin(user),
  })

  return NextResponse.json({
    school,
    membership: access.membership
      ? { schoolRole: access.membership.schoolRole, status: access.membership.status }
      : null,
    isAdmin: access.isAdmin,
  })
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!isPayloadEnabled()) return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug } = await ctx.params
  const access = await resolveTenantAccess(user, slug)
  if (!access) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const role = access.membership?.schoolRole as SchoolRole | undefined
  if (!canManageSchoolSettings(access.isAdmin, role)) {
    return NextResponse.json({ error: 'Only owners/principals can edit settings' }, { status: 403 })
  }

  const body = await req.json()
  const allowed = [
    'currentTerm',
    'currentSession',
    'city',
    'state',
    'phone',
    'email',
    'settingsNotes',
    'primaryColor',
    'gradingScale',
    'examTerms',
    'academicYears',
    'extraFields',
    'ratingScales',
    'principalName',
    'principalSignatureUrl',
    'principalAutoRemark',
    'passMark',
    'address',
  ] as const

  const data: Record<string, unknown> = {}
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key]
  }

  const payload = await getPayloadSingleton()
  const school = await payload.update({
    collection: 'schools',
    id: access.school.id,
    data,
    user,
    overrideAccess: isPlatformAdmin(user),
  })
  return NextResponse.json({ school })
}
