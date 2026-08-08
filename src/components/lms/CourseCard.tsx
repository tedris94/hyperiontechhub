'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, Users, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/lmsApi'

export type CourseListItem = {
  id: number
  title: string
  slug: string
  subtitle?: string
  level?: string
  price?: number
  currency?: string
  isFree?: boolean
  ratingAvg?: number
  ratingCount?: number
  enrollmentCount?: number
  thumbnailUrl?: string | null
  instructor?: { fullName?: string } | null
}

export function CourseCard({ course }: { course: CourseListItem }) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="relative h-44 bg-gradient-to-br from-[#1A2BC2]/10 to-[#0D0D52]/10">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[#1A2BC2] font-semibold">
              {course.title.slice(0, 1)}
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-[#1B1C1E] line-clamp-2">{course.title}</h3>
            <Badge variant="outline" className="shrink-0 capitalize">
              {course.level ?? 'all'}
            </Badge>
          </div>
          {course.subtitle && (
            <p className="text-sm text-gray-500 line-clamp-2">{course.subtitle}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              {(course.ratingAvg ?? 0).toFixed(1)} ({course.ratingCount ?? 0})
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {course.enrollmentCount ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="font-semibold text-[#1A2BC2]">
              {course.isFree ? 'Free' : formatPrice(course.price ?? 0, course.currency)}
            </span>
            {course.instructor?.fullName && (
              <span className="text-xs text-gray-500 truncate max-w-[120px]">
                {course.instructor.fullName}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '—'
  const mins = Math.floor(seconds / 60)
  const hrs = Math.floor(mins / 60)
  if (hrs > 0) return `${hrs}h ${mins % 60}m`
  return `${mins} min`
}

export function LessonTypeIcon({ type }: { type: string }) {
  return (
    <span className="text-xs text-gray-400 capitalize flex items-center gap-1">
      <Clock className="w-3 h-3" />
      {type}
    </span>
  )
}
