import type { CollectionConfig } from 'payload'
import { makeTenantScopedCollection } from './shared'

export const IcmsArticles: CollectionConfig = makeTenantScopedCollection(
  'icms-articles',
  'ICMS Article',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, index: true },
    { name: 'category', type: 'text' },
    { name: 'author', type: 'text' },
    { name: 'excerpt', type: 'textarea' },
    {
      name: 'coverImageUrl',
      type: 'text',
      admin: { description: 'Optional cover image URL for the public article card/detail.' },
    },
    {
      name: 'body',
      type: 'array',
      fields: [{ name: 'paragraph', type: 'textarea', required: true }],
    },
    { name: 'publishedAt', type: 'date' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
  { useAsTitle: 'title', defaultColumns: ['title', 'status', 'tenant', 'updatedAt'] },
)

export const IcmsEvents: CollectionConfig = makeTenantScopedCollection(
  'icms-events',
  'ICMS Event',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'eventDate', type: 'date', required: true },
    { name: 'time', type: 'text' },
    { name: 'venue', type: 'text' },
    { name: 'category', type: 'text', admin: { description: 'e.g. Lecture, Youth, Community' } },
    { name: 'blurb', type: 'textarea' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
  { useAsTitle: 'title', defaultColumns: ['title', 'eventDate', 'tenant', 'updatedAt'] },
)

export const IcmsLeaders: CollectionConfig = makeTenantScopedCollection(
  'icms-leaders',
  'ICMS Leader',
  [
    { name: 'name', type: 'text', required: true },
    { name: 'roleTitle', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Imam', value: 'imam' },
        { label: 'Director', value: 'director' },
        { label: 'Committee', value: 'committee' },
      ],
    },
    { name: 'bio', type: 'textarea' },
    {
      name: 'photoUrl',
      type: 'text',
      admin: { description: 'Optional portrait image URL' },
    },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
  { useAsTitle: 'name', defaultColumns: ['name', 'category', 'tenant', 'updatedAt'] },
)

/** HR / Shurah committee roster — term, contact, and subcommittee management. */
export const IcmsCommitteeMembers: CollectionConfig = makeTenantScopedCollection(
  'icms-committee-members',
  'ICMS Committee Member',
  [
    { name: 'name', type: 'text', required: true },
    {
      name: 'roleTitle',
      type: 'text',
      required: true,
      admin: { description: 'e.g. Chairperson, Secretary, Member' },
    },
    {
      name: 'committeeType',
      type: 'select',
      required: true,
      defaultValue: 'shurah',
      options: [
        { label: 'Shurah', value: 'shurah' },
        { label: 'HR', value: 'hr' },
        { label: 'Waqf & Projects', value: 'waqf' },
        { label: 'Education', value: 'education' },
        { label: 'Outreach', value: 'outreach' },
        { label: 'Finance', value: 'finance' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Past term', value: 'past' },
      ],
    },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    {
      name: 'termStart',
      type: 'date',
      admin: { description: 'Appointment / term start' },
    },
    {
      name: 'termEnd',
      type: 'date',
      admin: { description: 'Term end (leave blank if ongoing)' },
    },
    { name: 'bio', type: 'textarea' },
    {
      name: 'photoUrl',
      type: 'text',
      admin: { description: 'Optional portrait image URL' },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal HR notes (not shown publicly)' },
    },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    {
      name: 'showOnPublic',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'List on the public Shurah & Committees page' },
    },
  ],
  {
    useAsTitle: 'name',
    defaultColumns: ['name', 'roleTitle', 'committeeType', 'status', 'tenant', 'updatedAt'],
  },
)

export const IcmsPrayerTimes: CollectionConfig = makeTenantScopedCollection(
  'icms-prayer-times',
  'ICMS Prayer Time',
  [
    {
      name: 'day',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description:
          'Legacy/manual rows only. Public times are calculated from tenant Prayer location settings.',
      },
    },
    {
      name: 'prayer',
      type: 'text',
      required: true,
      admin: { description: 'Fajr, Sunrise, Dhuhr, Asr, Maghrib, or Isha' },
    },
    { name: 'time', type: 'text', required: true },
  ],
  { useAsTitle: 'prayer', defaultColumns: ['day', 'prayer', 'time', 'tenant'] },
)

export const IcmsDonations: CollectionConfig = makeTenantScopedCollection(
  'icms-donations',
  'ICMS Donation',
  [
    { name: 'reference', type: 'text' },
    { name: 'donor', type: 'text', required: true },
    { name: 'amount', type: 'number', required: true },
    { name: 'fund', type: 'text', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'Completed',
      options: ['Completed', 'Pending', 'Failed'].map((s) => ({ label: s, value: s })),
    },
    { name: 'donatedAt', type: 'date', required: true },
  ],
  { useAsTitle: 'donor', defaultColumns: ['donor', 'amount', 'fund', 'tenant'] },
)

export const IcmsWaqfProjects: CollectionConfig = makeTenantScopedCollection(
  'icms-waqf-projects',
  'ICMS Waqf Project',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'summary', type: 'textarea' },
    { name: 'description', type: 'textarea', admin: { description: 'Longer public description' } },
    { name: 'status', type: 'text', defaultValue: 'Active' },
    { name: 'progress', type: 'number', defaultValue: 0, min: 0, max: 100 },
    {
      name: 'goalAmount',
      type: 'number',
      admin: { description: 'Fundraising goal in Naira' },
    },
    {
      name: 'raisedAmount',
      type: 'number',
      admin: { description: 'Amount raised so far in Naira' },
    },
    {
      name: 'updates',
      type: 'array',
      fields: [
        { name: 'date', type: 'date' },
        { name: 'note', type: 'textarea', required: true },
      ],
    },
  ],
  { useAsTitle: 'title', defaultColumns: ['title', 'progress', 'tenant', 'updatedAt'] },
)

export const IcmsIslamiyyahClasses: CollectionConfig = makeTenantScopedCollection(
  'icms-islamiyyah-classes',
  'ICMS Islamiyyah Class',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'schedule', type: 'text', admin: { description: 'e.g. Sat & Sun · 9:00–11:30 AM' } },
    { name: 'ageGroup', type: 'text', admin: { description: 'e.g. Ages 6–10' } },
    { name: 'teacher', type: 'text' },
    { name: 'capacity', type: 'number', defaultValue: 30, min: 0 },
    { name: 'enrolled', type: 'number', defaultValue: 0, min: 0 },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'Open',
      options: [
        { label: 'Open', value: 'Open' },
        { label: 'Full', value: 'Full' },
        { label: 'Closed', value: 'Closed' },
      ],
    },
    { name: 'summary', type: 'textarea' },
  ],
  { useAsTitle: 'title', defaultColumns: ['title', 'ageGroup', 'status', 'tenant'] },
)

export const IcmsIslamiyyahStudents: CollectionConfig = makeTenantScopedCollection(
  'icms-islamiyyah-students',
  'ICMS Islamiyyah Student',
  [
    { name: 'name', type: 'text', required: true },
    { name: 'guardian', type: 'text' },
    { name: 'phone', type: 'text' },
    {
      name: 'classRef',
      type: 'relationship',
      relationTo: 'icms-islamiyyah-classes',
      admin: { description: 'Assigned class' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'Active',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Graduated', value: 'Graduated' },
        { label: 'Withdrawn', value: 'Withdrawn' },
      ],
    },
  ],
  { useAsTitle: 'name', defaultColumns: ['name', 'guardian', 'status', 'tenant'] },
)
