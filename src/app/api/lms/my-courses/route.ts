import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { relId } from '@/lib/lms/enrollment'
import { getResumeLessonSlug } from '@/lib/lms/progress'
import { getPayloadSingleton } from '@/lib/payload'
import { mediaUrl, toEnrollmentResponse, userSummary } from '@/lib/lmsApi'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const user = await getCurrentUser(request)
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayloadSingleton()
    const enrollments = await payload.find({
      collection: 'enrollments',
      where: {
        and: [
          { student: { equals: user.id } },
          { status: { not_equals: 'cancelled' } },
        ],
      },
      sort: '-enrolledAt',
      limit: 100,
      depth: 2,
      overrideAccess: true,
    })

    const results = await Promise.all(
      enrollments.docs.map(async (doc) => {
        const course =
          typeof doc.course === 'object' && doc.course
            ? (doc.course as unknown as Record<string, unknown>)
            : null
        const courseId = relId(doc.course)
        const courseSlug = course && typeof course.slug === 'string' ? course.slug : ''

        let resumeLessonSlug: string | null = null
        let learnUrl: string | null = null

        if (courseId && courseSlug) {
          resumeLessonSlug = await getResumeLessonSlug(payload, doc.id, courseId)
          if (resumeLessonSlug) {
            learnUrl = `/learn/${courseSlug}/${resumeLessonSlug}`
          }
        }

        const instructor = course ? userSummary(course.instructor) : null
        const enrollment = toEnrollmentResponse(doc as never, course)

        return {
          ...enrollment,
          resumeLessonSlug,
          learnUrl,
          thumbnailUrl: course ? mediaUrl(course.thumbnail) : null,
          instructorName: instructor?.fullName || null,
        }
      }),
    )

    return NextResponse.json(results)
  } catch (e) {
    console.error('[lms/my-courses GET]', e)
    return NextResponse.json({ error: 'Failed to load courses' }, { status: 500 })
  }
}
