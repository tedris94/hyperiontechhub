import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { isPayloadEnabled } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const VALID_TYPES = new Set(['pageview', 'click', 'session'])
const SESSION_COOKIE = 'hth_sid'
const VISITOR_COOKIE = 'hth_vid'

type IncomingEvent = {
  type?: string
  path?: string
  referrer?: string
}

export async function POST(request: Request) {
  const userAgent = request.headers.get('user-agent') ?? ''
  let body: { events?: IncomingEvent[] }
  try {
    body = (await request.json()) as { events?: IncomingEvent[] }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const cookieHeader = request.headers.get('cookie') ?? ''
  const parseCookie = (name: string) =>
    cookieHeader
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${name}=`))
      ?.slice(name.length + 1)

  const sessionId = parseCookie(SESSION_COOKIE) || randomUUID()
  const visitorId = parseCookie(VISITOR_COOKIE) || randomUUID()
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, sessionId, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 1800 })
  response.cookies.set(VISITOR_COOKIE, visitorId, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 31536000 })

  if (!isPayloadEnabled()) return response

  const events = Array.isArray(body.events) ? body.events : [{ type: 'pageview', path: body as unknown as string }]

  try {
    const { getPayloadSingleton } = await import('@/lib/payload')
    const payload = await getPayloadSingleton()
    for (const e of events.slice(0, 10)) {
      if (!e.type || !VALID_TYPES.has(e.type)) continue
      await payload.create({
        collection: 'analytics-events',
        data: {
          type: e.type as 'pageview' | 'click' | 'session',
          path: e.path?.slice(0, 1024),
          referrer: e.referrer?.slice(0, 1024),
          sessionId,
          visitorId,
          userAgent: userAgent.slice(0, 512),
        },
      })
    }
  } catch (error) {
    console.error('[track]', error)
  }

  return response
}
