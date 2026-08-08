import nodemailer from 'nodemailer'
import {
  APPLICATION_STATUS_LABELS,
  careersContactEmail,
  siteBaseUrl,
  type ApplicationStatus,
} from '@/lib/applicationRef'

type ApplicationEmailPayload = {
  to: string
  applicantName: string
  jobTitle: string
  applicationRef: string
}

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

function firstNameFrom(fullName: string) {
  return fullName.split(/\s+/)[0] || fullName
}

export async function notifyApplicantOfApplicationStatus(payload: ApplicationEmailPayload & {
  status: ApplicationStatus
}) {
  const transporter = getTransporter()
  if (!transporter) {
    console.warn('[applicationEmails] SMTP not configured, skipping notification')
    return
  }

  const statusLabel = APPLICATION_STATUS_LABELS[payload.status]
  const from =
    process.env.SMTP_FROM_CAREERS?.trim() ||
    process.env.SMTP_FROM?.trim() ||
    process.env.SMTP_USER

  const subject = `Application update — ${payload.jobTitle} (${payload.applicationRef})`
  const text = [
    `Hi ${firstNameFrom(payload.applicantName)},`,
    '',
    `Your application for ${payload.jobTitle} (${payload.applicationRef}) is now: ${statusLabel}.`,
    '',
    `View careers: ${siteBaseUrl()}/careers`,
    '',
    `Questions? Reply to ${careersContactEmail()}`,
  ].join('\n')

  await transporter.sendMail({
    from,
    replyTo: careersContactEmail(),
    to: payload.to,
    subject,
    text,
  })
}
