'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Play, Lock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { formatPrice } from '@/lib/lmsApi'
import { formatDuration } from '@/components/lms/CourseCard'

type CourseDetailClientProps = {
  slug: string
}

export function CourseDetailClient({ slug }: CourseDetailClientProps) {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/courses/${slug}`)
      const json = await res.json()
      setData(json)
      setLoading(false)
    }
    load()
  }, [slug])

  useEffect(() => {
    const reference = searchParams.get('reference')
    const payment = searchParams.get('payment')
    if (payment === 'verify' && reference) {
      fetch(`/api/lms/paystack/verify?reference=${encodeURIComponent(reference)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.status === 'paid') {
            window.location.href = `/courses/${slug}?enrolled=1`
          }
        })
    }
  }, [searchParams, slug])

  async function handleEnroll() {
    if (!user) {
      router.push(`/login?returnTo=${encodeURIComponent(`/courses/${slug}`)}`)
      return
    }
    setActionLoading(true)
    try {
      const res = await fetch('/api/lms/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug: slug }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      router.push(`/student/my-courses`)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Enrollment failed')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleCheckout() {
    if (!user) {
      router.push(`/login?returnTo=${encodeURIComponent(`/courses/${slug}`)}`)
      return
    }
    setActionLoading(true)
    try {
      const res = await fetch('/api/lms/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug: slug }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      window.location.href = json.authorizationUrl
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Checkout failed')
    } finally {
      setActionLoading(false)
    }
  }

  async function submitReview() {
    if (!user || !data?.course) return
    const course = data.course as { id: number }
    const res = await fetch('/api/lms/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: course.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      }),
    })
    const json = await res.json()
    if (!res.ok) {
      alert(json.error || 'Failed to submit review')
      return
    }
    alert('Review submitted for moderation.')
  }

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Loading course…</div>
  }

  if (!data?.course) {
    return <div className="py-20 text-center text-gray-500">Course not found.</div>
  }

  const course = data.course as Record<string, unknown>
  const sections = (data.sections as Array<Record<string, unknown>>) ?? []
  const reviews = (data.reviews as Array<Record<string, unknown>>) ?? []
  const enrolled = Boolean(data.enrolled)
  const learnUrl = typeof data.learnUrl === 'string' ? data.learnUrl : null
  const firstLesson = sections[0]?.lessons as Array<{ slug: string }> | undefined
  const startSlug = firstLesson?.[0]?.slug

  return (
    <div className="space-y-10">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <Badge className="mb-3 capitalize">{String(course.level)}</Badge>
            <h1 className="text-4xl font-bold text-[#1B1C1E]">{String(course.title)}</h1>
            {typeof course.subtitle === 'string' && course.subtitle && (
              <p className="text-xl text-gray-600 mt-2">{String(course.subtitle)}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {Number(course.ratingAvg ?? 0).toFixed(1)} ({Number(course.ratingCount ?? 0)} reviews)
              </span>
              <span>{Number(course.enrollmentCount ?? 0)} students</span>
              {(course.instructor as { fullName?: string })?.fullName && (
                <span>Instructor: {(course.instructor as { fullName: string }).fullName}</span>
              )}
            </div>
          </div>

          <div className="relative h-64 rounded-xl overflow-hidden bg-gradient-to-br from-[#1A2BC2]/20 to-[#0D0D52]/10">
            {typeof course.thumbnailUrl === 'string' && course.thumbnailUrl && (
              <Image
                src={String(course.thumbnailUrl)}
                alt={String(course.title)}
                fill
                className="object-cover"
              />
            )}
          </div>

          {(course.whatYouWillLearn as string[])?.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">What you&apos;ll learn</h2>
                <ul className="grid md:grid-cols-2 gap-2">
                  {(course.whatYouWillLearn as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Curriculum</h2>
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={String(section.id)}>
                    <h3 className="font-medium mb-2">{String(section.title)}</h3>
                    <ul className="space-y-2">
                      {((section.lessons as Array<Record<string, unknown>>) ?? []).map((lesson) => (
                        <li
                          key={String(lesson.slug)}
                          className="flex items-center justify-between p-3 rounded-lg border text-sm"
                        >
                          <span className="flex items-center gap-2">
                            {lesson.isPreview || enrolled ? (
                              <Play className="w-4 h-4 text-[#1A2BC2]" />
                            ) : (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}
                            {String(lesson.title)}
                            {Boolean(lesson.isPreview) && (
                              <Badge variant="outline" className="text-xs">
                                Preview
                              </Badge>
                            )}
                          </span>
                          <span className="text-gray-400">
                            {formatDuration(Number(lesson.durationSeconds ?? 0))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {reviews.length > 0 && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Reviews</h2>
                {reviews.map((r) => (
                  <div key={String(r.id)} className="border-b pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {(r.student as { fullName?: string })?.fullName ?? 'Student'}
                      </span>
                      <span className="text-yellow-500">{'★'.repeat(Number(r.rating))}</span>
                    </div>
                    {typeof r.comment === 'string' && r.comment && (
                      <p className="text-sm text-gray-600">{r.comment}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {enrolled && user && (
            <Card>
              <CardContent className="p-6 space-y-3">
                <h2 className="text-xl font-semibold">Leave a review</h2>
                <select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))
                  }
                  className="border rounded px-3 py-2"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} stars
                    </option>
                  ))}
                </select>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                  placeholder="Share your experience…"
                  className="w-full border rounded px-3 py-2 min-h-[80px]"
                />
                <Button onClick={submitReview} variant="outline">
                  Submit review
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <div className="text-3xl font-bold text-[#1A2BC2]">
                {course.isFree
                  ? 'Free'
                  : formatPrice(Number(course.price ?? 0), String(course.currency))}
              </div>
              {enrolled ? (
                <>
                  <Badge className="bg-green-100 text-green-800">Enrolled</Badge>
                  {(learnUrl || startSlug) && (
                    <Button asChild className="w-full bg-[#1A2BC2]">
                      <Link href={learnUrl ?? `/learn/${slug}/${startSlug}`}>Continue learning</Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/student/my-courses">Go to my courses</Link>
                  </Button>
                </>
              ) : course.isFree || Number(course.price) <= 0 ? (
                <Button
                  className="w-full bg-[#1A2BC2]"
                  onClick={handleEnroll}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Enrolling…' : 'Enroll for free'}
                </Button>
              ) : (
                <Button
                  className="w-full bg-[#1A2BC2]"
                  onClick={handleCheckout}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Redirecting…' : 'Buy with Paystack'}
                </Button>
              )}
              {!user && (
                <p className="text-xs text-gray-500 text-center">
                  <Link href={`/login?returnTo=/courses/${slug}`} className="text-[#1A2BC2]">
                    Sign in
                  </Link>{' '}
                  to enroll
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
