import type { CollectionConfig, Field } from 'payload'
import { makeTenantScopedCollection } from './shared'

const pageKeys = [
  { label: 'Home', value: 'home' },
  { label: 'About', value: 'about' },
  { label: 'Mosque', value: 'mosque' },
  { label: 'Leadership', value: 'leadership' },
  { label: 'Shurah & Committees', value: 'committee' },
  { label: 'Events', value: 'events' },
  { label: 'Articles', value: 'articles' },
  { label: 'Waqf', value: 'waqf' },
  { label: 'Donate', value: 'donate' },
  { label: 'Contact', value: 'contact' },
  { label: 'Islamiyyah', value: 'islamiyyah' },
] as const

function whenPage(...keys: string[]) {
  return (_: unknown, siblingData: { pageKey?: string }) =>
    Boolean(siblingData?.pageKey && keys.includes(siblingData.pageKey))
}

const titleBodyArray: Field = {
  name: 'blocks',
  type: 'array',
  labels: { singular: 'Block', plural: 'Blocks' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
  ],
}

const textItems: Field = {
  name: 'listItems',
  type: 'array',
  labels: { singular: 'Item', plural: 'Items' },
  fields: [{ name: 'text', type: 'text', required: true }],
}

/** Editable public page copy (one document per page key per tenant). */
export const IcmsPages: CollectionConfig = makeTenantScopedCollection(
  'icms-pages',
  'ICMS Page',
  [
    {
      name: 'pageKey',
      type: 'select',
      required: true,
      index: true,
      options: [...pageKeys],
      admin: { description: 'Which public route this copy powers.' },
    },
    { name: 'heroTitle', type: 'text' },
    { name: 'heroSubtitle', type: 'textarea' },
    {
      name: 'introHeading',
      type: 'text',
      admin: { condition: whenPage('home', 'about', 'mosque', 'waqf', 'donate', 'contact') },
    },
    {
      name: 'introBody',
      type: 'textarea',
      admin: { condition: whenPage('home', 'about', 'mosque', 'waqf', 'donate', 'contact') },
    },
    {
      ...titleBodyArray,
      name: 'blocks',
      admin: {
        description: 'Story / explainer blocks (About, Waqf steps, etc.)',
        condition: whenPage('about', 'waqf', 'home'),
      },
    },
    {
      name: 'missionHeading',
      type: 'text',
      admin: { condition: whenPage('about') },
    },
    {
      ...textItems,
      name: 'missionItems',
      label: 'Mission points',
      admin: { condition: whenPage('about') },
    },
    {
      ...textItems,
      name: 'visionItems',
      label: 'Vision points',
      admin: { condition: whenPage('about') },
    },
    {
      name: 'imageUrl',
      type: 'text',
      admin: {
        description: 'Optional image URL for the page (About photo, etc.)',
        condition: whenPage('about', 'home', 'mosque'),
      },
    },
    {
      name: 'arabicText',
      type: 'text',
      admin: { condition: whenPage('about', 'waqf', 'home', 'donate') },
    },
    {
      name: 'arabicCaption',
      type: 'textarea',
      admin: { condition: whenPage('about', 'waqf', 'home', 'donate') },
    },
    {
      name: 'officeHours',
      type: 'array',
      admin: { condition: whenPage('about', 'contact') },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'jumuahNote',
      type: 'textarea',
      admin: {
        description: 'Jum’uah / special prayer notes',
        condition: whenPage('mosque'),
      },
    },
    {
      name: 'supportBlurb',
      type: 'textarea',
      admin: {
        description: 'Home “Support the Centre” / donate strip copy',
        condition: whenPage('home', 'donate'),
      },
    },
    {
      name: 'waqfGoalAmount',
      type: 'number',
      admin: {
        description: 'Campaign goal in Naira (home/waqf progress)',
        condition: whenPage('home', 'waqf'),
      },
    },
    {
      name: 'storyEyebrow',
      type: 'text',
      admin: { condition: whenPage('about'), description: '“Our Story” section label' },
    },
    {
      name: 'purposeEyebrow',
      type: 'text',
      admin: { condition: whenPage('about'), description: 'Mission & Vision section label' },
    },
    {
      name: 'mapCtaLabel',
      type: 'text',
      admin: {
        condition: whenPage('about', 'contact'),
        description: 'Google Maps button label',
      },
    },
    {
      name: 'ctaPrimaryLabel',
      type: 'text',
      admin: {
        condition: whenPage('home', 'about'),
        description: 'Primary button (hero or footer CTA)',
      },
    },
    {
      name: 'ctaSecondaryLabel',
      type: 'text',
      admin: {
        condition: whenPage('home', 'about'),
        description: 'Secondary button (hero or footer CTA)',
      },
    },
    {
      name: 'prayerHeading',
      type: 'text',
      admin: { condition: whenPage('home'), description: 'Prayer strip title' },
    },
    {
      name: 'eventsEyebrow',
      type: 'text',
      admin: { condition: whenPage('home', 'events') },
    },
    {
      name: 'eventsHeading',
      type: 'text',
      admin: { condition: whenPage('home', 'events') },
    },
    {
      name: 'eventsCtaLabel',
      type: 'text',
      admin: { condition: whenPage('home', 'events') },
    },
    {
      name: 'waqfEyebrow',
      type: 'text',
      admin: { condition: whenPage('home', 'waqf') },
    },
    {
      name: 'waqfHeading',
      type: 'text',
      admin: { condition: whenPage('home', 'waqf') },
    },
    {
      name: 'waqfBody',
      type: 'textarea',
      admin: { condition: whenPage('home', 'waqf') },
    },
    {
      name: 'waqfCtaLabel',
      type: 'text',
      admin: { condition: whenPage('home', 'waqf') },
    },
    {
      name: 'articlesEyebrow',
      type: 'text',
      admin: { condition: whenPage('home', 'articles') },
    },
    {
      name: 'articlesHeading',
      type: 'text',
      admin: { condition: whenPage('home', 'articles') },
    },
    {
      name: 'articlesCtaLabel',
      type: 'text',
      admin: { condition: whenPage('home', 'articles') },
    },
    {
      name: 'findUsEyebrow',
      type: 'text',
      admin: { condition: whenPage('home', 'about', 'contact') },
    },
    {
      name: 'findUsHeading',
      type: 'text',
      admin: { condition: whenPage('home', 'about', 'contact') },
    },
    {
      name: 'contactEyebrow',
      type: 'text',
      admin: { condition: whenPage('home') },
    },
    {
      name: 'contactHeading',
      type: 'text',
      admin: { condition: whenPage('home') },
    },
    {
      name: 'supportEyebrow',
      type: 'text',
      admin: { condition: whenPage('home') },
    },
    {
      name: 'supportHeading',
      type: 'text',
      admin: { condition: whenPage('home') },
    },
    {
      name: 'supportCtaLabel',
      type: 'text',
      admin: { condition: whenPage('home') },
    },
    {
      name: 'formSubjects',
      type: 'array',
      admin: { condition: whenPage('contact') },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
  ],
  { useAsTitle: 'pageKey', defaultColumns: ['pageKey', 'heroTitle', 'tenant', 'updatedAt'] },
)

export const IcmsFacilities: CollectionConfig = makeTenantScopedCollection(
  'icms-facilities',
  'ICMS Facility',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
  { useAsTitle: 'title', defaultColumns: ['title', 'sortOrder', 'tenant'] },
)

export const IcmsDonateFunds: CollectionConfig = makeTenantScopedCollection(
  'icms-donate-funds',
  'ICMS Donate Fund',
  [
    { name: 'key', type: 'text', required: true, admin: { description: 'Stable key e.g. Sadaqah' } },
    { name: 'label', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'impactLines',
      type: 'array',
      fields: [
        { name: 'amountLabel', type: 'text', required: true },
        { name: 'effect', type: 'text', required: true },
      ],
    },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
  { useAsTitle: 'label', defaultColumns: ['label', 'key', 'active', 'tenant'] },
)

export const IcmsContactMessages: CollectionConfig = makeTenantScopedCollection(
  'icms-contact-messages',
  'ICMS Contact Message',
  [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Replied', value: 'replied' },
        { label: 'Archived', value: 'archived' },
      ],
    },
  ],
  { useAsTitle: 'name', defaultColumns: ['name', 'subject', 'status', 'tenant', 'createdAt'] },
)
