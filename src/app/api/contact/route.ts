import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import {
  allowContactRequest,
  clientIpFromRequest,
  isAllowedContactService,
  isTooFastSubmission,
  looksLikeBotName,
} from '@/lib/contactFormGuard'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  service: string
  message: string
  /** Honeypot — must stay empty. */
  website?: string
  /** Client form mount timestamp (ms). */
  formStartedAt?: number
}

const createTransporter = () => {
  const smtpUser = process.env.SMTP_USER
  const smtpPassword = process.env.SMTP_PASSWORD
  if (!smtpUser || !smtpPassword) return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: { user: smtpUser, pass: smtpPassword },
  })
}

function softSuccess() {
  return NextResponse.json({
    success: true,
    message: 'Contact form submitted successfully',
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactFormData
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const service = typeof body.service === 'string' ? body.service.trim() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const honeypot = typeof body.website === 'string' ? body.website.trim() : ''

    // Bots that fill hidden fields — pretend success so they stop retrying.
    if (honeypot) return softSuccess()
    if (isTooFastSubmission(body.formStartedAt)) return softSuccess()
    if (looksLikeBotName(name)) return softSuccess()

    const ip = clientIpFromRequest(request)
    if (!allowContactRequest(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again in a minute.' },
        { status: 429 },
      )
    }

    if (!name || !email || !service || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (name.length < 2 || name.length > 120) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (!isAllowedContactService(service)) {
      return NextResponse.json({ error: 'Invalid service selection' }, { status: 400 })
    }

    if (message.length < 10 || message.length > 500) {
      return NextResponse.json({ error: 'Message must be 10–500 characters' }, { status: 400 })
    }

    let inserted: { id: string | number; createdAt?: string } | null = null

    if (isPayloadEnabled()) {
      const payload = await getPayloadSingleton()
      const doc = await payload.create({
        collection: 'contact-submissions',
        data: {
          name,
          email,
          phone: phone || undefined,
          service,
          message,
          status: 'new',
          read: false,
        },
        overrideAccess: true,
      })
      inserted = { id: doc.id, createdAt: doc.createdAt }
    }

    try {
      const transporter = createTransporter()
      if (transporter) {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || `"Hyperion Tech Hub" <${process.env.SMTP_USER}>`,
          to: 'info@hyperiontechhub.com',
          replyTo: email,
          subject: `New Contact Form Submission: ${service}`,
          text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nService: ${service}\n\n${message}`,
        })
      }
    } catch (emailError) {
      console.error('Email error:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      submission: inserted,
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to process contact form submission' }, { status: 500 })
  }
}
