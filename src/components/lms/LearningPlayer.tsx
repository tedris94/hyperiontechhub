'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  ListVideo,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LexicalContent } from '@/components/lms/LexicalContent'
import { QuizPlayer } from '@/components/lms/QuizPlayer'
import { VideoPlayer } from '@/components/lms/VideoPlayer'
import { formatDuration } from '@/components/lms/CourseCard'

type LearningPlayerProps = {
  courseSlug: string
  lessonSlug: string
}

type CurriculumLesson = {
  slug: string
  title: string
  type: string
  durationSeconds: number
  completed?: boolean
}

type CurriculumSection = {
  id: number
  title: string
  lessons: CurriculumLesson[]
}

type LessonOrderItem = {
  slug: string
  title: string
  id: number
  completed?: boolean
}

export function LearningPlayer({ courseSlug, lessonSlug }: LearningPlayerProps) {
  const router = useRouter()
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({})
  const [tab, setTab] = useState<'overview' | 'reviews'>('overview')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/lms/learn/${courseSlug}/${lessonSlug}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load lesson')
      setData(json)

      const curriculum = (json.curriculum as CurriculumSection[]) ?? []
      const open: Record<number, boolean> = {}
      curriculum.forEach((section) => {
        open[section.id] = section.lessons.some((l) => l.slug === lessonSlug)
      })
      // Always expand at least the active section; if none match, expand all.
      if (!Object.values(open).some(Boolean)) {
        curriculum.forEach((section) => {
          open[section.id] = true
        })
      }
      setExpandedSections(open)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [courseSlug, lessonSlug])

  useEffect(() => {
    load()
  }, [load])

  const lessonOrder = useMemo(() => {
    return (data?.lessonOrder as LessonOrderItem[] | undefined) ?? []
  }, [data])

  const currentIndex = useMemo(
    () => lessonOrder.findIndex((l) => l.slug === lessonSlug),
    [lessonOrder, lessonSlug],
  )
  const prevLesson = currentIndex > 0 ? lessonOrder[currentIndex - 1] : null
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessonOrder.length - 1
      ? lessonOrder[currentIndex + 1]
      : null

  const nextIncomplete = useMemo(() => {
    if (currentIndex < 0) return lessonOrder.find((l) => !l.completed) ?? null
    return (
      lessonOrder.slice(currentIndex + 1).find((l) => !l.completed) ??
      lessonOrder.find((l) => !l.completed && l.slug !== lessonSlug) ??
      null
    )
  }, [lessonOrder, currentIndex, lessonSlug])

  const goToLesson = useCallback(
    (slug: string) => {
      setSidebarOpen(false)
      router.push(`/learn/${courseSlug}/${slug}`)
    },
    [router, courseSlug],
  )

  const saveProgress = useCallback(
    async (opts: { completed?: boolean; lastPositionSeconds?: number; autoAdvance?: boolean }) => {
      const lesson = data?.lesson as { id?: number } | undefined
      const course = data?.course as { id?: number } | undefined
      if (!lesson?.id || !course?.id) return null
      const res = await fetch('/api/lms/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          courseId: course.id,
          completed: opts.completed,
          lastPositionSeconds: opts.lastPositionSeconds,
        }),
      })
      if (opts.completed) {
        await load()
        if (opts.autoAdvance !== false && nextIncomplete && nextIncomplete.slug !== lessonSlug) {
          goToLesson(nextIncomplete.slug)
        }
      }
      return res
    },
    [data, load, nextIncomplete, lessonSlug, goToLesson],
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1115]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A2BC2]" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-gray-50">
        <p className="text-gray-600">{error || 'Lesson unavailable'}</p>
        <Button asChild variant="outline">
          <Link href="/student/my-courses">Back to My learning</Link>
        </Button>
      </div>
    )
  }

  const course = data.course as {
    title?: string
    slug?: string
    id?: number
    subtitle?: string
    ratingAvg?: number
    ratingCount?: number
    enrollmentCount?: number
  }
  const lesson = data.lesson as {
    id?: number
    title?: string
    type?: string
    content?: unknown
    attachments?: Array<{ label?: string; url?: string | null }>
    durationSeconds?: number
    completed?: boolean
  }
  const curriculum = (data.curriculum as CurriculumSection[]) ?? []
  const progress = data.progress as { lastPositionSeconds?: number; completed?: boolean } | null
  const quiz = data.quiz as {
    id: number
    title: string
    passingScore: number
    questions: Array<Record<string, unknown>>
  } | null
  const enrollment = data.enrollment as { progressPercent?: number } | null
  const isVideo = lesson.type === 'video'

  return (
    <div className="min-h-screen bg-[#f7f9fa] flex flex-col">
      {/* Top bar */}
      <header className="bg-[#1B1C1E] text-white sticky top-0 z-50">
        <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link href="/" className="shrink-0 hidden sm:block">
              <Image
                src="/assets/img/hth-logo.svg"
                alt="Hyperion Tech Hub"
                width={120}
                height={32}
                className="h-7 w-auto brightness-0 invert opacity-90"
              />
            </Link>
            <span className="hidden sm:inline text-white/30">|</span>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{course.title}</p>
              <p className="text-xs text-white/60 truncate sm:hidden">{lesson.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {enrollment && (
              <Badge className="bg-white/10 text-white border-0 hover:bg-white/15">
                {enrollment.progressPercent ?? 0}% complete
              </Badge>
            )}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(true)}
            >
              <ListVideo className="w-4 h-4 mr-1" />
              Content
            </Button>
            <Button asChild size="sm" variant="ghost" className="text-white hover:bg-white/10 hidden sm:inline-flex">
              <Link href="/student/my-courses">My learning</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Main column */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className={`relative ${isVideo ? 'bg-black' : 'bg-white'}`}>
            {/* Prev / Next */}
            {prevLesson && (
              <button
                type="button"
                onClick={() => goToLesson(prevLesson.slug)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#1A2BC2]/90 text-white flex items-center justify-center hover:bg-[#1A2BC2] shadow-lg"
                aria-label="Previous lesson"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {nextLesson && (
              <button
                type="button"
                onClick={() => goToLesson(nextLesson.slug)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#1A2BC2]/90 text-white flex items-center justify-center hover:bg-[#1A2BC2] shadow-lg"
                aria-label="Next lesson"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            <div className={isVideo ? 'max-w-5xl mx-auto' : 'max-w-4xl mx-auto p-4 sm:p-6'}>
              {isVideo && lesson.id && (
                <VideoPlayer
                  lessonId={lesson.id}
                  initialPosition={progress?.lastPositionSeconds ?? 0}
                  onProgress={(pos) => {
                    if (pos > 0 && pos % 15 === 0) {
                      saveProgress({ lastPositionSeconds: pos, autoAdvance: false })
                    }
                  }}
                  onComplete={() => saveProgress({ completed: true })}
                />
              )}

              {(lesson.type === 'article' || lesson.type === 'resource') && lesson.content != null && (
                <div className="bg-white rounded-lg p-1 sm:p-2">
                  <h1 className="text-2xl font-semibold text-[#1B1C1E] mb-4">{lesson.title}</h1>
                  <LexicalContent content={lesson.content} />
                </div>
              )}

              {lesson.type === 'quiz' && quiz && course.id && (
                <div className="py-4">
                  <h1 className="text-2xl font-semibold text-[#1B1C1E] mb-4 px-1">{lesson.title}</h1>
                  <QuizPlayer
                    quiz={quiz as never}
                    courseId={course.id}
                    onComplete={(passed) => {
                      if (passed) saveProgress({ completed: true })
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4 max-w-5xl w-full mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h1 className="text-lg sm:text-xl font-semibold text-[#1B1C1E]">{lesson.title}</h1>
              {lesson.type !== 'quiz' && (
                <Button
                  className="bg-[#1A2BC2] hover:bg-[#0D0D52] shrink-0"
                  onClick={() => saveProgress({ completed: true })}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark as complete
                </Button>
              )}
            </div>

            {lesson.attachments && lesson.attachments.length > 0 && (
              <div className="bg-white rounded-lg border p-4 space-y-2">
                <h3 className="font-semibold text-sm">Resources</h3>
                {lesson.attachments.map((a, i) =>
                  a.url ? (
                    <a
                      key={i}
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-[#1A2BC2] hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      {a.label || 'Download'}
                    </a>
                  ) : null,
                )}
              </div>
            )}

            {/* Bottom tabs */}
            <div className="border-b border-gray-200 flex gap-6">
              <button
                type="button"
                onClick={() => setTab('overview')}
                className={`pb-3 text-sm font-medium border-b-2 -mb-px ${
                  tab === 'overview'
                    ? 'border-[#1A2BC2] text-[#1A2BC2]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setTab('reviews')}
                className={`pb-3 text-sm font-medium border-b-2 -mb-px ${
                  tab === 'reviews'
                    ? 'border-[#1A2BC2] text-[#1A2BC2]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Reviews
              </button>
            </div>

            {tab === 'overview' && (
              <div className="space-y-3 pb-8">
                {course.subtitle && (
                  <p className="text-gray-700 leading-relaxed">{course.subtitle}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>
                    ★ {Number(course.ratingAvg ?? 0).toFixed(1)} ({Number(course.ratingCount ?? 0)}{' '}
                    ratings)
                  </span>
                  <span>{Number(course.enrollmentCount ?? 0)} students</span>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/courses/${courseSlug}`}>View course page</Link>
                </Button>
              </div>
            )}

            {tab === 'reviews' && (
              <div className="pb-8 text-sm text-gray-600">
                Leave a rating from the{' '}
                <Link href={`/courses/${courseSlug}`} className="text-[#1A2BC2] underline">
                  course page
                </Link>{' '}
                after you&apos;ve made progress.
              </div>
            )}
          </div>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-[360px] shrink-0 border-l border-gray-200 bg-white flex-col max-h-[calc(100vh-56px)] sticky top-[56px]">
          <CurriculumSidebar
            curriculum={curriculum}
            lessonSlug={lessonSlug}
            expandedSections={expandedSections}
            setExpandedSections={setExpandedSections}
            onSelect={goToLesson}
          />
        </aside>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close course content"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="font-semibold">Course content</h2>
              <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <CurriculumSidebar
              curriculum={curriculum}
              lessonSlug={lessonSlug}
              expandedSections={expandedSections}
              setExpandedSections={setExpandedSections}
              onSelect={goToLesson}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function CurriculumSidebar({
  curriculum,
  lessonSlug,
  expandedSections,
  setExpandedSections,
  onSelect,
}: {
  curriculum: CurriculumSection[]
  lessonSlug: string
  expandedSections: Record<number, boolean>
  setExpandedSections: Dispatch<SetStateAction<Record<number, boolean>>>
  onSelect: (slug: string) => void
}) {
  return (
    <>
      <div className="px-4 py-3 border-b font-semibold text-[#1B1C1E] hidden lg:block">
        Course content
      </div>
      <div className="flex-1 overflow-y-auto">
        {curriculum.map((section) => {
          const open = expandedSections[section.id] !== false
          const done = section.lessons.filter((l) => l.completed).length
          return (
            <div key={section.id} className="border-b border-gray-100">
              <button
                type="button"
                className="w-full flex items-start justify-between gap-2 px-4 py-3 text-left hover:bg-gray-50"
                onClick={() =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    [section.id]: !open,
                  }))
                }
              >
                <div>
                  <p className="text-sm font-semibold text-[#1B1C1E]">{section.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {done} / {section.lessons.length} ·{' '}
                    {formatDuration(
                      section.lessons.reduce((s, l) => s + (l.durationSeconds || 0), 0),
                    )}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform ${open ? 'rotate-180' : ''}`}
                />
              </button>
              {open && (
                <ul className="pb-2">
                  {section.lessons.map((l) => {
                    const active = l.slug === lessonSlug
                    return (
                      <li key={l.slug}>
                        <button
                          type="button"
                          onClick={() => onSelect(l.slug)}
                          className={`w-full text-left px-4 py-2.5 flex items-start gap-3 text-sm ${
                            active
                              ? 'bg-[#1A2BC2]/10 text-[#1A2BC2]'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span
                            className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 text-[10px] font-bold ${
                              l.completed
                                ? 'bg-[#1A2BC2] border-[#1A2BC2] text-white'
                                : 'border-gray-300 bg-white'
                            }`}
                            aria-hidden
                          >
                            {l.completed ? '✓' : null}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className={`block leading-snug ${active ? 'font-medium' : ''}`}>
                              {l.title}
                            </span>
                            <span className="text-xs text-gray-400 mt-0.5 block capitalize">
                              {l.type} · {formatDuration(l.durationSeconds)}
                            </span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
