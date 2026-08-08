import type { CollectionConfig } from 'payload'
import { getAuthUser, isStaffRole, publishedCourseRead, staffWrite } from './lms/access'

export const CourseSections: CollectionConfig = {
  slug: 'course-sections',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'course', 'order'],
  },
  access: {
    read: ({ req }) => {
      const user = getAuthUser(req)
      if (user && isStaffRole(user.role)) return true
      return { 'course.status': { equals: 'published' } }
    },
    create: staffWrite,
    update: staffWrite,
    delete: staffWrite,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      index: true,
    },
    { name: 'order', type: 'number', defaultValue: 0, required: true },
  ],
}
