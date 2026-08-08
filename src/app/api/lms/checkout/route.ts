import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { findEnrollment } from '@/lib/lms/enrollment'
import { getPayloadSingleton } from '@/lib/payload'
import {
  generateOrderReference,
  initializeTransaction,
  isPaystackConfigured,
} from '@/lib/paystack'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const user = await getCurrentUser(request)
  if (!user?.id || !user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isPaystackConfigured()) {
    return NextResponse.json({ error: 'Payments are not configured' }, { status: 503 })
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

    if (course.isFree || (course.price ?? 0) <= 0) {
      return NextResponse.json({ error: 'Course is free — use enroll instead.' }, { status: 400 })
    }

    const existing = await findEnrollment(payload, user.id, courseId)
    if (existing) {
      return NextResponse.json({ error: 'Already enrolled' }, { status: 409 })
    }

    const reference = generateOrderReference()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    await payload.create({
      collection: 'orders',
      data: {
        student: user.id,
        course: courseId,
        amount: course.price ?? 0,
        currency: course.currency ?? 'NGN',
        provider: 'paystack',
        reference,
        status: 'pending',
        metadata: { courseTitle: course.title, courseSlug: course.slug },
      },
      overrideAccess: true,
    })

    const paystack = await initializeTransaction({
      email: user.email,
      amount: course.price ?? 0,
      reference,
      callbackUrl: `${siteUrl}/courses/${course.slug}?payment=verify&reference=${reference}`,
      metadata: {
        courseId,
        studentId: user.id,
        reference,
      },
    })

    return NextResponse.json({
      authorizationUrl: paystack.data.authorization_url,
      reference,
      accessCode: paystack.data.access_code,
    })
  } catch (e) {
    console.error('[lms/checkout POST]', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Checkout failed' },
      { status: 500 },
    )
  }
}
