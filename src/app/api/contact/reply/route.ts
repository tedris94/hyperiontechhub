import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ReplyData {
  submissionId: string;
  to: string;
  subject: string;
  message: string;
  replyTo?: string;
}

// Email configuration
const createTransporter = () => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  
  if (!smtpUser || !smtpPassword) {
    return null;
  }
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });
};

export async function POST(request: NextRequest) {
  try {
    const body: ReplyData = await request.json();
    const { to, subject, message, replyTo } = body;

    // Validate required fields
    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid recipient email format' },
        { status: 400 }
      );
    }

    // Send email
    try {
      const transporter = createTransporter();
      
      if (!transporter) {
        return NextResponse.json(
          { error: 'Email service not configured. Please set SMTP_USER and SMTP_PASSWORD in .env.local' },
          { status: 500 }
        );
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"Hyperion Tech Hub" <${process.env.SMTP_USER}>`,
        to: to,
        replyTo: replyTo || 'info@hyperiontechhub.com',
        subject: subject,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1A2BC2; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
                .message { color: #1B1C1E; margin-top: 15px; white-space: pre-wrap; }
                .footer { background: #0D0D52; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>Reply from Hyperion Tech Hub</h2>
                </div>
                <div class="content">
                  <div class="message">${message.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="footer">
                  <p>This email was sent from Hyperion Tech Hub.</p>
                  <p>Sent on ${new Date().toLocaleString()}</p>
                </div>
              </div>
            </body>
          </html>
        `,
        text: message,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Reply email sent successfully to ${to}`);

      return NextResponse.json({
        success: true,
        message: 'Reply sent successfully',
      });
    } catch (emailError: any) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { error: `Failed to send email: ${emailError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Reply error:', error);
    return NextResponse.json(
      { error: 'Failed to process reply' },
      { status: 500 }
    );
  }
}

