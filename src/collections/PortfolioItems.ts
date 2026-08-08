import type { CollectionConfig } from 'payload'

export const PortfolioItems: CollectionConfig = {
  slug: 'portfolio-items',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'industry', 'updatedAt'],
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
      unique: true,
      admin: { description: 'URL slug e.g. bright-olivelight-schools' },
    },
    { name: 'client', type: 'text' },
    {
      name: 'industry',
      type: 'select',
      options: [
        { label: 'Schools', value: 'schools' },
        { label: 'SMEs', value: 'smes' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'other',
    },
    { name: 'category', type: 'text' },
    { name: 'summary', type: 'textarea' },
    { name: 'description', type: 'textarea' },
    { name: 'challenge', type: 'textarea' },
    { name: 'solution', type: 'textarea' },
    {
      name: 'results',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    { name: 'projectUrl', type: 'text' },
    {
      name: 'technologies',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
