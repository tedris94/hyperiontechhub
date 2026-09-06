import type { CollectionConfig } from 'payload'

export const PortfolioItems: CollectionConfig = {
  slug: 'portfolio-items',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'industry', 'projectUrl', 'updatedAt'],
    description:
      'Named case studies on the marketing site. Update Live app URL here when a client domain changes.',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL slug e.g. bright-olivelight-schools' },
    },
    { name: 'client', type: 'text', required: true },
    {
      name: 'industry',
      type: 'select',
      options: [
        { label: 'Schools', value: 'schools' },
        { label: 'Mosques', value: 'mosques' },
        { label: 'SMEs', value: 'smes' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'other',
    },
    { name: 'category', type: 'text' },
    { name: 'summary', type: 'textarea' },
    { name: 'challenge', type: 'textarea' },
    { name: 'solution', type: 'textarea' },
    {
      name: 'results',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'projectUrl',
      type: 'text',
      admin: {
        description:
          'Live app / site visitors open from the case study (e.g. https://bos.hyperiontechhub.com/)',
      },
    },
    {
      name: 'technologies',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Client logo for the logo garden (keep original brand colors)' },
    },
    {
      name: 'logoPath',
      type: 'text',
      admin: {
        description:
          'Optional static path fallback e.g. /assets/clients/bright-olivelight.png (used when logo upload is empty)',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Product / UI preview image on portfolio cards' },
    },
    {
      name: 'previewImagePath',
      type: 'text',
      admin: {
        description: 'Optional static preview path fallback e.g. /assets/portfolio/fizam-preview.png',
      },
    },
    {
      name: 'brandColors',
      type: 'array',
      admin: { description: 'Optional brand hex colors e.g. #6D1B72' },
      fields: [{ name: 'color', type: 'text', required: true }],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
