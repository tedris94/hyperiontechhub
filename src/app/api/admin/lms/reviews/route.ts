import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { updateCourseRating } from '@/lib/lms/reviews'
import { canModerateReviews } from '@/lib/lmsApi'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const user = await getCurrentUser(request)
  if (!user || !canModerateReviews(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'reviews',
      sort: '-createdAt',
      limit: 200,
      depth: 2,
      overrideAccess: true,
    })
    return NextResponse.json(result.docs)
  } catch (e) {
    console.error('[admin/lms/reviews GET]', e)
    return NextResponse.json({ error: 'Failed to load reviews' }, { status: 500 })
  }
}
