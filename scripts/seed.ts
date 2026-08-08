import { getPayloadWithMigrations } from './initDb.js'
import fs from 'fs/promises'
import path from 'path'

type SiteContent = Record<string, unknown>

async function main() {
  const root = process.cwd()
  const jsonPath = path.join(root, 'src', 'content', 'site-content.json')
  const raw = await fs.readFile(jsonPath, 'utf-8')
  const content = JSON.parse(raw) as SiteContent

  console.log('Applying database migrations before seed…')
  const payload = await getPayloadWithMigrations()

  const site = content.site as Record<string, unknown>
  const header = content.header as Record<string, unknown>
  const footer = content.footer as Record<string, unknown>
  const home = content.home as Record<string, unknown>
  const hero = home.hero as Record<string, unknown>
  const services = home.services as Record<string, unknown>
  const purpose = home.purpose as Record<string, unknown>
  const contact = home.contact as Record<string, unknown>
  const adminMetrics = content.adminMetrics as Record<string, unknown>

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: site.name,
      tagline: site.tagline,
      description: site.description,
      siteUrl: site.url,
      logoAlt: (site.logo as { alt?: string })?.alt,
      revenueTotal: adminMetrics.revenueTotal,
      currency: adminMetrics.currency,
      contactEmail: (footer.contact as { email?: string })?.email,
      contactPhone: (footer.contact as { phone?: string })?.phone,
      address: (footer.contact as { address?: string })?.address,
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'header',
    data: {
      navigation: (header.navigation as Array<{ label: string; href: string }>) || [],
      cta: header.cta,
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      description: footer.description,
      contact: footer.contact,
      social: (footer.social as Array<{ label: string; href: string }>)?.map((s) => ({
        platform: s.label,
        href: s.href,
      })),
      copyright: footer.copyright,
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      hero: {
        badge: hero.badge,
        titleLines: (hero.titleLines as string[])?.map((line) => ({ line })),
        description: hero.description,
        primaryCta: hero.primaryCta,
        secondaryCta: hero.secondaryCta,
        stats: hero.stats,
        heroImageAlt: (hero.image as { alt?: string })?.alt,
      },
      servicesSection: {
        heading: services.heading,
        description: services.description,
        cta: services.cta,
      },
      purpose: {
        heading: purpose.heading,
        description: purpose.subheading,
        items: (purpose.values as Array<{ title: string; description: string }>)?.map((v) => ({
          title: v.title,
          description: v.description,
        })),
      },
      contactSection: {
        heading: contact.heading,
        description: contact.subheading,
        submitLabel: (contact.form as { submitLabel?: string })?.submitLabel,
        serviceOptions: (contact.form as { serviceOptions?: Array<{ label: string }> })?.serviceOptions?.map(
          (o) => ({ label: o.label }),
        ),
      },
    },
    overrideAccess: true,
  })

  const fallbackItems = (services.fallbackItems as Array<Record<string, string>>) || []

  // Replace services with portfolio pillars from site-content.json
  try {
    const existingServices = await payload.find({
      collection: 'services',
      limit: 200,
      overrideAccess: true,
    })
    for (const doc of existingServices.docs) {
      await payload.delete({
        collection: 'services',
        id: doc.id,
        overrideAccess: true,
      })
    }
    for (let i = 0; i < fallbackItems.length; i++) {
      const item = fallbackItems[i]
      const base = {
        title: item.title,
        description: item.description,
        icon: item.icon,
        color: item.color,
        sortOrder: i,
      }
      try {
        await payload.create({
          collection: 'services',
          data: { ...base, href: item.href || '' },
          overrideAccess: true,
        })
      } catch {
        await payload.create({
          collection: 'services',
          data: base,
          overrideAccess: true,
        })
      }
    }
  } catch (error) {
    console.warn('[seed] services refresh skipped:', error)
  }

  // Seed portfolio case studies (requires migrated portfolio-items columns)
  try {
    const portfolioPath = path.join(root, 'src', 'content', 'portfolio-cases.json')
    const portfolioRaw = await fs.readFile(portfolioPath, 'utf-8')
    const portfolioCases = JSON.parse(portfolioRaw) as Array<Record<string, unknown>>
    for (const item of portfolioCases) {
      const slug = String(item.slug)
      const existing = await payload.find({
        collection: 'portfolio-items',
        where: { slug: { equals: slug } },
        limit: 1,
        overrideAccess: true,
      })
      const data = {
        title: item.title as string,
        slug,
        client: (item.client as string) || '',
        industry: (item.industry as string) || 'other',
        category: (item.category as string) || '',
        summary: (item.summary as string) || '',
        description: (item.summary as string) || '',
        challenge: (item.challenge as string) || '',
        solution: (item.solution as string) || '',
        results: ((item.results as string[]) || []).map((r) => ({ item: r })),
        projectUrl: (item.projectUrl as string) || '',
        technologies: ((item.technologies as string[]) || []).map((name) => ({ name })),
        featured: Boolean(item.featured),
        sortOrder: Number(item.sortOrder) || 0,
      }
      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'portfolio-items',
          data,
          overrideAccess: true,
        })
      } else {
        await payload.update({
          collection: 'portfolio-items',
          id: existing.docs[0].id,
          data,
          overrideAccess: true,
        })
      }
    }
  } catch (error) {
    console.warn('[seed] portfolio-items seed skipped (run migrate if columns missing):', error)
  }

  const careers = content.careers as Record<string, unknown>
  const jobs = (careers.openings as { jobs?: Array<Record<string, unknown>> })?.jobs || []
  for (const job of jobs) {
    const slug = String(job.title).toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const existing = await payload.find({
      collection: 'jobs',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'jobs',
        data: {
          title: job.title,
          slug,
          department: job.department,
          location: job.location,
          type: job.type,
          description: job.description,
          status: 'active',
        },
        overrideAccess: true,
      })
    }
  }

  const { seedContentPages } = await import('./seedContentPages')
  await seedContentPages(payload)

  const superAdminEmail = process.env.SEED_SUPER_ADMIN_EMAIL || 'superadmin@hyperiontechhub.com'
  const superAdminPassword = process.env.SEED_SUPER_ADMIN_PASSWORD || 'demo1234'

  const existingAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: superAdminEmail } },
    limit: 1,
    overrideAccess: true,
  })

  if (existingAdmin.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: superAdminEmail,
        password: superAdminPassword,
        fullName: 'Super Admin',
        role: 'super_admin',
      },
      overrideAccess: true,
    })
  }

  for (const demo of [
    { email: 'admin@hyperiontechhub.com', fullName: 'Admin User', role: 'admin' },
    { email: 'consultant@hyperiontechhub.com', fullName: 'Consultant', role: 'consultant' },
    { email: 'student@hyperiontechhub.com', fullName: 'Student', role: 'student' },
  ]) {
    const found = await payload.find({
      collection: 'users',
      where: { email: { equals: demo.email } },
      limit: 1,
      overrideAccess: true,
    })
    if (found.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: { ...demo, password: 'demo1234' },
        overrideAccess: true,
      })
    }
  }

  const { ensureDashboardRolesSeeded } = await import('../src/lib/resolveCapabilities')
  await ensureDashboardRolesSeeded()

  const { seedLmsDemo } = await import('./seedLms.js')
  await seedLmsDemo(payload)

  console.log('Seed complete.')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
