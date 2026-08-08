import { NextResponse } from 'next/server'
import { PAYLOAD_TOKEN_COOKIE } from '@/constants/payload'
import { IMPERSONATOR_COOKIE, clearAuthCookieOptions } from '@/lib/impersonation'

export const dynamic = 'force-dynamic'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(PAYLOAD_TOKEN_COOKIE, '', clearAuthCookieOptions())
  response.cookies.set(IMPERSONATOR_COOKIE, '', clearAuthCookieOptions())
  return response
}
