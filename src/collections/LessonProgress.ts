import type { CollectionConfig } from 'payload'
import { getAuthUser, isStaffRole } from './lms/access'

export const LessonProgress: CollectionConfig = {
  slug: 'lesson-progress',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['student', 'lesson', 'completed', 'lastPositionSeconds'],
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
    delete: ({ req }) => {
      const user = getAuthUser(req)
      return Boolean(user && isStaffRole(user.role))
    },
  },
  fields: [
    {
      name: 'enrollment',
      type: 'relationship',
      relationTo: 'enrollments',
      required: true,
      index: true,
    },
    {
      name: 'lesson',
      type: 'relationship',
      relationTo: 'lessons',
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
    { name: 'completed', type: 'checkbox', defaultValue: false },
    { name: 'lastPositionSeconds', type: 'number', defaultValue: 0, min: 0 },
    {
      name: 'completedAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
}
