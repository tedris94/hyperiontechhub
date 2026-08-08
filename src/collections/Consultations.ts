import type { CollectionConfig } from 'payload'

export const Consultations: CollectionConfig = {
  slug: 'consultations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'service', 'status', 'preferredDate'],
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
    { name: 'phone', type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'service', type: 'text', required: true },
    { name: 'preferredDate', type: 'date', required: true },
    { name: 'preferredTime', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    { name: 'read', type: 'checkbox', defaultValue: false },
    { name: 'assignedTo', type: 'relationship', relationTo: 'users' },
    { name: 'assignedToName', type: 'text' },
    { name: 'googleMeetLink', type: 'text' },
    { name: 'notes', type: 'textarea' },
  ],
}
