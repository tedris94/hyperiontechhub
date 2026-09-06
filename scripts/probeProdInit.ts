/** Simulate Vercel production Payload init against current DATABASE_URI. */
import { loadProjectEnv } from './loadEnv.js'
import { prepareDatabaseUri } from './resolveDbUri.js'

async function main() {
  const root = loadProjectEnv()
  process.chdir(root)
  process.env.DATABASE_URI = await prepareDatabaseUri(process.env.DATABASE_URI!)
  process.env.NODE_ENV = 'production'
  process.env.PAYLOAD_DB_PUSH = '0'
  delete process.env.PAYLOAD_MIGRATING

  console.log('NODE_ENV', process.env.NODE_ENV)
  console.log('DATABASE_URI host', process.env.DATABASE_URI.replace(/:[^:@/]+@/, ':***@').slice(0, 120))

  try {
    const { getPayload } = await import('payload')
    const { default: config } = await import('@payload-config')
    const payload = await getPayload({ config, key: `probe-prod:${Date.now()}`, cron: true })
    const users = await payload.find({
      collection: 'users',
      limit: 1,
      overrideAccess: true,
    })
    console.log('PROD_INIT_OK users', users.totalDocs)
  } catch (error) {
    console.error('PROD_INIT_FAIL')
    console.error(error)
    process.exitCode = 1
  }
  process.exit(process.exitCode ?? 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
