/**
 * Optional one-time WordPress import script.
 * Usage: NEXT_PUBLIC_WP_API_URL=https://cms.hyperiontechhub.com/wp-json/wp/v2 tsx scripts/import-wordpress.ts
 */
import { loadProjectEnv } from './loadEnv.js'

loadProjectEnv()

const WP_API = process.env.NEXT_PUBLIC_WP_API_URL

async function main() {
  if (!WP_API) {
    console.error('Set NEXT_PUBLIC_WP_API_URL to your WordPress REST base URL.')
    process.exit(1)
  }

  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })

  const pagesRes = await fetch(`${WP_API}/pages?per_page=100`)
  const pages = (await pagesRes.json()) as Array<{ slug: string; title: { rendered: string }; content: { rendered: string }; excerpt: { rendered: string } }>

  for (const page of pages) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.totalDocs > 0) continue

    await payload.create({
      collection: 'pages',
      data: {
        title: page.title.rendered.replace(/<[^>]+>/g, ''),
        slug: page.slug,
        status: 'published',
        excerpt: page.excerpt.rendered.replace(/<[^>]+>/g, ''),
      },
      overrideAccess: true,
    })
    console.log('Imported page:', page.slug)
  }

  const servicesRes = await fetch(`${WP_API}/services?per_page=100`)
  if (servicesRes.ok) {
    const services = (await servicesRes.json()) as Array<{ title: { rendered: string }; acf?: { description?: string; icon?: string; color?: string } }>
    for (let i = 0; i < services.length; i++) {
      const s = services[i]
      const title = s.title.rendered.replace(/<[^>]+>/g, '')
      const existing = await payload.find({
        collection: 'services',
        where: { title: { equals: title } },
        limit: 1,
        overrideAccess: true,
      })
      if (existing.totalDocs > 0) continue
      await payload.create({
        collection: 'services',
        data: {
          title,
          description: s.acf?.description || '',
          icon: (s.acf?.icon || 'Code2') as 'Code2',
          color: s.acf?.color || '',
          sortOrder: i,
        },
        overrideAccess: true,
      })
      console.log('Imported service:', title)
    }
  }

  console.log('WordPress import complete.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
