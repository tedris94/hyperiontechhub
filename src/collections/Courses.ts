import type { CollectionConfig } from 'payload'
import { getAuthUser, publishedCourseRead, staffWrite } from './lms/access'
import { courseLevelOptions, lmsRichTextEditor, slugify } from './lms/shared'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'instructor', 'price', 'enrollmentCount'],
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && (!data.slug || !String(data.slug).trim()) && typeof data.title === 'string') {
          data.slug = slugify(data.title) || `course-${Date.now()}`
        }
        if (data && data.isFree) {
          data.price = 0
        }
        return data
      },
    ],
  },
  access: {
    read: publishedCourseRead,
    create: staffWrite,
    update: ({ req }) => {
      const user = getAuthUser(req)
      if (!user) return false
      if (user.role === 'super_admin' || user.role === 'admin') return true
      if (user.role === 'instructor') return { instructor: { equals: user.id } }
      return false
    },
    delete: ({ req }) => {
      const user = getAuthUser(req)
      if (!user) return false
      return user.role === 'super_admin' || user.role === 'admin'
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'subtitle', type: 'text' },
    { name: 'description', type: 'richText', editor: lmsRichTextEditor },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'course-categories',
    },
    {
      name: 'instructor',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'level',
      type: 'select',
      defaultValue: 'all',
      options: [...courseLevelOptions],
      admin: { position: 'sidebar' },
    },
    { name: 'language', type: 'text', defaultValue: 'English', admin: { position: 'sidebar' } },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    { name: 'promoVideo', type: 'upload', relationTo: 'media' },
    {
      name: 'price',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: { position: 'sidebar', description: 'Price in smallest currency unit (kobo for NGN)' },
    },
    { name: 'currency', type: 'text', defaultValue: 'NGN', admin: { position: 'sidebar' } },
    { name: 'isFree', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'whatYouWillLearn',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'requirements',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'targetAudience',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text', required: true }] },
    {
      name: 'ratingAvg',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'ratingCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'enrollmentCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
}
