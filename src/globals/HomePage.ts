import type { GlobalConfig } from 'payload'
import { pageBlocks } from '../blocks'
import { ctaGroup } from '../blocks/shared'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'layout',
      type: 'blocks',
      blocks: pageBlocks,
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text' },
        {
          name: 'titleLines',
          type: 'array',
          fields: [{ name: 'line', type: 'text', required: true }],
        },
        { name: 'description', type: 'textarea' },
        ctaGroup('primaryCta', 'Primary CTA'),
        ctaGroup('secondaryCta', 'Secondary CTA'),
        {
          name: 'stats',
          type: 'array',
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
          ],
        },
        { name: 'heroImage', type: 'upload', relationTo: 'media' },
        { name: 'heroImageAlt', type: 'text' },
      ],
    },
    {
      name: 'servicesSection',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'description', type: 'textarea' },
        ctaGroup('cta', 'CTA'),
      ],
    },
    {
      name: 'purpose',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
          ],
        },
      ],
    },
    {
      name: 'contactSection',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'submitLabel', type: 'text' },
        {
          name: 'serviceOptions',
          type: 'array',
          fields: [{ name: 'label', type: 'text', required: true }],
        },
      ],
    },
  ],
}
