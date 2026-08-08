import type { CollectionConfig } from 'payload'
import { adminWrite, getAuthUser, isStaffRole } from './lms/access'

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['student', 'course', 'status', 'progressPercent', 'enrolledAt'],
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
      if (!user) return false
      if (isStaffRole(user.role)) return true
      return { student: { equals: user.id } }
    },
    delete: adminWrite,
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
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'enrolledAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'progressPercent',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 100,
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'free',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Paid', value: 'paid' },
        { label: 'Manual', value: 'manual' },
      ],
    },
  ],
}
