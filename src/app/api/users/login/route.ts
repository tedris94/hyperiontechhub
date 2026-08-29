import { NextResponse } from 'next/server'
import { getPayloadSingleton } from '@/lib/payload'
import { PAYLOAD_TOKEN_COOKIE } from '@/constants/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string }
    const email = body.email?.trim().toLowerCase()
    const password = body.password

    if (!email || !password) {
      return NextResponse.json({ errors: [{ message: 'Email and password are required.' }] }, { status: 400 })
    }

    const payload = await getPayloadSingleton()
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    const response = NextResponse.json({
      message: 'Authentication Passed',
      ...result,
    })

    if (result.token) {
      response.cookies.set(PAYLOAD_TOKEN_COOKIE, result.token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7200,
      })
    }

    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid credentials'
    return NextResponse.json({ errors: [{ message }] }, { status: 401 })
  }
}