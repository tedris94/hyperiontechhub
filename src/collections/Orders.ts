import type { CollectionConfig } from 'payload'
import { getAuthUser, isStaffRole } from './lms/access'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'student', 'course', 'amount', 'status', 'paidAt'],
  },
  access: {
    read: ({ req }) => {
      const user = getAuthUser(req)
      if (!user) return false
      if (isStaffRole(user.role)) return true
      return { student: { equals: user.id } }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => {
      const user = getAuthUser(req)
      return Boolean(user && isStaffRole(user.role))
    },
    delete: ({ req }) => {
      const user = getAuthUser(req)
      return Boolean(user && (user.role === 'super_admin' || user.role === 'admin'))
    },
  },
  fields: [
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      index: true,
    },
    { name: 'amount', type: 'number', required: true, min: 0 },
    { name: 'currency', type: 'text', defaultValue: 'NGN' },
    {
      name: 'provider',
      type: 'select',
      defaultValue: 'paystack',
      options: [{ label: 'Paystack', value: 'paystack' }],
    },
    { name: 'reference', type: 'text', required: true, unique: true, index: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'metadata', type: 'json' },
  ],
}
