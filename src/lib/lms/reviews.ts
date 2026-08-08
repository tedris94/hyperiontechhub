import type { Payload } from 'payload'
import { relId } from './enrollment'

export async function updateCourseRating(payload: Payload, courseId: number) {
  const reviews = await payload.find({
    collection: 'reviews',
    where: {
      and: [
        { course: { equals: courseId } },
        { status: { equals: 'approved' } },
      ],
    },
    limit: 1000,
    overrideAccess: true,
  })

  const count = reviews.docs.length
  const avg =
    count > 0
      ? reviews.docs.reduce((sum, r) => sum + (r.rating ?? 0), 0) / count
      : 0

  await payload.update({
    collection: 'courses',
    id: courseId,
    data: {
      ratingAvg: Math.round(avg * 10) / 10,
      ratingCount: count,
    },
    overrideAccess: true,
  })
}

export async function fulfillPaidOrder(payload: Payload, reference: string) {
  const orders = await payload.find({
    collection: 'orders',
    where: { reference: { equals: reference } },
    limit: 1,
    overrideAccess: true,
  })

  const order = orders.docs[0]
  if (!order || order.status === 'paid') return order

  const studentId = relId(order.student)
  const courseId = relId(order.course)
  if (!studentId || !courseId) return order

  await payload.update({
    collection: 'orders',
    id: order.id,
    data: {
      status: 'paid',
      paidAt: new Date().toISOString(),
    },
    overrideAccess: true,
  })

  const { createEnrollment } = await import('./enrollment')
  await createEnrollment(payload, {
    studentId,
    courseId,
    source: 'paid',
  })

  return payload.findByID({
    collection: 'orders',
    id: order.id,
    overrideAccess: true,
  })
}
