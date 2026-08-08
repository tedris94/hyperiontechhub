import { LearningPlayer } from '@/components/lms/LearningPlayer'

type Props = { params: Promise<{ courseSlug: string; lessonSlug: string }> }

export default async function LearnPage({ params }: Props) {
  const { courseSlug, lessonSlug } = await params
  return <LearningPlayer courseSlug={courseSlug} lessonSlug={lessonSlug} />
}
