import type { CollectionConfig } from 'payload'
import { approvedReviewRead, getAuthUser, isStaffRole, staffWrite } from './lms/access'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['course', 'student', 'rating', 'status'],
  },
  access: {
    read: approvedReviewRead,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => {
      const user = getAuthUser(req)
      if (!user) return false
      if (isStaffRole(user.role)) return true
      return { student: { equals: user.id } }
    },
    delete: staffWrite,
  },
  fields: [
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      index: true,
    },
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },
    { name: 'comment', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
