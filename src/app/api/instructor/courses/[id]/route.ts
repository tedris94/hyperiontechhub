import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { relId } from '@/lib/lms/enrollment'
import { canAuthorCourses, slugFromTitle, stringItems, toCourseDetail } from '@/lib/lmsApi'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Props = { params: Promise<{ id: string }> }

async function canEditCourse(user: { id: number; role?: string }, courseId: number) {
  const payload = await getPayloadSingleton()
  const course = await payload.findByID({
    collection: 'courses',
    id: courseId,
    overrideAccess: true,
  })
  const instructorId = relId(course.instructor)
  const isAdmin = user.role === 'super_admin' || user.role === 'admin'
  return isAdmin || instructorId === user.id
}

export async function GET(_request: Request, { params }: Props) {
  const user = await getCurrentUser(_request)
  if (!user || !canAuthorCourses(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const courseId = Number(id)
    if (!(await canEditCourse(user, courseId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const payload = await getPayloadSingleton()
    const course = await payload.findByID({
      collection: 'courses',
      id: courseId,
      depth: 2,
      overrideAccess: true,
    })

    const sections = await payload.find({
      collection: 'course-sections',
      where: { course: { equals: courseId } },
      sort: 'order',
      limit: 100,
      overrideAccess: true,
    })

    const lessons = await payload.find({
      collection: 'lessons',
      where: { course: { equals: courseId } },
      sort: 'order',
      limit: 500,
      overrideAccess: true,
    })

    return NextResponse.json({
      course: toCourseDetail(course as never),
      sections: sections.docs,
      lessons: lessons.docs,
    })
  } catch (e) {
    console.error('[instructor/courses/id GET]', e)
    return NextResponse.json({ error: 'Failed to load course' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: Props) {
  const user = await getCurrentUser(request)
  if (!user?.id || !canAuthorCourses(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const courseId = Number(id)
    if (!(await canEditCourse(user, courseId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = (await request.json()) as Record<string, unknown>
    const payload = await getPayloadSingleton()

    const data: Record<string, unknown> = {}
    if (typeof body.title === 'string') {
      data.title = body.title.trim()
      if (!body.slug) data.slug = slugFromTitle(body.title)
    }
    if (typeof body.subtitle === 'string') data.subtitle = body.subtitle.trim()
    if (typeof body.slug === 'string') data.slug = body.slug.trim()
    if (typeof body.level === 'string') data.level = body.level
    if (typeof body.status === 'string') data.status = body.status
    if (typeof body.isFree === 'boolean') data.isFree = body.isFree
    if (typeof body.price === 'number') data.price = body.price
    if (typeof body.categoryId === 'number') data.category = body.categoryId
    if (Array.isArray(body.whatYouWillLearn)) {
      data.whatYouWillLearn = stringItems(body.whatYouWillLearn as never).map((item) => ({ item }))
    }
    if (Array.isArray(body.requirements)) {
      data.requirements = stringItems(body.requirements as never).map((item) => ({ item }))
    }

    const updated = await payload.update({
      collection: 'courses',
      id: courseId,
      data,
      overrideAccess: true,
    })

    return NextResponse.json(toCourseDetail(updated as never))
  } catch (e) {
    console.error('[instructor/courses/id PATCH]', e)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: Props) {
  const user = await getCurrentUser(request)
  if (!user || user.role !== 'super_admin' && user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const payload = await getPayloadSingleton()
    await payload.delete({
      collection: 'courses',
      id: Number(id),
      overrideAccess: true,
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[instructor/courses/id DELETE]', e)
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
