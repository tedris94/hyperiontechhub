import type { CollectionConfig } from 'payload'
import { ALL_CAPABILITIES } from '@/lib/capabilities'

export const DashboardRoles: CollectionConfig = {
  slug: 'dashboard-roles',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    hidden: true,
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => (req.user as { role?: string })?.role === 'super_admin',
    update: ({ req }) => (req.user as { role?: string })?.role === 'super_admin',
    delete: ({ req }) => (req.user as { role?: string })?.role === 'super_admin',
  },
  timestamps: true,
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'capabilities',
      type: 'array',
      fields: [
        {
          name: 'key',
          type: 'select',
          required: true,
          options: ALL_CAPABILITIES.map((c) => ({ label: c.label, value: c.key })),
        },
      ],
    },
    { name: 'isSystem', type: 'checkbox', defaultValue: true },
  ],
}
