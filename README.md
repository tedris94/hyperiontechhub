# Hyperion Tech Hub

Official website for Hyperion Tech Hub — technology solutions, education, and innovation.

Live: https://www.hyperiontechhub.com/

## Stack

- **Next.js 15** (App Router)
- **Payload CMS 3.82** — content, forms, users, LMS
- **Supabase PostgreSQL** — database host
- **Supabase Storage** — media uploads (production)
- **Bunny.net Stream** — course video
- **Paystack** — course payments (NGN)
- **Tailwind CSS** + shadcn/ui components
- **Vercel** — deployment

## Getting started

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
# Set DATABASE_URI (Supabase Session pooler) and PAYLOAD_SECRET in .env.local
npm run migrate:create initial   # first time only — generates src/migrations/*
npm run db:setup                 # reset legacy tables + migrate + seed (recommended first run)
# Or step by step:
npm run db:reset                 # drop legacy Supabase uuid tables + partial Payload schema
npm run migrate:chunked          # if migrate fails on session pooler
npm run seed
npm run dev
```

Open http://localhost:3000

## Key URLs

| URL | Purpose |
|-----|---------|
| `/` | Marketing homepage |
| `/admin` | Payload native CMS admin |
| `/dashboard` | Role-based operations dashboard |
| `/dashboard/cms` | In-app content editor |
| `/courses` | LMS catalog |
| `/login` | Payload auth login |
| `/portfolio` | Case studies |
| `/icms` | ICMS tenant list / entry |
| `/icms/platform` | Create tenants, seed, memberships |
| `/icms/[slug]` | Tenant public site (path mode) |
| `/icms/admin/[slug]` | Tenant admin |
| `https://[slug].hyperiontechhub.com` | Tenant public site (subdomain; needs wildcard DNS) |

See [src/lib/icms/ICMS-DOMAINS.md](./src/lib/icms/ICMS-DOMAINS.md) for custom domains and UI variants.

## Demo accounts (after seed)

| Email | Password | Role |
|-------|----------|------|
| superadmin@hyperiontechhub.com | demo1234 | super_admin |
| admin@hyperiontechhub.com | demo1234 | admin |
| consultant@hyperiontechhub.com | demo1234 | consultant |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run migrate` — run Postgres migrations
- `npm run migrate:chunked` — pooler-safe chunked initial migration (Supabase on Windows)
- `npm run seed` — seed content from `src/content/site-content.json`
- `npm run generate:types` — regenerate Payload TypeScript types

## Deployment

See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for Vercel + Supabase configuration.
