import { loadProjectEnv } from './loadEnv.js'
import { prepareDatabaseUri } from './resolveDbUri.js'
import { execSync } from 'node:child_process'

const root = loadProjectEnv()
process.chdir(root)

const name = process.argv[2] || 'initial'

async function main() {
  const migrateUri = process.env.DATABASE_URI_MIGRATE?.trim()
  const appUri = process.env.DATABASE_URI?.trim()
  const uri = migrateUri || appUri
  if (!uri) throw new Error('DATABASE_URI is missing in .env.local')
  process.env.DATABASE_URI = await prepareDatabaseUri(uri)
  execSync(`npx payload migrate:create ${name}`, {
    stdio: 'inherit',
    env: process.env,
    cwd: root,
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
