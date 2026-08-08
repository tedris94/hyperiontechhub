# Vercel + Supabase setup

## 1. Database (Supabase PostgreSQL)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your Hyperion project.
2. If paused, click **Restore**.
3. **Project Settings → Database → Connect → Session pooler** → copy URI (port `5432` for migrate/seed).
4. For Vercel serverless, prefer **Transaction pooler** (port `6543`) with `?pgbouncer=true`.

Username must be `postgres.<project-ref>` on pooler hosts. Host must match the dashboard (`aws-0-…` or `aws-1-…`).

## 2. Vercel environment variables

| Variable | Value |
|----------|--------|
| `DATABASE_URI` | Session or Transaction pooler URI from Supabase |
| `PAYLOAD_SECRET` | Long random string (48+ chars) |
| `NEXT_PUBLIC_SITE_URL` | `https://www.hyperiontechhub.com` |
| `VERCEL_TOKEN` | Optional — ICMS custom domain automation |
| `VERCEL_PROJECT_ID` | Optional — with `VERCEL_TOKEN` for Domains API |
| `VERCEL_TEAM_ID` | Optional — team-owned Vercel projects |

### ICMS hostnames

- Add wildcard `*.hyperiontechhub.com` once on this Vercel project (covers all tenant subdomains).
- Path URLs remain: `/icms/[slug]`.
- Custom domains: tenant Settings → Domains (see [src/lib/icms/ICMS-DOMAINS.md](./src/lib/icms/ICMS-DOMAINS.md)).

Optional media (Supabase Storage S3):

| Variable | Notes |
|----------|--------|
| `S3_ENDPOINT` | `https://[project-ref].supabase.co/storage/v1/s3` |
| `S3_BUCKET` | e.g. `media` |
| `S3_ACCESS_KEY_ID` | Storage access key |
| `S3_SECRET_ACCESS_KEY` | Storage secret |
| `S3_REGION` | e.g. `us-east-1` |

LMS (optional):

| Variable | Notes |
|----------|--------|
| `BUNNY_STREAM_*` | Video streaming |
| `PAYSTACK_*` | Course payments |

## 3. Deploy

Connect the GitHub repo to Vercel, set the env vars, deploy.

Locally after DB is ready:

```bash
npm run migrate
npm run seed
```

## Troubleshooting

- `tenant/user … not found` → wrong pooler host/region or paused project; re-copy Session pooler URI.
- Windows migrate hangs/fails on pooler → try `npm run migrate:chunked`.
