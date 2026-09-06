import { loadProjectEnv } from './loadEnv.js'
import { prepareDatabaseUri } from './resolveDbUri.js'

async function main() {
  const root = loadProjectEnv()
  process.chdir(root)
  delete process.env.PAYLOAD_MIGRATING
  process.env.DATABASE_URI = await prepareDatabaseUri(process.env.DATABASE_URI!)

  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config, key: `verify-login:${Date.now()}` })

  const found = await payload.find({
    collection: 'users',
    where: { email: { equals: 'superadmin@hyperiontechhub.com' } },
    limit: 1,
    overrideAccess: true,
  })
  console.log('user_exists', found.totalDocs > 0, 'id', found.docs[0]?.id, 'role', found.docs[0]?.role)

  try {
    const login = await payload.login({
      collection: 'users',
      data: {
        email: 'superadmin@hyperiontechhub.com',
        password: 'demo1234',
      },
    })
    console.log('login_ok', login.user?.email, login.user?.role)
  } catch (error) {
    console.error('login_failed', error instanceof Error ? error.message : error)
    process.exitCode = 1
  }

  process.exit(process.exitCode ?? 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
