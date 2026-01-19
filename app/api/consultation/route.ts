import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ConsultationFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
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
    const body: ConsultationFormData = await request.json();
    const { name, email, phone, company, service, preferredDate, preferredTime, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !service || !preferredDate || !preferredTime || !message) {
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

    // Validate date is not in the past
    const selectedDate = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return NextResponse.json(
        { error: 'Preferred date cannot be in the past' },
        { status: 400 }
      );
    }

    // Create consultation object
    const consultation = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      company: company || '',
      service,
      preferredDate,
      preferredTime,
      message,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Send email notification to admins
    try {
      const transporter = createTransporter();
      
      if (!transporter) {
        console.warn('Email not sent: SMTP credentials not configured. Please set SMTP_USER and SMTP_PASSWORD in .env.local');
      } else {
        const mailOptions = {
          from: process.env.EMAIL_FROM || `"Hyperion Tech Hub" <${process.env.SMTP_USER}>`,
          to: 'info@hyperiontechhub.com',
          replyTo: email,
          subject: `New Consultation Request: ${service}`,
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
                    <h2>New Consultation Request</h2>
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
                      <div class="value"><a href="tel:${phone}">${phone}</a></div>
                    </div>
                    ${company ? `
                    <div class="field">
                      <div class="label">Company:</div>
                      <div class="value">${company}</div>
                    </div>
                    ` : ''}
                    <div class="field">
                      <div class="label">Service:</div>
                      <div class="value">${service}</div>
                    </div>
                    <div class="field">
                      <div class="label">Preferred Date:</div>
                      <div class="value">${new Date(preferredDate).toLocaleDateString()}</div>
                    </div>
                    <div class="field">
                      <div class="label">Preferred Time:</div>
                      <div class="value">${preferredTime}</div>
                    </div>
                    <div class="field">
                      <div class="label">Message:</div>
                      <div class="value">${message.replace(/\n/g, '<br>')}</div>
                    </div>
                  </div>
                  <div class="footer">
                    <p>This consultation request was submitted from the Hyperion Tech Hub website.</p>
                    <p>Submitted on ${new Date().toLocaleString()}</p>
                  </div>
                </div>
              </body>
            </html>
          `,
          text: `
New Consultation Request

Name: ${name}
Email: ${email}
Phone: ${phone}
${company ? `Company: ${company}\n` : ''}Service: ${service}
Preferred Date: ${new Date(preferredDate).toLocaleDateString()}
Preferred Time: ${preferredTime}

Message:
${message}

---
Submitted on ${new Date().toLocaleString()}
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Consultation notification email sent successfully to info@hyperiontechhub.com');
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Consultation request submitted successfully',
      consultation,
    });
  } catch (error) {
    console.error('Consultation form error:', error);
    return NextResponse.json(
      { error: 'Failed to process consultation request' },
      { status: 500 }
    );
  }
}

