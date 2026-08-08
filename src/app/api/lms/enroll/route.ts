import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createEnrollment, findEnrollment } from '@/lib/lms/enrollment'
import { getPayloadSingleton } from '@/lib/payload'
import { toEnrollmentResponse } from '@/lib/lmsApi'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const user = await getCurrentUser(request)
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as { courseId?: number; courseSlug?: string }
    const payload = await getPayloadSingleton()

    let courseId = body.courseId
    if (!courseId && body.courseSlug) {
      const found = await payload.find({
        collection: 'courses',
        where: { slug: { equals: body.courseSlug }, status: { equals: 'published' } },
        limit: 1,
        overrideAccess: true,
      })
      courseId = found.docs[0]?.id
    }

    if (!courseId) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const course = await payload.findByID({
      collection: 'courses',
      id: courseId,
      overrideAccess: true,
    })

    if (course.status !== 'published') {
      return NextResponse.json({ error: 'Course is not available' }, { status: 400 })
    }

    const existing = await findEnrollment(payload, user.id, courseId)
    if (existing) {
      return NextResponse.json(toEnrollmentResponse(existing as never, course as never))
    }

    if (!course.isFree && (course.price ?? 0) > 0) {
      return NextResponse.json(
        { error: 'This course requires payment. Use checkout instead.' },
        { status: 402 },
      )
    }

    const enrollment = await createEnrollment(payload, {
      studentId: user.id,
      courseId,
      source: 'free',
    })

    return NextResponse.json(toEnrollmentResponse(enrollment as never, course as never), {
      status: 201,
    })
  } catch (e) {
    console.error('[lms/enroll POST]', e)
    return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 })
  }
}
