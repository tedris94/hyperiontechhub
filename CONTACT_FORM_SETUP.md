# Contact Form Email Setup Guide

## Overview
The contact form sends emails to **info@hyperiontechhub.com** and stores submissions in the admin dashboards.

## ⚠️ IMPORTANT: Email Configuration Required

**The contact form will NOT send emails until you configure SMTP credentials.**

If you see the error: `Missing credentials for "PLAIN"` or `Email not sent: SMTP credentials not configured`, you need to set up your email configuration.

## Email Configuration

### Option 1: Gmail SMTP (Recommended for Development)

1. Create a `.env.local` file in the root directory:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM="Hyperion Tech Hub" <your-email@gmail.com>
```

2. For Gmail, you need to:
   - Enable 2-Step Verification
   - Generate an App Password: https://myaccount.google.com/apppasswords
   - Use the generated app password (not your regular password)

### Option 2: SendGrid (Recommended for Production)

1. Sign up at https://sendgrid.com
2. Get your API key
3. Update `.env.local`:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
EMAIL_FROM="Hyperion Tech Hub" <info@hyperiontechhub.com>
```

### Option 3: Mailgun

1. Sign up at https://www.mailgun.com
2. Get your SMTP credentials
3. Update `.env.local`:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
EMAIL_FROM="Hyperion Tech Hub" <info@hyperiontechhub.com>
```

## Testing

1. **Create `.env.local` file** in the root directory with your SMTP credentials
2. **Restart your dev server** after creating/updating `.env.local`
3. Fill out the contact form on the website
4. Check your email at **info@hyperiontechhub.com**
5. Check the Admin or Super Admin dashboard for the submission

## Quick Setup (Gmail)

1. Create `.env.local` in `C:\wamp64\www\testhub.com\hyperion-frontend\`
2. Add these lines:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password-here
EMAIL_FROM="Hyperion Tech Hub" <your-email@gmail.com>
```
3. Get Gmail App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Generate a new app password for "Mail"
   - Use that password (not your regular Gmail password)
4. Restart your dev server: `npm run dev`

## Admin Dashboard Features

- **View all submissions**: All contact form submissions are visible
- **Unread count**: Shows number of unread submissions
- **Reply to submissions**: Send email replies directly from the dashboard
- **View reply history**: See all replies sent for each submission
- **Status management**: Mark as read, replied, or archived
- **Delete submissions**: Remove unwanted submissions
- **Auto-refresh**: Dashboard refreshes every 5 seconds to show new submissions

## Reply Feature

Both **Admin** and **Super Admin** users can reply to contact form submissions:

1. Click on any submission to view details
2. Click the **"Reply"** button
3. Enter subject (auto-filled with default) and message
4. Click **"Send Reply"** to send the email
5. Replies are stored and visible in the submission history
6. Submission status automatically changes to "replied"

## Storage

Submissions are stored in:
- **Email**: Sent to info@hyperiontechhub.com
- **LocalStorage**: Stored in browser for admin dashboard access
- **Note**: For production, consider using a database instead of localStorage

## Troubleshooting

### Emails not sending?
1. Check your `.env.local` file exists and has correct values
2. Verify SMTP credentials are correct
3. Check server logs for errors
4. For Gmail, ensure App Password is used (not regular password)

### Submissions not showing in dashboard?
1. Ensure you're logged in as Admin or Super Admin
2. Check browser console for errors
3. Verify localStorage is enabled in browser

## Production Recommendations

1. **Use a proper email service** (SendGrid, Mailgun, AWS SES)
2. **Store submissions in a database** instead of localStorage
3. **Add rate limiting** to prevent spam
4. **Add CAPTCHA** for additional security
5. **Set up email notifications** for admins

