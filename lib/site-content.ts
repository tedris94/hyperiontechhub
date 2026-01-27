import fs from 'fs/promises';
import path from 'path';

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteContent {
  site: {
    name: string;
    tagline: string;
    description: string;
    url: string;
    logo: {
      src: string;
      alt: string;
    };
  };
  adminMetrics: {
    revenueTotal: number;
    currency: string;
  };
  header: {
    navigation: NavItem[];
    cta: {
      loginLabel: string;
      dashboardLabel: string;
      primary: {
        label: string;
        href: string;
      };
    };
  };
  home: {
    hero: {
      badge: string;
      titleLines: string[];
      description: string;
      primaryCta: { label: string; href: string };
      secondaryCta: { label: string; href: string };
      stats: Array<{ value: string; label: string }>;
      image: { src: string; alt: string };
    };
    services: {
      heading: string;
      description: string;
      cta: { label: string; href: string };
      fallbackItems: Array<{
        title: string;
        description: string;
        icon: string;
        color: string;
      }>;
    };
    purpose: {
      heading: string;
      subheading: string;
      image: { src: string; alt: string };
      paragraphs: string[];
      values: Array<{ title: string; description: string; icon: string }>;
      statement: string;
    };
    contact: {
      heading: string;
      subheading: string;
      introHeading: string;
      introText: string;
      email: string;
      phone: string;
      address: string;
      whyChooseUs: string[];
      form: {
        successTitle: string;
        successMessage: string;
        errorTitle: string;
        errorMessage: string;
        fields: {
          nameLabel: string;
          namePlaceholder: string;
          emailLabel: string;
          emailPlaceholder: string;
          phoneLabel: string;
          phonePlaceholder: string;
          serviceLabel: string;
          servicePlaceholder: string;
          messageLabel: string;
          messagePlaceholder: string;
        };
        serviceOptions: Array<{ value: string; label: string }>;
        submitLabel: string;
        submittingLabel: string;
      };
    };
  };
  careers: {
    hero: {
      badge: string;
      title: string;
      description: string;
    };
    whyJoin: {
      heading: string;
      subheading: string;
      items: Array<{ icon: string; title: string; description: string }>;
    };
    openings: {
      heading: string;
      subheading: string;
      jobs: Array<{
        id: number;
        title: string;
        department: string;
        location: string;
        type: string;
        salary: string;
        experience: string;
        description: string;
        responsibilities: string[];
        requirements: string[];
      }>;
    };
    application: {
      form: {
        namePlaceholder: string;
        emailPlaceholder: string;
        phonePlaceholder: string;
        coverLetterPlaceholder: string;
        resumeLabel: string;
        submitLabel: string;
      };
    };
    cta: {
      heading: string;
      description: string;
      buttonLabel: string;
      buttonHref: string;
    };
  };
  getStarted: {
    hero: {
      title: string;
      highlight: string;
      description: string;
      ctaLabel: string;
      ctaHref: string;
    };
    steps: {
      heading: string;
      subheading: string;
      items: Array<{
        number: string;
        title: string;
        description: string;
        icon: string;
      }>;
    };
    services: {
      heading: string;
      subheading: string;
      items: Array<{
        title: string;
        description: string;
        link: string;
      }>;
    };
    whyChoose: {
      heading: string;
      items: string[];
      ctaTitle: string;
      ctaDescription: string;
      ctaLabel: string;
      ctaHref: string;
    };
    finalCta: {
      heading: string;
      description: string;
      primaryLabel: string;
      primaryHref: string;
      secondaryLabel: string;
      secondaryHref: string;
    };
  };
  consultation: {
    hero: {
      title: string;
      highlight: string;
      description: string;
    };
    success: {
      title: string;
      message: string;
      ctaLabel: string;
      ctaHref: string;
    };
    error: {
      title: string;
      message: string;
    };
    form: {
      labels: {
        name: string;
        email: string;
        phone: string;
        company: string;
        service: string;
        preferredDate: string;
        preferredTime: string;
        message: string;
      };
      placeholders: {
        name: string;
        email: string;
        phone: string;
        company: string;
        message: string;
      };
      servicePlaceholder: string;
      timePlaceholder: string;
      submitLabel: string;
    };
    services: string[];
    timeSlots: string[];
  };
  footer: {
    description: string;
    contact: {
      email: string;
      phone: string;
      address: string;
    };
    columns: {
      company: NavItem[];
      services: NavItem[];
      support: NavItem[];
    };
    social: Array<{ label: string; href: string }>;
    copyright: string;
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  const contentPath = path.join(process.cwd(), 'content', 'site-content.json');
  const file = await fs.readFile(contentPath, 'utf-8');
  return JSON.parse(file) as SiteContent;
}
