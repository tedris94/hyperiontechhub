import type { CollectionConfig } from 'payload'

const isAdmin = (req: { user?: { role?: string } | null }) =>
  ['super_admin', 'admin'].includes(req.user?.role ?? '')

export const AnalyticsEvents: CollectionConfig = {
  slug: 'analytics-events',
  admin: {
    useAsTitle: 'type',
    defaultColumns: ['type', 'path', 'createdAt'],
    hidden: true,
    group: 'System',
  },
  access: {
    read: ({ req }) => isAdmin(req),
    create: () => false,
    update: () => false,
    delete: ({ req }) => isAdmin(req),
  },
  timestamps: true,
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Page view', value: 'pageview' },
        { label: 'Session heartbeat', value: 'session' },
        { label: 'Click', value: 'click' },
      ],
    },
    { name: 'path', type: 'text', index: true },
    { name: 'referrer', type: 'text' },
    { name: 'sessionId', type: 'text', index: true },
    { name: 'visitorId', type: 'text', index: true },
    { name: 'userId', type: 'number' },
    { name: 'userEmail', type: 'text' },
    { name: 'userAgent', type: 'text' },
  ],
}
