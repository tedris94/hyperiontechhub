'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export type MyLearningEnrollment = {
  id: number
  progressPercent: number
  status: string
  enrolledAt?: string | null
  learnUrl?: string | null
  thumbnailUrl?: string | null
  instructorName?: string | null
  course: {
    title: string
    slug: string
    thumbnailUrl?: string | null
    instructor?: { fullName?: string } | null
  } | null
}

type ProgressFilter = 'all' | 'not_started' | 'in_progress' | 'completed'
type SortMode = 'recent' | 'progress'

export function MyLearningPage({ enrollments }: { enrollments: MyLearningEnrollment[] }) {
  const [query, setQuery] = useState('')
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>('all')
  const [sort, setSort] = useState<SortMode>('recent')

  const filtered = useMemo(() => {
    let list = [...enrollments]

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter((e) => {
        const title = e.course?.title?.toLowerCase() ?? ''
        const instructor =
          e.instructorName?.toLowerCase() ??
          e.course?.instructor?.fullName?.toLowerCase() ??
          ''
        return title.includes(q) || instructor.includes(q)
      })
    }

    if (progressFilter === 'not_started') {
      list = list.filter((e) => (e.progressPercent ?? 0) <= 0 && e.status !== 'completed')
    } else if (progressFilter === 'in_progress') {
      list = list.filter(
        (e) => (e.progressPercent ?? 0) > 0 && (e.progressPercent ?? 0) < 100 && e.status !== 'completed',
      )
    } else if (progressFilter === 'completed') {
      list = list.filter((e) => e.status === 'completed' || (e.progressPercent ?? 0) >= 100)
    }

    if (sort === 'progress') {
      list.sort((a, b) => (b.progressPercent ?? 0) - (a.progressPercent ?? 0))
    } else {
      list.sort((a, b) => {
        const ta = a.enrolledAt ? new Date(a.enrolledAt).getTime() : 0
        const tb = b.enrolledAt ? new Date(b.enrolledAt).getTime() : 0
        return tb - ta
      })
    }

    return list
  }, [enrollments, query, progressFilter, sort])

  if (enrollments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <h2 className="text-xl font-semibold text-[#1B1C1E] mb-2">Start learning</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          You haven&apos;t enrolled in any courses yet. Browse the catalog and pick your first course.
        </p>
        <Button asChild className="bg-[#1A2BC2] hover:bg-[#0D0D52]">
          <Link href="/courses">Browse courses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <select
            value={progressFilter}
            onChange={(e) => setProgressFilter(e.target.value as ProgressFilter)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white min-w-[140px]"
            aria-label="Filter by progress"
          >
            <option value="all">All progress</option>
            <option value="not_started">Not started</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search my courses"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-[#1B1C1E]">
          {filtered.length} {filtered.length === 1 ? 'course' : 'courses'}
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
          aria-label="Sort courses"
        >
          <option value="recent">Recently enrolled</option>
          <option value="progress">Progress</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No courses match your filters.</p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filtered.map((e) => (
            <LearningCourseCard key={e.id} enrollment={e} />
          ))}
        </div>
      )}
    </div>
  )
}

function LearningCourseCard({ enrollment }: { enrollment: MyLearningEnrollment }) {
  const title = enrollment.course?.title ?? 'Course'
  const progress = enrollment.progressPercent ?? 0
  const isComplete = enrollment.status === 'completed' || progress >= 100
  const thumb =
    enrollment.thumbnailUrl ||
    enrollment.course?.thumbnailUrl ||
    null
  const instructor =
    enrollment.instructorName ||
    enrollment.course?.instructor?.fullName ||
    ''
  const href = enrollment.learnUrl

  const cardInner = (
    <>
      <div className="relative aspect-video bg-gradient-to-br from-[#1A2BC2]/15 to-[#0D0D52]/20 overflow-hidden">
        {thumb ? (
          <Image src={thumb} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-[#1A2BC2]/40">
            {title.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>
      <div className="p-3 space-y-2 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm text-[#1B1C1E] line-clamp-2 leading-snug group-hover:text-[#1A2BC2] transition-colors">
          {title}
        </h3>
        {instructor && <p className="text-xs text-gray-500 truncate">{instructor}</p>}

        <div className="mt-auto pt-2">
          {isComplete ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-green-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed
              </div>
              {href && (
                <span className="text-xs font-semibold text-[#1A2BC2] uppercase tracking-wide">
                  Review
                </span>
              )}
            </div>
          ) : progress <= 0 ? (
            href && (
              <span className="text-xs font-semibold text-[#1A2BC2] uppercase tracking-wide">
                Start course
              </span>
            )
          ) : (
            <div className="space-y-1.5">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-[#1A2BC2] h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600">{progress}% complete</p>
            </div>
          )}
        </div>
      </div>
    </>
  )

  if (!href) {
    return (
      <div className="group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {cardInner}
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {cardInner}
    </Link>
  )
}
