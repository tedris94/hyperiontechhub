import { NextResponse } from 'next/server'
import { authorizeCapability } from '@/lib/dashboardAuth'
import { canAssignRole } from '@/lib/roleAssignments'
import { ensureDashboardRolesSeeded, getDashboardRoleBySlug } from '@/lib/resolveCapabilities'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type RouteContext = { params: Promise<{ id: string }> }

function parseId(raw: string): number | string {
  const n = Number(raw)
  return Number.isFinite(n) ? n : raw
}

export async function PUT(request: Request, { params }: RouteContext) {
  const auth = await authorizeCapability(request, 'users.manage')
  if (!auth.ok) return auth.response

  try {
    const { id } = await params
    const body = (await request.json()) as {
      email?: string
      fullName?: string
      role?: string
      password?: string
    }

    const data: Record<string, string> = {}
    if (body.fullName?.trim()) data.fullName = body.fullName.trim()
    if (body.email?.trim()) data.email = body.email.trim().toLowerCase()
    if (body.role?.trim()) data.role = body.role.trim()
    if (body.password?.trim()) data.password = body.password.trim()

    if (body.role?.trim()) {
      await ensureDashboardRolesSeeded()
      if (!canAssignRole(auth.user.role, body.role.trim())) {
        return NextResponse.json({ error: 'Forbidden role assignment.' }, { status: 403 })
      }
      await getDashboardRoleBySlug(body.role.trim())
    }

    const payload = await getPayloadSingleton()
    const updated = await payload.update({
      collection: 'users',
      id: parseId(id),
      data,
      overrideAccess: true,
    })

    return NextResponse.json(updated)
  } catch (e) {
    console.error('[admin/users PUT]', e)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const auth = await authorizeCapability(request, 'users.manage')
  if (!auth.ok) return auth.response

  try {
    const { id } = await params
    const payload = await getPayloadSingleton()
    await payload.delete({ collection: 'users', id: parseId(id), overrideAccess: true })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[admin/users DELETE]', e)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
