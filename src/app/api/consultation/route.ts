import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'

interface ConsultationFormData {
  name: string
  email: string
  phone: string
  company?: string
  service: string
  preferredDate: string
  preferredTime: string
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
    const body: ConsultationFormData = await request.json()
    const { name, email, phone, company, service, preferredDate, preferredTime, message } = body

    if (!name || !email || !phone || !service || !preferredDate || !preferredTime || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    let inserted: { id: string | number } | null = null

    if (isPayloadEnabled()) {
      const payload = await getPayloadSingleton()
      const doc = await payload.create({
        collection: 'consultations',
        data: {
          name,
          email,
          phone,
          company: company || undefined,
          service,
          preferredDate,
          preferredTime,
          message,
          status: 'pending',
          read: false,
        },
        overrideAccess: true,
      })
      inserted = { id: doc.id }
    }

    try {
      const transporter = createTransporter()
      if (transporter) {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || `"Hyperion Tech Hub" <${process.env.SMTP_USER}>`,
          to: 'info@hyperiontechhub.com',
          replyTo: email,
          subject: `New Consultation Request: ${service}`,
          text: `${name} (${email}, ${phone})\nService: ${service}\nDate: ${preferredDate} ${preferredTime}\n\n${message}`,
        })
      }
    } catch (emailError) {
      console.error('Consultation email error:', emailError)
    }

    return NextResponse.json({ success: true, consultation: inserted })
  } catch (error) {
    console.error('Consultation error:', error)
    return NextResponse.json({ error: 'Failed to process consultation request' }, { status: 500 })
  }
}
