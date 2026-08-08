import type { CollectionConfig } from 'payload'
import { iconSelect } from '../blocks/shared'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sortOrder', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    iconSelect('icon', 'Lucide icon key'),
    { name: 'color', type: 'text', admin: { description: 'Tailwind classes e.g. bg-blue-50 text-[#1A2BC2]' } },
    { name: 'href', type: 'text', admin: { description: 'Optional link e.g. /products/edusuite' } },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
