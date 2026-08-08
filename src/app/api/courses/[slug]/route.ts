import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { findEnrollment, relId } from '@/lib/lms/enrollment'
import { getResumeLessonSlug } from '@/lib/lms/progress'
import { getPayloadSingleton } from '@/lib/payload'
import { toCourseDetail, toSectionResponse } from '@/lib/lmsApi'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Props = { params: Promise<{ slug: string }> }

export async function GET(_request: Request, { params }: Props) {
  try {
    const { slug } = await params
    const user = await getCurrentUser(_request)
    const payload = await getPayloadSingleton()

    const result = await payload.find({
      collection: 'courses',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      limit: 1,
      depth: 2,
      overrideAccess: true,
    })

    const course = result.docs[0]
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const sectionsResult = await payload.find({
      collection: 'course-sections',
      where: { course: { equals: course.id } },
      sort: 'order',
      limit: 100,
      overrideAccess: true,
    })

    const lessonsResult = await payload.find({
      collection: 'lessons',
      where: { course: { equals: course.id } },
      sort: 'order',
      limit: 500,
      overrideAccess: true,
    })

    const sections = sectionsResult.docs.map((section) => {
      const sectionLessons = lessonsResult.docs.filter(
        (lesson) => relId(lesson.section) === section.id,
      )
      return toSectionResponse(section as never, sectionLessons as never[])
    })

    const reviewsResult = await payload.find({
      collection: 'reviews',
      where: {
        and: [
          { course: { equals: course.id } },
          { status: { equals: 'approved' } },
        ],
      },
      sort: '-createdAt',
      limit: 20,
      depth: 1,
      overrideAccess: true,
    })

    let enrolled = false
    let learnUrl: string | null = null
    if (user?.id) {
      const enrollment = await findEnrollment(payload, user.id, course.id)
      enrolled = Boolean(enrollment)
      if (enrollment) {
        const resumeSlug = await getResumeLessonSlug(payload, enrollment.id, course.id)
        if (resumeSlug) {
          learnUrl = `/learn/${slug}/${resumeSlug}`
        }
      }
    }

    return NextResponse.json({
      course: toCourseDetail(course as never),
      sections,
      reviews: reviewsResult.docs.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        student: typeof r.student === 'object' && r.student
          ? { fullName: (r.student as { fullName?: string }).fullName ?? 'Student' }
          : { fullName: 'Student' },
        createdAt: r.createdAt,
      })),
      enrolled,
      learnUrl,
    })
  } catch (e) {
    console.error('[courses/slug GET]', e)
    return NextResponse.json({ error: 'Failed to load course' }, { status: 500 })
  }
}
