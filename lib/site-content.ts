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
