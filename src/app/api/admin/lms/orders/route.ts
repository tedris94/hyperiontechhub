import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { canViewOrders } from '@/lib/lmsApi'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const user = await getCurrentUser(request)
  if (!user || !canViewOrders(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'orders',
      sort: '-createdAt',
      limit: 200,
      depth: 2,
      overrideAccess: true,
    })

    return NextResponse.json(
      result.docs.map((o) => ({
        id: o.id,
        reference: o.reference,
        amount: o.amount,
        currency: o.currency,
        status: o.status,
        paidAt: o.paidAt,
        student:
          typeof o.student === 'object' && o.student
            ? { fullName: o.student.fullName, email: o.student.email }
            : null,
        course:
          typeof o.course === 'object' && o.course
            ? { title: o.course.title, slug: o.course.slug }
            : null,
        createdAt: o.createdAt,
      })),
    )
  } catch (e) {
    console.error('[admin/lms/orders GET]', e)
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 })
  }
}
