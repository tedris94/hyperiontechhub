/**
 * After schema push (batch = -1), production Payload init calls interactive prompts()
 * and crashes on Vercel → POST /api/users/login 500.
 *
 * This removes the dev-push marker and records shipped migrations as already applied
 * (schema already matches from local push/seed).
 */
import { loadProjectEnv } from './loadEnv.js'
import { prepareDatabaseUri } from './resolveDbUri.js'
import { migrations } from '../src/migrations/index.ts'

async function main() {
  const root = loadProjectEnv()
  process.chdir(root)
  delete process.env.PAYLOAD_MIGRATING
  process.env.DATABASE_URI = await prepareDatabaseUri(process.env.DATABASE_URI!)

  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  // Avoid prodMigrations path during this repair by forcing non-production for init only.
  const prevNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  process.env.PAYLOAD_DB_PUSH = '0'

  const payload = await getPayload({ config, key: `fix-migrations:${Date.now()}` })

  const existing = await payload.find({
    collection: 'payload-migrations',
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })

  console.log(
    'Current payload-migrations:',
    existing.docs.map((d) => ({ id: d.id, name: d.name, batch: d.batch })),
  )

  const devPushRows = existing.docs.filter((d) => d.batch === -1 || d.name === 'dev')
  for (const row of devPushRows) {
    await payload.delete({
      collection: 'payload-migrations',
      id: row.id,
      overrideAccess: true,
    })
    console.log('Deleted dev-push migration row', row.id, row.name, row.batch)
  }

  const remaining = await payload.find({
    collection: 'payload-migrations',
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })
  const have = new Set(remaining.docs.map((d) => String(d.name)))

  let batch = 1
  const batches = remaining.docs
    .map((d) => Number(d.batch))
    .filter((n) => Number.isFinite(n) && n > 0)
  if (batches.length) batch = Math.max(...batches)

  for (const migration of migrations) {
    if (have.has(migration.name)) {
      console.log('Already recorded:', migration.name)
      continue
    }
    await payload.create({
      collection: 'payload-migrations',
      data: {
        name: migration.name,
        batch,
      },
      overrideAccess: true,
    })
    console.log('Marked applied:', migration.name, 'batch', batch)
  }

  process.env.NODE_ENV = prevNodeEnv
  console.log('Done. Redeploy (or retry login) — production migrate should no longer prompt.')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
