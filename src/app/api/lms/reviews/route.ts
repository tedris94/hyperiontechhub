import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { findEnrollment } from '@/lib/lms/enrollment'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const courseId = Number(searchParams.get('courseId'))
  if (!courseId) {
    return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
  }

  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'reviews',
      where: {
        and: [
          { course: { equals: courseId } },
          { status: { equals: 'approved' } },
        ],
      },
      sort: '-createdAt',
      limit: 50,
      depth: 1,
      overrideAccess: true,
    })

    return NextResponse.json(
      result.docs.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        student:
          typeof r.student === 'object' && r.student
            ? { fullName: (r.student as { fullName?: string }).fullName ?? 'Student' }
            : { fullName: 'Student' },
        createdAt: r.createdAt,
      })),
    )
  } catch (e) {
    console.error('[lms/reviews GET]', e)
    return NextResponse.json({ error: 'Failed to load reviews' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser(request)
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      courseId?: number
      rating?: number
      comment?: string
    }

    if (!body.courseId || !body.rating) {
      return NextResponse.json({ error: 'courseId and rating are required' }, { status: 400 })
    }
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const payload = await getPayloadSingleton()
    const enrollment = await findEnrollment(payload, user.id, body.courseId)
    if (!enrollment) {
      return NextResponse.json({ error: 'Must be enrolled to review' }, { status: 403 })
    }

    const existing = await payload.find({
      collection: 'reviews',
      where: {
        and: [
          { course: { equals: body.courseId } },
          { student: { equals: user.id } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs[0]) {
      return NextResponse.json({ error: 'You already reviewed this course' }, { status: 409 })
    }

    const review = await payload.create({
      collection: 'reviews',
      data: {
        course: body.courseId,
        student: user.id,
        rating: body.rating,
        comment: body.comment?.trim() || undefined,
        status: 'pending',
      },
      overrideAccess: true,
    })

    return NextResponse.json({ id: review.id, status: review.status }, { status: 201 })
  } catch (e) {
    console.error('[lms/reviews POST]', e)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
