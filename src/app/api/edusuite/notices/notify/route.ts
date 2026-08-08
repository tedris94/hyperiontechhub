import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { isPlatformAdmin } from '@/collections/edusuite/shared'
import { resolveTenantAccess } from '@/lib/edusuite/tenant'

/**
 * Marks a notice for email/SMS delivery (hooks into existing providers when configured).
 * Creates an audit-friendly update; actual send uses RESEND / SMS env when present.
 */
export async function POST(req: NextRequest) {
  if (!isPayloadEnabled()) return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const schoolSlug = String(body.schoolSlug || '')
  const noticeId = body.noticeId
  const channel = String(body.channel || 'email') as 'email' | 'sms' | 'both'

  const access = await resolveTenantAccess(user, schoolSlug)
  if (!access) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const payload = await getPayloadSingleton()
  const notice = await payload.findByID({
    collection: 'edu-notices',
    id: noticeId,
    depth: 0,
    user,
    overrideAccess: isPlatformAdmin(user),
  })
  if (!notice) return NextResponse.json({ error: 'Notice not found' }, { status: 404 })
  if (String((notice as { school?: unknown }).school) !== String(access.school.id)) {
    return NextResponse.json({ error: 'Notice not found for school' }, { status: 404 })
  }

  const data: Record<string, unknown> = {
    publishedAt: new Date().toISOString(),
  }
  if (channel === 'email' || channel === 'both') data.sendEmail = true
  if (channel === 'sms' || channel === 'both') data.sendSms = true

  await payload.update({
    collection: 'edu-notices',
    id: noticeId,
    data,
    user,
    overrideAccess: isPlatformAdmin(user),
  })

  // Soft delivery: log intent; wire Resend when key exists (optional dependency).
  const title = (notice as { title?: string }).title || 'School notice'
  const noticeBody = (notice as { body?: string }).body || ''
  let emailed = false
  if ((channel === 'email' || channel === 'both') && process.env.RESEND_API_KEY) {
    try {
      const to =
        process.env.EDUSUITE_NOTIFY_EMAIL ||
        (access.school as { email?: string }).email ||
        user.email
      if (to) {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'Hyperion EduSuite <onboarding@resend.dev>',
            to: [to],
            subject: `[${access.school.name}] ${title}`,
            text: noticeBody,
          }),
        })
        emailed = res.ok
      }
    } catch {
      emailed = false
    }
  }

  return NextResponse.json({
    ok: true,
    queued: { email: channel !== 'sms', sms: channel !== 'email' },
    emailed,
    note: emailed
      ? 'Notice published and email sent.'
      : 'Notice published. Configure RESEND_API_KEY / SMS provider for live delivery.',
  })
}
