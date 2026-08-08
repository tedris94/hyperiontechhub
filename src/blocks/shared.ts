import type { Field } from 'payload'

export const ICON_OPTIONS = [
  { label: 'Code', value: 'Code2' },
  { label: 'Globe', value: 'Globe' },
  { label: 'Cloud', value: 'Cloud' },
  { label: 'Smartphone', value: 'Smartphone' },
  { label: 'Graduation cap', value: 'GraduationCap' },
  { label: 'Book open', value: 'BookOpen' },
  { label: 'Wrench', value: 'Wrench' },
  { label: 'Palette', value: 'Palette' },
  { label: 'Users', value: 'Users' },
  { label: 'Shield', value: 'Shield' },
  { label: 'Zap', value: 'Zap' },
  { label: 'Star', value: 'Star' },
  { label: 'Mail', value: 'Mail' },
  { label: 'Phone', value: 'Phone' },
  { label: 'Map pin', value: 'MapPin' },
] as const

export const iconSelect = (name = 'icon', label = 'Icon'): Field => ({
  name,
  label,
  type: 'select',
  options: [...ICON_OPTIONS],
})

export const ctaGroup = (name: string, label: string): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    { name: 'label', type: 'text' },
    { name: 'href', type: 'text' },
  ],
})

export const navLinkArray: Field = {
  name: 'links',
  type: 'array',
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'href', type: 'text', required: true },
  ],
}
