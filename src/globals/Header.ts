import type { GlobalConfig } from 'payload'
import { ctaGroup } from '../blocks/shared'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Site Header',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'navigation',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'loginLabel', type: 'text' },
        { name: 'dashboardLabel', type: 'text' },
        ctaGroup('primary', 'Primary CTA'),
      ],
    },
  ],
}
