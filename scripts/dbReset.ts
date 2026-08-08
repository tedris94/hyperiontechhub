import path from 'path'
import {
  createDbClient,
  dropLegacyTables,
  extractMigrationSql,
  migrationPath,
  runStatements,
  splitSqlStatements,
} from './dbSql.js'

/**
 * Drop legacy pre-Payload Supabase uuid tables and roll back the initial Payload migration SQL if present.
 */
async function main() {
  const client = await createDbClient()
  try {
    console.log('[db:reset] Dropping legacy Supabase uuid tables…')
    await dropLegacyTables(client)

    const root = process.cwd()
    const migFile = migrationPath(root)
    try {
      const downSql = extractMigrationSql(migFile, 'down')
      const statements = splitSqlStatements(downSql)
      console.log(`[db:reset] Running ${statements.length} down statements from initial migration…`)
      await runStatements(client, statements, { label: 'reset-down', ignoreMissing: true })
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      console.warn('[db:reset] Initial migration down skipped:', msg)
    }

    await client.query('DROP TABLE IF EXISTS public.payload_migrations CASCADE')
    console.log('[db:reset] Cleared payload_migrations. Next: npm run migrate (or migrate:chunked) && npm run seed')
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
