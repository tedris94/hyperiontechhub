import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import fallbackJson from '@/content/site-content.json'

export interface NavItem {
  label: string
  href: string
}

type FallbackCareers = typeof fallbackJson.careers
type FallbackGetStarted = typeof fallbackJson.getStarted
type FallbackConsultation = typeof fallbackJson.consultation

export interface SiteContent {
  site: {
    name: string
    tagline: string
    description: string
    url: string
    logo: { src: string; alt: string }
  }
  adminMetrics: { revenueTotal: number; currency: string }
  header: {
    navigation: NavItem[]
    cta: {
      loginLabel: string
      dashboardLabel: string
      primary: { label: string; href: string }
    }
  }
  home: {
    hero: {
      badge: string
      titleLines: string[]
      description: string
      primaryCta: { label: string; href: string }
      secondaryCta: { label: string; href: string }
      stats: Array<{ value: string; label: string }>
      image: { src: string; alt: string }
    }
    services: {
      heading: string
      description: string
      cta: { label: string; href: string }
      fallbackItems: Array<{
        title: string
        description: string
        icon: string
        color: string
        href?: string
      }>
    }
    purpose: {
      heading: string
      subheading: string
      image: { src: string; alt: string }
      paragraphs: string[]
      values: Array<{ title: string; description: string; icon: string }>
      statement: string
    }
    contact: {
      heading: string
      subheading: string
      introHeading: string
      introText: string
      email: string
      phone: string
      address: string
      whyChooseUs: string[]
      form: {
        successTitle: string
        successMessage: string
        errorTitle: string
        errorMessage: string
        fields: Record<string, string>
        serviceOptions: Array<{ value: string; label: string }>
        submitLabel: string
        submittingLabel: string
      }
    }
  }
  careers: FallbackCareers
  getStarted: FallbackGetStarted
  consultation: FallbackConsultation
  footer: {
    description: string
    contact: { email: string; phone: string; address: string }
    columns: { company: NavItem[]; services: NavItem[]; support: NavItem[] }
    social: Array<{ label: string; href: string }>
    copyright: string
  }
}

function getFallbackContent(): SiteContent {
  // Use the bundled import — filesystem reads fail on Vercel serverless
  // where `/var/task/src/content/...` is not present at runtime.
  return fallbackJson as SiteContent
}

function mediaUrl(media: unknown): string | undefined {
  if (!media || typeof media !== 'object') return undefined
  const m = media as { url?: string; filename?: string }
  return m.url || (m.filename ? `/api/media/file/${m.filename}` : undefined)
}

export async function getSiteContent(): Promise<SiteContent> {
  const fallback = getFallbackContent()

  if (!isPayloadEnabled()) {
    return fallback
  }

  try {
    const payload = await getPayloadSingleton()
    const [siteSettings, header, footer, careersPage] = await Promise.all([
      payload.findGlobal({ slug: 'site-settings', depth: 1 }),
      payload.findGlobal({ slug: 'header' }),
      payload.findGlobal({ slug: 'footer' }),
      payload.findGlobal({ slug: 'careers-page' }),
    ])

    const jobsResult = await payload.find({
      collection: 'jobs',
      where: { status: { equals: 'active' } },
      sort: '-createdAt',
      limit: 100,
    })

    const payloadJobs =
      jobsResult.docs.length > 0
        ? jobsResult.docs.map((job) => ({
            id: job.id,
            title: job.title as string,
            department: (job.department as string) || '',
            location: (job.location as string) || '',
            type: (job.type as string) || '',
            salary: (job.salaryRange as string) || '',
            experience: '',
            description: (job.description as string) || '',
            responsibilities: [] as string[],
            requirements:
              (job.requirements as Array<{ item?: string }> | undefined)?.map((r) => r.item || '') ||
              [],
          }))
        : fallback.careers.openings.jobs

    return {
      ...fallback,
      site: {
        name: siteSettings?.siteName || fallback.site.name,
        tagline: fallback.site.tagline,
        description: fallback.site.description,
        url: siteSettings?.siteUrl || fallback.site.url,
        logo: {
          src: mediaUrl(siteSettings?.logo) || fallback.site.logo.src,
          alt: siteSettings?.logoAlt || fallback.site.logo.alt,
        },
      },
      adminMetrics: {
        revenueTotal: siteSettings?.revenueTotal ?? fallback.adminMetrics.revenueTotal,
        currency: siteSettings?.currency || fallback.adminMetrics.currency,
      },
      header: {
        navigation: fallback.header.navigation,
        cta: {
          loginLabel: header?.cta?.loginLabel || fallback.header.cta.loginLabel,
          dashboardLabel: header?.cta?.dashboardLabel || fallback.header.cta.dashboardLabel,
          primary: {
            label: header?.cta?.primary?.label || fallback.header.cta.primary.label,
            href: header?.cta?.primary?.href || fallback.header.cta.primary.href,
          },
        },
      },
      home: {
        ...fallback.home,
        hero: fallback.home.hero,
        services: {
          heading: fallback.home.services.heading,
          description: fallback.home.services.description,
          cta: fallback.home.services.cta,
          fallbackItems: fallback.home.services.fallbackItems,
        },
        purpose: fallback.home.purpose,
        contact: fallback.home.contact,
      },
      footer: {
        description: fallback.footer.description,
        contact: {
          email: footer?.contact?.email || fallback.footer.contact.email,
          phone: footer?.contact?.phone || fallback.footer.contact.phone,
          address: fallback.footer.contact.address,
        },
        columns: fallback.footer.columns,
        social:
          footer?.social?.map((s: { platform?: string; href?: string }) => ({
            label: s.platform || '',
            href: s.href || '',
          })) || fallback.footer.social,
        copyright: footer?.copyright || fallback.footer.copyright,
      },
      careers: {
        ...fallback.careers,
        hero: {
          badge: fallback.careers.hero.badge,
          title: careersPage?.hero?.title || fallback.careers.hero.title,
          description: careersPage?.hero?.description || fallback.careers.hero.description,
        },
        whyJoin: {
          ...fallback.careers.whyJoin,
          items:
            careersPage?.whyJoin?.map((item) => ({
              icon: '💼',
              title: item.title || '',
              description: item.description ?? '',
            })) || fallback.careers.whyJoin.items,
        },
        openings: {
          ...fallback.careers.openings,
          jobs: payloadJobs,
        },
        application: {
          ...fallback.careers.application,
          form: {
            ...fallback.careers.application.form,
            submitLabel:
              careersPage?.applicationForm?.submitLabel ||
              fallback.careers.application.form.submitLabel,
          },
        },
        cta: {
          heading: careersPage?.cta?.heading || fallback.careers.cta.heading,
          description: careersPage?.cta?.description || fallback.careers.cta.description,
          buttonLabel: careersPage?.cta?.primary?.label || fallback.careers.cta.buttonLabel,
          buttonHref: careersPage?.cta?.primary?.href || fallback.careers.cta.buttonHref,
        },
      },
      getStarted: fallback.getStarted,
      consultation: fallback.consultation,    }
  } catch (error) {
    console.error('[getSiteContent] Payload unavailable, using JSON fallback:', error)
    return fallback
  }
}

export async function getServicesFromPayload() {
  if (!isPayloadEnabled()) return []
  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({ collection: 'services', sort: 'sortOrder', limit: 100 })
    return result.docs
  } catch {
    return []
  }
}
