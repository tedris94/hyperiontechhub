import { NextResponse } from 'next/server'
import { authorizeCapability } from '@/lib/dashboardAuth'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const auth = await authorizeCapability(request, 'contacts.manage')
  if (!auth.ok) return auth.response

  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'contact-submissions',
      sort: '-createdAt',
      limit: 200,
      overrideAccess: true,
    })
    return NextResponse.json({ docs: result.docs, totalDocs: result.totalDocs })
  } catch (e) {
    console.error('[admin/contacts GET]', e)
    return NextResponse.json({ error: 'Failed to load contacts' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const auth = await authorizeCapability(request, 'contacts.manage')
  if (!auth.ok) return auth.response

  const body = await request.json()
  const { id, ...data } = body
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  try {
    const payload = await getPayloadSingleton()
    const updated = await payload.update({
      collection: 'contact-submissions',
      id,
      data,
      overrideAccess: true,
    })
    return NextResponse.json({ doc: updated })
  } catch (e) {
    console.error('[admin/contacts PATCH]', e)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
