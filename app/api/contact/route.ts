import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
}

// Email configuration
// In production, use environment variables for these values
const createTransporter = () => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  
  // Check if credentials are provided
  if (!smtpUser || !smtpPassword) {
    return null; // Return null if credentials are missing
  }
  
  // For development, you can use a service like Gmail, SendGrid, or Mailgun
  // This example uses Gmail SMTP - you'll need to configure it properly
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });
};

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, phone, service, message } = body;

    // Validate required fields
    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create submission object
    const submission = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || 'Not provided',
      service,
      message,
      status: 'new',
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Store submission in localStorage (via client-side)
    // For server-side storage, you'd use a database
    // For now, we'll return it and the client will store it

    // Send email
    try {
      const transporter = createTransporter();
      
      if (!transporter) {
        console.warn('Email not sent: SMTP credentials not configured. Please set SMTP_USER and SMTP_PASSWORD in .env.local');
        // Still return success since submission is stored
      } else {
        const mailOptions = {
          from: process.env.EMAIL_FROM || `"Hyperion Tech Hub" <${process.env.SMTP_USER}>`,
          to: 'info@hyperiontechhub.com',
          replyTo: email,
          subject: `New Contact Form Submission: ${service}`,
          html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1A2BC2; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #1B1C1E; }
                .value { color: #6B7280; margin-top: 5px; }
                .footer { background: #0D0D52; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>New Contact Form Submission</h2>
                </div>
                <div class="content">
                  <div class="field">
                    <div class="label">Name:</div>
                    <div class="value">${name}</div>
                  </div>
                  <div class="field">
                    <div class="label">Email:</div>
                    <div class="value"><a href="mailto:${email}">${email}</a></div>
                  </div>
                  <div class="field">
                    <div class="label">Phone:</div>
                    <div class="value">${phone || 'Not provided'}</div>
                  </div>
                  <div class="field">
                    <div class="label">Service Interested In:</div>
                    <div class="value">${service}</div>
                  </div>
                  <div class="field">
                    <div class="label">Message:</div>
                    <div class="value">${message.replace(/\n/g, '<br>')}</div>
                  </div>
                </div>
                <div class="footer">
                  <p>This email was sent from the Hyperion Tech Hub contact form.</p>
                  <p>Submitted on ${new Date().toLocaleString()}</p>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Service: ${service}

Message:
${message}

---
Submitted on ${new Date().toLocaleString()}
        `,
      };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to info@hyperiontechhub.com');
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails, just log it
      // In production, you might want to queue the email or use a service
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      submission,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form submission' },
      { status: 500 }
    );
  }
}

