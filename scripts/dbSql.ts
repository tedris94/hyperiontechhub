import fs from 'fs'
import path from 'path'
import pg from 'pg'
import { loadProjectEnv } from './loadEnv.js'
import { prepareDatabaseUri } from './resolveDbUri.js'

/** Pre-Payload Supabase tables (uuid ids) — must be removed before Payload migrate. */
export const LEGACY_SUPABASE_TABLES = [
  'admin_activity_logs',
  'app_user_activity',
  'active_sessions',
  'app_users',
  'page_views',
  'consultations',
  'contact_submissions',
] as const

export const INITIAL_MIGRATION = '20260706_134851_initial'

export async function createDbClient(): Promise<pg.Client> {
  const root = loadProjectEnv()
  process.chdir(root)

  const uri = process.env.DATABASE_URI?.trim()
  if (!uri) throw new Error('DATABASE_URI is missing in .env.local')

  const client = new pg.Client({
    connectionString: await prepareDatabaseUri(uri),
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()
  return client
}

export function extractMigrationSql(migrationPath: string, direction: 'up' | 'down'): string {
  const file = fs.readFileSync(migrationPath, 'utf8')
  const fn = direction === 'up' ? 'up' : 'down'
  const match = file.match(
    new RegExp(`export async function ${fn}[\\s\\S]*?await db\\.execute\\(sql\`([\\s\\S]*?)\`\\)`),
  )
  if (!match?.[1]) throw new Error(`Could not extract ${direction} SQL from ${migrationPath}`)
  return match[1]
}

export function splitSqlStatements(sqlText: string): string[] {
  return sqlText
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export async function runStatements(
  client: pg.Client,
  statements: string[],
  options?: { label?: string; ignoreMissing?: boolean },
): Promise<number> {
  const label = options?.label ?? 'sql'
  let applied = 0
  for (const statement of statements) {
    try {
      await client.query(`${statement};`)
      applied++
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      const isCreateTable = /^CREATE TABLE/i.test(statement)
      if (msg.includes('already exists') && !isCreateTable) {
        applied++
        continue
      }
      if (
        options?.ignoreMissing &&
        (msg.includes('does not exist') || msg.includes('cannot drop'))
      ) {
        applied++
        continue
      }
      console.error(`[${label}] Failed at statement ${applied + 1}:`, statement.slice(0, 100), '…')
      if (isCreateTable && msg.includes('already exists')) {
        throw new Error(
          `${msg}\n\nA table already exists with an incompatible schema (often legacy Supabase uuid tables). Run: npm run db:reset`,
        )
      }
      throw error
    }
  }
  return applied
}

export function migrationPath(root: string): string {
  return path.join(root, 'src', 'migrations', `${INITIAL_MIGRATION}.ts`)
}

export async function dropLegacyTables(client: pg.Client): Promise<void> {
  for (const table of LEGACY_SUPABASE_TABLES) {
    await client.query(`DROP TABLE IF EXISTS public."${table}" CASCADE`)
  }
}
