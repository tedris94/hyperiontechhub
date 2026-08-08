import type { CollectionConfig } from 'payload'
import { edusuiteAdminAccess, SCHOOL_ROLES } from './shared'

export const Schools: CollectionConfig = {
  slug: 'schools',
  labels: { singular: 'School', plural: 'Schools' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'schoolType', 'status', 'updatedAt'],
    group: 'EduSuite',
  },
  access: {
    read: edusuiteAdminAccess,
    create: edusuiteAdminAccess,
    update: edusuiteAdminAccess,
    delete: ({ req }) => (req.user as { role?: string } | null)?.role === 'super_admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL slug e.g. demo-academy' },
    },
    {
      name: 'schoolType',
      type: 'select',
      required: true,
      defaultValue: 'private',
      options: [
        { label: 'Private', value: 'private' },
        { label: 'Islamic', value: 'islamic' },
        { label: 'Public', value: 'public' },
      ],
    },
    { name: 'city', type: 'text' },
    { name: 'state', type: 'text', defaultValue: 'FCT' },
    { name: 'address', type: 'textarea' },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Trial', value: 'trial' },
        { label: 'Suspended', value: 'suspended' },
      ],
    },
    { name: 'currentTerm', type: 'text', defaultValue: 'First Term' },
    { name: 'currentSession', type: 'text', defaultValue: '2025/2026' },
    { name: 'primaryColor', type: 'text', defaultValue: '#1A2BC2' },
    { name: 'paystackSubaccount', type: 'text' },
    {
      name: 'gradingScale',
      type: 'array',
      fields: [
        { name: 'grade', type: 'text', required: true },
        { name: 'minScore', type: 'number', required: true },
        { name: 'maxScore', type: 'number', required: true },
        { name: 'points', type: 'number' },
      ],
    },
    {
      name: 'examTerms',
      type: 'array',
      admin: { description: 'Exam / term labels (Educare Exam list)' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      name: 'academicYears',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      name: 'extraFields',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'fieldType',
          type: 'select',
          defaultValue: 'text',
          options: ['text', 'number', 'date', 'email', 'textarea'],
        },
        { name: 'forRole', type: 'select', options: ['students', 'teachers', 'both'], defaultValue: 'students' },
      ],
    },
    {
      name: 'ratingScales',
      type: 'array',
      admin: { description: 'Affective / psychomotor rating items' },
      fields: [
        { name: 'category', type: 'text', required: true },
        { name: 'item', type: 'text', required: true },
      ],
    },
    { name: 'principalName', type: 'text' },
    { name: 'principalSignatureUrl', type: 'text' },
    { name: 'principalAutoRemark', type: 'textarea' },
    { name: 'passMark', type: 'number', defaultValue: 40 },
    { name: 'settingsNotes', type: 'textarea' },
  ],
}

export const SchoolMemberships: CollectionConfig = {
  slug: 'school-memberships',
  labels: { singular: 'School membership', plural: 'School memberships' },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'school', 'schoolRole', 'status'],
    group: 'EduSuite',
  },
  access: {
    read: edusuiteAdminAccess,
    create: edusuiteAdminAccess,
    update: edusuiteAdminAccess,
    delete: edusuiteAdminAccess,
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'school', type: 'relationship', relationTo: 'schools', required: true, index: true },
    {
      name: 'schoolRole',
      type: 'select',
      required: true,
      options: SCHOOL_ROLES.map((r) => ({
        label: `EduSuite · ${r.replace(/_/g, ' ')}`,
        value: r,
      })),
      filterOptions: ({ options, req }) => {
        const actor = (req.user as { role?: string } | null)?.role
        if (actor === 'super_admin' || actor === 'admin') return options
        return []
      },
      admin: {
        description: 'School-scoped EduSuite role (not a Hyperion dashboard role).',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Invited', value: 'invited' },
        { label: 'Disabled', value: 'disabled' },
      ],
    },
  ],
}
