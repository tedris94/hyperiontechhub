# ICMS domains & UI variants

## URL modes

| Mode | Example | Notes |
|------|---------|--------|
| Path (always works) | `https://www.hyperiontechhub.com/icms/anas-bn-malik` | Platform host |
| Subdomain | `https://anas-bn-malik.hyperiontechhub.com` | Free; slug = hostname label |
| Custom domain | `https://www.yourmosque.org` | Connected in Admin → Settings |

Platform and tenant admin stay on the main site:

- `https://www.hyperiontechhub.com/icms/platform`
- `https://www.hyperiontechhub.com/icms/admin/[slug]`

## One-time DNS (subdomains)

1. In the **Vercel project** → Domains → add `*.hyperiontechhub.com` (wildcard).
2. At your DNS registrar for `hyperiontechhub.com`, add the CNAME/records Vercel shows for the wildcard (typically `*` → `cname.vercel-dns.com`).
3. Keep `www` and apex pointing at the same Vercel project as today.

No per-tenant DNS is required for `{slug}.hyperiontechhub.com`.

## Custom domain checklist

1. Set env vars on Vercel (and locally if testing API):

   | Variable | Purpose |
   |----------|---------|
   | `VERCEL_TOKEN` | Token with domain scope for the project |
   | `VERCEL_PROJECT_ID` | Project id from Vercel project settings |
   | `VERCEL_TEAM_ID` | Optional; required for team-owned projects |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.hyperiontechhub.com` |

2. Tenant admin → **Settings → Domains** → enter hostname (e.g. `www.masjid.org`) → **Connect**.
3. App calls Vercel Domains API, saves `customDomain` + status, shows DNS rows.
4. Tenant creates DNS at their registrar (usually CNAME → `cname.vercel-dns.com`, plus any TXT Vercel requires).
5. Click **Refresh status** until status is **Active**.
6. Visit the custom domain; middleware rewrites to `/icms/[slug]/…`.

If `VERCEL_TOKEN` / `VERCEL_PROJECT_ID` are missing, the domain is still saved and instructions are shown — add the hostname manually in the Vercel dashboard until env is configured.

## Local subdomain testing

Modern browsers resolve `*.localhost`. With `npm run dev`:

- Path: `http://localhost:3000/icms/anas-bn-malik`
- Subdomain: `http://anas-bn-malik.localhost:3000`

## UI variants

Admin → **Brand tokens → Site appearance** (or platform create-tenant dropdown):

- `classic` (default), `modern`, `community`, `scholarly`, `compact`

Each pack changes home section order, header/footer/hero chrome, and CSS via `data-ui-variant`. Brand color tokens still apply per tenant.
