import type { CollectionConfig } from 'payload'

const staffRoles = ['super_admin', 'admin', 'consultant']

export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'jobTitle', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => staffRoles.includes((req.user as { role?: string })?.role ?? ''),
    create: () => true,
    update: ({ req }) => ['super_admin', 'admin'].includes((req.user as { role?: string })?.role ?? ''),
    delete: ({ req }) => (req.user as { role?: string })?.role === 'super_admin',
  },
  timestamps: true,
  fields: [
    { name: 'job', type: 'relationship', relationTo: 'jobs', required: true },
    { name: 'jobTitle', type: 'text' },
    { name: 'applicationRef', type: 'text', unique: true, admin: { readOnly: true } },
    { name: 'fullName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'coverLetter', type: 'textarea' },
    { name: 'resume', type: 'upload', relationTo: 'media' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Shortlisted', value: 'shortlisted' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && data?.job && req.payload) {
          const jobId = typeof data.job === 'object' ? data.job.id : data.job
          const job = await req.payload.findByID({ collection: 'jobs', id: jobId })
          return { ...data, jobTitle: job?.title ?? data.jobTitle }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create' && !doc.applicationRef && req.payload) {
          const { formatApplicationRef } = await import('../lib/applicationRef')
          await req.payload.update({
            collection: 'applications',
            id: doc.id,
            data: { applicationRef: formatApplicationRef(doc.id) },
            overrideAccess: true,
          })
        }
      },
    ],
  },
}
