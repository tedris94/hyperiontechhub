# Hyperion Tech Hub - Next.js Frontend

Modern frontend for Hyperion Tech Hub built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- WordPress running at `http://localhost/testhub.com`
- WordPress headless theme activated

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Check `.env.local` file
   - Update WordPress API URL if needed

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   - Visit: http://localhost:3000

## 📁 Project Structure

```
hyperiontechhub/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Homepage
│   └── globals.css     # Global styles
├── components/          # React components
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Purpose.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── lib/                # Utilities
│   ├── wp-api.ts       # WordPress API client
│   └── utils.ts        # Helper functions
└── public/             # Static assets
```

## 🔌 WordPress API Integration

The frontend connects to WordPress via REST API:

- **Base URL:** `http://localhost/testhub.com/wp-json/wp/v2`
- **Endpoints:**
  - `/services` - Services custom post type
  - `/team` - Team members
  - `/portfolio` - Portfolio items
  - `/posts` - Blog posts
  - `/pages` - Pages

## 🎨 Design Source

Figma Design: https://source-sorted-25581197.figma.site/

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

This Next.js app can be deployed to:
- Vercel (recommended)
- Netlify
- Any Node.js hosting

Make sure to update `NEXT_PUBLIC_WP_API_URL` in production environment variables.
