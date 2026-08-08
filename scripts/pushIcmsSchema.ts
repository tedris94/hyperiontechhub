import { loadProjectEnv } from './loadEnv.js'
import { prepareDatabaseUri } from './resolveDbUri.js'

async function main() {
  const root = loadProjectEnv()
  process.chdir(root)
  delete process.env.PAYLOAD_MIGRATING
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  process.env.DATABASE_URI = await prepareDatabaseUri(process.env.DATABASE_URI!)

  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  console.log('Initializing Payload (push enabled in non-production)…')
  const payload = await getPayload({ config, key: `push-icms:${Date.now()}` })
  const icms = payload.config.collections
    .map((c) => c.slug)
    .filter((s) => s.startsWith('icms-'))
  console.log('ICMS collections:', icms.join(', '))
  const r = await payload.find({ collection: 'icms-tenants', limit: 1, overrideAccess: true })
  console.log('icms-tenants table OK, docs:', r.totalDocs)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
