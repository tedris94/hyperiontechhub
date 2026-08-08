import { loadProjectEnv } from './loadEnv.js'
import { prepareDatabaseUri } from './resolveDbUri.js'
import {
  ensureOwnerMembership,
  seedTenantDemoContent,
  upsertAnasTenant,
} from '../src/lib/icms/seed.ts'

async function getPayloadForSeed() {
  const root = loadProjectEnv()
  process.chdir(root)
  delete process.env.PAYLOAD_MIGRATING
  process.env.DATABASE_URI = await prepareDatabaseUri(process.env.DATABASE_URI!)
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  return getPayload({ config, key: `seed-icms:${Date.now()}` })
}

async function main() {
  const payload = await getPayloadForSeed()
  console.log('Seeding Hyperion ICMS (Anas bn Malik)…')

  const tenantId = await upsertAnasTenant(payload)
  console.log('Tenant upserted:', tenantId)

  await seedTenantDemoContent(payload, tenantId, { clear: true })
  console.log('Demo content seeded')

  await ensureOwnerMembership(payload, tenantId)
  console.log('Owner membership ensured')

  console.log('ICMS seed complete.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
