import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { canAccessLesson } from '@/lib/lms/enrollment'
import { getSignedPlaybackUrl, isBunnyConfigured } from '@/lib/bunny'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const user = await getCurrentUser(request)
  const { searchParams } = new URL(request.url)
  const lessonId = Number(searchParams.get('lessonId'))

  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId is required' }, { status: 400 })
  }

  if (!isBunnyConfigured()) {
    return NextResponse.json({ error: 'Video streaming is not configured' }, { status: 503 })
  }

  try {
    const payload = await getPayloadSingleton()
    const lesson = await payload.findByID({
      collection: 'lessons',
      id: lessonId,
      depth: 1,
      overrideAccess: true,
    })

    if (lesson.type !== 'video' || !lesson.bunnyVideoId) {
      return NextResponse.json({ error: 'Lesson has no video' }, { status: 400 })
    }

    const allowed = await canAccessLesson(payload, user?.id ?? null, lesson)
    if (!allowed) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({
      playbackUrl: getSignedPlaybackUrl(lesson.bunnyVideoId),
      videoId: lesson.bunnyVideoId,
    })
  } catch (e) {
    console.error('[lms/video/token GET]', e)
    return NextResponse.json({ error: 'Failed to get video token' }, { status: 500 })
  }
}
