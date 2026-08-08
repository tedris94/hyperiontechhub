import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { canAuthorCourses } from '@/lib/lmsApi'
import {
  createBunnyVideo,
  getBunnyUploadHeaders,
  getBunnyUploadUrl,
  isBunnyConfigured,
} from '@/lib/bunny'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const user = await getCurrentUser(request)
  if (!user || !canAuthorCourses(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isBunnyConfigured()) {
    return NextResponse.json({ error: 'Bunny Stream is not configured' }, { status: 503 })
  }

  try {
    const body = (await request.json()) as { title?: string }
    const title = body.title?.trim() || 'Untitled lesson video'
    const video = await createBunnyVideo(title)

    return NextResponse.json({
      videoId: video.guid,
      uploadUrl: getBunnyUploadUrl(video.guid),
      uploadHeaders: getBunnyUploadHeaders(),
    })
  } catch (e) {
    console.error('[instructor/video/upload POST]', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to create upload' },
      { status: 500 },
    )
  }
}
