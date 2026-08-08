import type { CollectionConfig } from 'payload'

const canReadAudit = (req: { user?: { role?: string } | null }) =>
  ['super_admin', 'admin'].includes(req.user?.role ?? '')

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['action', 'collectionSlug', 'userEmail', 'createdAt'],
    hidden: true,
    group: 'System',
  },
  access: {
    read: ({ req }) => canReadAudit(req),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  timestamps: true,
  fields: [
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'Login', value: 'login' },
        { label: 'Logout', value: 'logout' },
      ],
    },
    { name: 'collectionSlug', type: 'text' },
    { name: 'documentId', type: 'text' },
    { name: 'title', type: 'text' },
    { name: 'userId', type: 'number' },
    { name: 'userEmail', type: 'text' },
    { name: 'userRole', type: 'text' },
    { name: 'changes', type: 'json' },
    { name: 'ip', type: 'text' },
    { name: 'userAgent', type: 'text' },
  ],
}
