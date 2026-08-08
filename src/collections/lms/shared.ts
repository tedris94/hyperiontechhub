import {
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export const lmsRichTextEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    FixedToolbarFeature(),
    LinkFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
  ],
})

export const courseLevelOptions = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
  { label: 'All Levels', value: 'all' },
] as const

export const lessonTypeOptions = [
  { label: 'Video', value: 'video' },
  { label: 'Article', value: 'article' },
  { label: 'Quiz', value: 'quiz' },
  { label: 'Resource', value: 'resource' },
] as const

export const quizQuestionTypeOptions = [
  { label: 'Single choice', value: 'single' },
  { label: 'Multiple choice', value: 'multiple' },
  { label: 'True / False', value: 'boolean' },
] as const
