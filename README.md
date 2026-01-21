# Hyperion Tech Hub

Official website for Hyperion Tech Hub, a technology company providing web, mobile, desktop, and custom application development.  
Live site: https://www.hyperiontechhub.com/

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui (customized components)
- Axios (WordPress REST API)

## Data Source (Headless WordPress)

WordPress REST API base:
`https://cms.hyperiontechhub.com/wp-json/wp/v2`

Common endpoints:
- `/services`
- `/team`
- `/portfolio`
- `/posts`
- `/pages`

## Getting Started

### Prerequisites

- Node.js 18+
- Access to the WordPress API

### Install & Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SITE_URL=https://www.hyperiontechhub.com
NEXT_PUBLIC_SITE_NAME=Hyperion Tech Hub
NEXT_PUBLIC_WP_API_URL=https://cms.hyperiontechhub.com/wp-json/wp/v2
NEXT_PUBLIC_WP_SITE_URL=https://cms.hyperiontechhub.com
```

If contact forms are enabled, also set:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password_or_app_password
EMAIL_FROM="Hyperion Tech Hub <your_email>"
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

Deployed on Vercel.  
Set the same environment variables in Vercel before deploying.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Open a pull request with a clear description
