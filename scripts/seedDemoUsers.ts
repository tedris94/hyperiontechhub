/**
 * Upsert Hyperion demo login users and reset passwords to demo1234.
 * Skips migrate() so it won't hang on the "dev push / data loss" prompt.
 */
import { loadProjectEnv } from './loadEnv.js'
import { prepareDatabaseUri } from './resolveDbUri.js'

const DEMO_USERS = [
  {
    email: process.env.SEED_SUPER_ADMIN_EMAIL || 'superadmin@hyperiontechhub.com',
    password: process.env.SEED_SUPER_ADMIN_PASSWORD || 'demo1234',
    fullName: 'Super Admin',
    role: 'super_admin' as const,
  },
  {
    email: 'admin@hyperiontechhub.com',
    password: 'demo1234',
    fullName: 'Admin User',
    role: 'admin' as const,
  },
  {
    email: 'consultant@hyperiontechhub.com',
    password: 'demo1234',
    fullName: 'Consultant',
    role: 'consultant' as const,
  },
  {
    email: 'student@hyperiontechhub.com',
    password: 'demo1234',
    fullName: 'Student',
    role: 'student' as const,
  },
]

async function main() {
  const root = loadProjectEnv()
  process.chdir(root)
  delete process.env.PAYLOAD_MIGRATING
  process.env.DATABASE_URI = await prepareDatabaseUri(process.env.DATABASE_URI!)

  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config, key: `seed-demo-users:${Date.now()}` })

  for (const user of DEMO_USERS) {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: user.email } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: user.email,
          password: user.password,
          fullName: user.fullName,
          role: user.role,
        },
        overrideAccess: true,
      })
      console.log(`Created ${user.email}`)
    } else {
      const id = existing.docs[0].id
      await payload.update({
        collection: 'users',
        id,
        data: {
          password: user.password,
          fullName: user.fullName,
          role: user.role,
        },
        overrideAccess: true,
      })
      console.log(`Updated password for ${user.email}`)
    }
  }

  console.log('Demo users ready. Try: superadmin@hyperiontechhub.com / demo1234')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
