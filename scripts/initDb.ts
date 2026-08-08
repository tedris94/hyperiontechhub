import { loadProjectEnv } from './loadEnv.js'
import { prepareDatabaseUri } from './resolveDbUri.js'

async function prepareMigrateUri(migrateUri: string, appUri: string): Promise<string> {
  const prepared = await prepareDatabaseUri(migrateUri)
  // Direct Supabase hosts are often IPv6-only; skip when we had to substitute an IPv6 literal
  if (prepared.includes('[') && appUri) {
    console.warn('[db] Direct connection is IPv6-only on this network — using session pooler (DATABASE_URI)')
    return prepareDatabaseUri(appUri)
  }
  return prepared
}

async function connectPayload() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  return getPayload({ config, key: `migrate:${process.env.DATABASE_URI}` })
}

export async function getPayloadWithMigrations() {
  const root = loadProjectEnv()
  process.chdir(root)
  process.env.PAYLOAD_MIGRATING = 'true'

  const migrateUri = process.env.DATABASE_URI_MIGRATE?.trim()
  const appUri = process.env.DATABASE_URI?.trim()
  if (!migrateUri && !appUri) {
    throw new Error(
      'DATABASE_URI is missing. Set it in .env.local (Session pooler for app, or DATABASE_URI_MIGRATE for direct DDL).',
    )
  }

  let payload
  if (migrateUri && appUri) {
    process.env.DATABASE_URI = await prepareMigrateUri(migrateUri, appUri)
    payload = await connectPayload()
  } else if (migrateUri) {
    process.env.DATABASE_URI = await prepareDatabaseUri(migrateUri)
    payload = await connectPayload()
  } else {
    process.env.DATABASE_URI = await prepareDatabaseUri(appUri!)
    payload = await connectPayload()
  }

  try {
    await payload.db.migrate()
  } catch (error) {
    const cause = error instanceof Error && 'cause' in error ? (error as { cause?: unknown }).cause : null
    if (cause instanceof Error) {
      console.error('[migrate] Database error:', cause.message)
    }
    const msg = error instanceof Error ? error.message : String(error)
    if (/tenant\/user|ENOTFOUND|Tenant or user not found/i.test(msg)) {
      console.error(`
[migrate] Supabase rejected this DATABASE_URI (project missing, paused, or wrong pooler host).

Fix:
  1. Open https://supabase.com/dashboard → your Hyperion project (or create a new one).
  2. If the project is paused, click Restore.
  3. Project Settings → Database → Connect → Session pooler → copy the URI.
  4. Paste into .env.local as DATABASE_URI=...
     Username must be postgres.<project-ref> (not plain postgres).
     Host must match the dashboard exactly (aws-0-… or aws-1-… + correct region).
  5. Re-run: npm run migrate
`)
    }
    throw error
  }
  return payload
}
