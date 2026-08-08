import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'Hyperion Tech Hub' },
    { name: 'tagline', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'siteUrl', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'logoAlt', type: 'text' },
    { name: 'contactEmail', type: 'email' },
    { name: 'contactPhone', type: 'text' },
    { name: 'address', type: 'textarea' },
    { name: 'defaultMetaTitle', type: 'text' },
    { name: 'defaultMetaDescription', type: 'textarea' },
    { name: 'defaultKeywords', type: 'text' },
    { name: 'googleSiteVerification', type: 'text' },
    { name: 'revenueTotal', type: 'number', defaultValue: 0, admin: { description: 'Admin dashboard metric' } },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    {
      name: 'showDemoAccounts',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Show Demo Accounts on the login page. Turn off on live production so visitors cannot see or one-click demo logins.',
      },
    },
  ],
}
