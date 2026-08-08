import type { CollectionConfig } from 'payload'
import { getAuthUser, isStaffRole } from './lms/access'

export const Certificates: CollectionConfig = {
  slug: 'certificates',
  admin: {
    useAsTitle: 'serial',
    defaultColumns: ['serial', 'student', 'course', 'issuedAt'],
  },
  access: {
    read: ({ req }) => {
      const user = getAuthUser(req)
      if (!user) return false
      if (isStaffRole(user.role)) return true
      return { student: { equals: user.id } }
    },
    create: ({ req }) => {
      const user = getAuthUser(req)
      return Boolean(user && isStaffRole(user.role))
    },
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
      name: 'enrollment',
      type: 'relationship',
      relationTo: 'enrollments',
      required: true,
      unique: true,
    },
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
    { name: 'serial', type: 'text', required: true, unique: true, index: true },
    {
      name: 'issuedAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
}
