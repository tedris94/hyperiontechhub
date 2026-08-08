import type { GlobalConfig } from 'payload'

export const ConsultationPage: GlobalConfig = {
  slug: 'consultation-page',
  label: 'Consultation Page',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    { name: 'successMessage', type: 'textarea' },
    { name: 'errorMessage', type: 'textarea' },
    {
      name: 'serviceOptions',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'timeSlots',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'formLabels',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'company', type: 'text' },
        { name: 'service', type: 'text' },
        { name: 'date', type: 'text' },
        { name: 'time', type: 'text' },
        { name: 'message', type: 'text' },
        { name: 'submit', type: 'text' },
      ],
    },
  ],
}
