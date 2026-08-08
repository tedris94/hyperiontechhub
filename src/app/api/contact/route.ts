import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  service: string
  message: string
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

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()
    const { name, email, phone, service, message } = body

    if (!name || !email || !service || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    let inserted: { id: string | number; createdAt?: string } | null = null

    if (isPayloadEnabled()) {
      const payload = await getPayloadSingleton()
      const doc = await payload.create({
        collection: 'contact-submissions',
        data: { name, email, phone: phone || undefined, service, message, status: 'new', read: false },
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
