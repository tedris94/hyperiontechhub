import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { canAuthorCourses } from '@/lib/lmsApi'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Props = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Props) {
  const user = await getCurrentUser(request)
  if (!user || !canAuthorCourses(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = (await request.json()) as Record<string, unknown>
    const payload = await getPayloadSingleton()

    const data: Record<string, unknown> = {}
    if (typeof body.title === 'string') data.title = body.title.trim()
    if (typeof body.type === 'string') data.type = body.type
    if (typeof body.order === 'number') data.order = body.order
    if (typeof body.bunnyVideoId === 'string') data.bunnyVideoId = body.bunnyVideoId
    if (typeof body.durationSeconds === 'number') data.durationSeconds = body.durationSeconds
    if (typeof body.isPreview === 'boolean') data.isPreview = body.isPreview
    if (typeof body.quizId === 'number') data.quiz = body.quizId

    const updated = await payload.update({
      collection: 'lessons',
      id: Number(id),
      data,
      overrideAccess: true,
    })

    return NextResponse.json(updated)
  } catch (e) {
    console.error('[instructor/lessons/id PATCH]', e)
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const user = await getCurrentUser(_request)
  if (!user || !canAuthorCourses(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const payload = await getPayloadSingleton()
    await payload.delete({
      collection: 'lessons',
      id: Number(id),
      overrideAccess: true,
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[instructor/lessons/id DELETE]', e)
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 })
  }
}
