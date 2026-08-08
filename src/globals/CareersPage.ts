import type { GlobalConfig } from 'payload'
import { ctaGroup } from '../blocks/shared'

export const CareersPage: GlobalConfig = {
  slug: 'careers-page',
  label: 'Careers Page',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'whyJoin',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'applicationForm',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'submitLabel', type: 'text' },
        { name: 'successMessage', type: 'textarea' },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'description', type: 'textarea' },
        ctaGroup('primary', 'Primary CTA'),
      ],
    },
  ],
}
