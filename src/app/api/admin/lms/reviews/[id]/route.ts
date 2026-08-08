import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { updateCourseRating } from '@/lib/lms/reviews'
import { canModerateReviews } from '@/lib/lmsApi'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Props = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Props) {
  const user = await getCurrentUser(request)
  if (!user || !canModerateReviews(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = (await request.json()) as { status?: 'approved' | 'rejected' }
    if (!body.status) {
      return NextResponse.json({ error: 'status is required' }, { status: 400 })
    }

    const payload = await getPayloadSingleton()
    const updated = await payload.update({
      collection: 'reviews',
      id: Number(id),
      data: { status: body.status },
      overrideAccess: true,
      depth: 0,
    })

    const courseId =
      typeof updated.course === 'number' ? updated.course : updated.course?.id
    if (courseId) {
      await updateCourseRating(payload, courseId)
    }

    return NextResponse.json(updated)
  } catch (e) {
    console.error('[admin/lms/reviews/id PATCH]', e)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}
