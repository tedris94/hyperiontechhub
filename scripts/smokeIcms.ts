/**
 * Smoke test: second tenant isolation + Anas content present.
 * Run: npx tsx scripts/smokeIcms.ts
 */
import { loadProjectEnv } from './loadEnv.js'
import { prepareDatabaseUri } from './resolveDbUri.js'

async function main() {
  const root = loadProjectEnv()
  process.chdir(root)
  delete process.env.PAYLOAD_MIGRATING
  process.env.DATABASE_URI = await prepareDatabaseUri(process.env.DATABASE_URI!)
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config, key: `smoke-icms:${Date.now()}` })

  const anas = await payload.find({
    collection: 'icms-tenants',
    where: { slug: { equals: 'anas-bn-malik' } },
    limit: 1,
    overrideAccess: true,
  })
  if (anas.totalDocs === 0) throw new Error('Anas tenant missing')
  const anasId = anas.docs[0].id

  const anasArticles = await payload.find({
    collection: 'icms-articles',
    where: { tenant: { equals: anasId } },
    limit: 50,
    overrideAccess: true,
  })
  if (anasArticles.totalDocs < 3) {
    throw new Error(`Expected Anas articles, got ${anasArticles.totalDocs}`)
  }
  console.log('OK Anas articles:', anasArticles.totalDocs)

  const slug = 'smoke-isolation-center'
  const existing = await payload.find({
    collection: 'icms-tenants',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })
  let otherId: string | number
  if (existing.totalDocs > 0) {
    otherId = existing.docs[0].id
  } else {
    const created = await payload.create({
      collection: 'icms-tenants',
      data: {
        name: 'Smoke Isolation Center',
        slug,
        shortName: 'Smoke',
        status: 'active',
        planTier: 'community',
        colors: {
          emerald: '#0F5A43',
          forest: '#07382B',
          gold: '#C79A2C',
          ivory: '#FAF8F2',
          charcoal: '#1E1E1E',
          warmGray: '#6F6F6F',
        },
      },
      overrideAccess: true,
    })
    otherId = created.id
  }

  // Ensure other tenant has a unique article
  const otherArts = await payload.find({
    collection: 'icms-articles',
    where: {
      and: [{ tenant: { equals: otherId } }, { slug: { equals: 'other-only-article' } }],
    },
    limit: 1,
    overrideAccess: true,
  })
  if (otherArts.totalDocs === 0) {
    await payload.create({
      collection: 'icms-articles',
      data: {
        tenant: otherId,
        title: 'Other Only Article',
        slug: 'other-only-article',
        status: 'published',
        excerpt: 'Must not appear on Anas',
        body: [{ paragraph: 'Isolation check' }],
      },
      overrideAccess: true,
    })
  }

  const leak = await payload.find({
    collection: 'icms-articles',
    where: {
      and: [
        { tenant: { equals: anasId } },
        { slug: { equals: 'other-only-article' } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  })
  if (leak.totalDocs > 0) throw new Error('Isolation failed: other article visible on Anas tenant')

  const anasHasOwn = anasArticles.docs.some((d) => d.slug === 'striving-in-the-cause-of-allah')
  if (!anasHasOwn) throw new Error('Anas missing seeded article slug')

  const scopedOther = await payload.find({
    collection: 'icms-articles',
    where: { tenant: { equals: otherId } },
    limit: 20,
    overrideAccess: true,
  })
  const otherHasAnasSlug = scopedOther.docs.some(
    (d) => d.slug === 'striving-in-the-cause-of-allah',
  )
  if (otherHasAnasSlug) throw new Error('Isolation failed: Anas article on other tenant')

  console.log('OK isolation: second tenant articles do not leak to Anas')
  console.log('OK smoke tenant:', slug, 'articles:', scopedOther.totalDocs)
  console.log('ICMS smoke test passed.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
