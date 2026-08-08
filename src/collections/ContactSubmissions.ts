import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'service', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => ['super_admin', 'admin'].includes((req.user as { role?: string })?.role ?? ''),
  },
  timestamps: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'service', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in_progress' },
        { label: 'Resolved', value: 'resolved' },
      ],
    },
    { name: 'read', type: 'checkbox', defaultValue: false },
    {
      name: 'replies',
      type: 'array',
      fields: [
        { name: 'message', type: 'textarea', required: true },
        { name: 'sentAt', type: 'date' },
        { name: 'sentBy', type: 'text' },
      ],
    },
  ],
}
