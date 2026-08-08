import { getPayloadWithMigrations } from './initDb.js'

async function main() {
  const statusOnly = process.argv.includes('--status')
  const payload = await getPayloadWithMigrations()

  if (statusOnly) {
    await payload.db.migrateStatus()
  } else {
    console.log('Migrations complete.')
  }
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
