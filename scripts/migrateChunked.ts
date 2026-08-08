import path from 'path'
import {
  createDbClient,
  extractMigrationSql,
  INITIAL_MIGRATION,
  migrationPath,
  runStatements,
  splitSqlStatements,
} from './dbSql.js'

/**
 * Pooler-safe chunked apply of the initial Postgres migration (Supabase Session pooler on Windows).
 */
async function main() {
  const client = await createDbClient()
  try {
    const root = process.cwd()
    const migFile = migrationPath(root)
    const upSql = extractMigrationSql(migFile, 'up')
    const statements = splitSqlStatements(upSql)
    console.log(`[migrate:chunked] Applying ${statements.length} statements from ${INITIAL_MIGRATION}…`)
    await runStatements(client, statements, { label: 'chunked-up' })

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.payload_migrations (
        id serial PRIMARY KEY,
        name varchar,
        batch numeric,
        updated_at timestamptz DEFAULT now() NOT NULL,
        created_at timestamptz DEFAULT now() NOT NULL
      )
    `)
    const existing = await client.query(
      `SELECT 1 FROM public.payload_migrations WHERE name = $1 LIMIT 1`,
      [INITIAL_MIGRATION],
    )
    if (existing.rowCount === 0) {
      await client.query(
        `INSERT INTO public.payload_migrations (name, batch) VALUES ($1, 1)`,
        [INITIAL_MIGRATION],
      )
    }

    console.log('[migrate:chunked] Initial migration recorded. Run: npm run migrate && npm run seed')
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
