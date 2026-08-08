import { NextResponse } from 'next/server'
import type { Where } from 'payload'
import { authorizeCapability } from '@/lib/dashboardAuth'
import { getCurrentUser, isAdminRole } from '@/lib/auth'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const user = await getCurrentUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Super Admin / Admin always get full audit access
  if (!isAdminRole(user.role)) {
    const auth = await authorizeCapability(request, 'audit.view')
    if (!auth.ok) return auth.response
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(Number(searchParams.get('page')) || 1, 1)
  const limit = Math.min(Math.max(Number(searchParams.get('limit')) || 25, 1), 100)
  const action = searchParams.get('action')?.trim() || ''
  const collection = searchParams.get('collection')?.trim() || ''
  const q = searchParams.get('q')?.trim() || ''
  const userEmail = searchParams.get('userEmail')?.trim() || ''

  const and: Where[] = []
  if (action) and.push({ action: { equals: action } })
  if (collection) and.push({ collectionSlug: { equals: collection } })
  if (userEmail) and.push({ userEmail: { contains: userEmail } })
  if (q) {
    and.push({
      or: [
        { userEmail: { contains: q } },
        { title: { contains: q } },
        { documentId: { contains: q } },
        { collectionSlug: { contains: q } },
        { userRole: { contains: q } },
      ],
    })
  }

  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'audit-logs',
      where: and.length ? { and } : undefined,
      sort: '-createdAt',
      page,
      limit,
      overrideAccess: true,
    })

    return NextResponse.json({
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      limit: result.limit,
    })
  } catch (e) {
    console.error('[dashboard/audit GET]', e)
    return NextResponse.json({ error: 'Failed to load audit logs' }, { status: 500 })
  }
}
