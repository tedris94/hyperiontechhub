import type { GlobalConfig } from 'payload'
import { ctaGroup } from '../blocks/shared'

export const GetStartedPage: GlobalConfig = {
  slug: 'get-started-page',
  label: 'Get Started Page',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      fields: [
        { name: 'number', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'services',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'whyChoose',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'finalCta',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'description', type: 'textarea' },
        ctaGroup('primary', 'Primary CTA'),
      ],
    },
  ],
}
