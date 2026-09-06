import { loadProjectEnv } from './loadEnv.js'
import { prepareDatabaseUri } from './resolveDbUri.js'
import { upsertAnasTenant } from '../src/lib/icms/seed.ts'

async function main() {
  const root = loadProjectEnv()
  process.chdir(root)
  delete process.env.PAYLOAD_MIGRATING
  process.env.DATABASE_URI = await prepareDatabaseUri(process.env.DATABASE_URI!)

  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config, key: `seed-icms-pages:${Date.now()}` })
  const tenantId = await upsertAnasTenant(payload)
  const { DEFAULT_PAGES } = await import('../src/lib/icms/site-defaults')

  for (const pageKey of ['dawah', 'waqf'] as const) {
    const page = DEFAULT_PAGES[pageKey]
    const existing = await payload.find({
      collection: 'icms-pages',
      where: { and: [{ tenant: { equals: tenantId } }, { pageKey: { equals: pageKey } }] },
      limit: 1,
      overrideAccess: true,
    })
    const data = {
      tenant: Number(tenantId),
      pageKey,
      heroTitle: page.heroTitle,
      heroSubtitle: page.heroSubtitle,
      introHeading: page.introHeading,
      introBody: page.introBody,
      blocks: page.blocks,
      missionHeading: page.missionHeading,
      missionItems: page.missionItems?.map((text) => ({ text })),
      visionItems: page.visionItems?.map((text) => ({ text })),
      imageUrl: page.imageUrl,
      arabicText: page.arabicText,
      arabicCaption: page.arabicCaption,
      waqfGoalAmount: page.waqfGoalAmount,
    }
    if (existing.docs[0]) {
      await payload.update({ collection: 'icms-pages', id: existing.docs[0].id, data, overrideAccess: true })
    } else {
      await payload.create({ collection: 'icms-pages', data, overrideAccess: true })
    }
    console.log(`Page seeded: ${pageKey}`)
  }

  console.log('Targeted ICMS page seed complete.')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
