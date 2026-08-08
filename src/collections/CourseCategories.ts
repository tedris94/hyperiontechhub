import type { CollectionConfig } from 'payload'
import { iconSelect } from '../blocks/shared'
import { adminWrite, publicRead } from './lms/access'
import { slugify } from './lms/shared'

export const CourseCategories: CollectionConfig = {
  slug: 'course-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && (!data.slug || !String(data.slug).trim()) && typeof data.name === 'string') {
          data.slug = slugify(data.name) || `category-${Date.now()}`
        }
        return data
      },
    ],
  },
  access: {
    read: publicRead,
    create: adminWrite,
    update: adminWrite,
    delete: adminWrite,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'textarea' },
    iconSelect('icon', 'Lucide icon key'),
  ],
}
