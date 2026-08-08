'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import RequireAuth from '@/components/RequireAuth'
import { formatPrice } from '@/lib/lmsApi'

type CourseItem = {
  id: number
  title: string
  slug: string
  status: string
  isFree?: boolean
  price?: number
  enrollmentCount?: number
}

export function InstructorCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  async function load() {
    const res = await fetch('/api/instructor/courses')
    const data = await res.json()
    setCourses(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function createCourse() {
    if (!title.trim()) return
    const res = await fetch('/api/instructor/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), isFree: true }),
    })
    const data = await res.json()
    if (res.ok) {
      setTitle('')
      router.push(`/instructor/courses/${data.id}`)
    } else {
      alert(data.error || 'Failed to create course')
    }
  }

  return (
    <RequireAuth message="Sign in as an instructor to manage courses.">
      <DashboardLayout title="My Courses">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create new course</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Course title"
            />
            <Button onClick={createCourse} className="bg-[#1A2BC2] shrink-0">
              Create
            </Button>
          </CardContent>
        </Card>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <div className="grid gap-4">
            {courses.map((c) => (
              <Card key={c.id}>
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{c.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="capitalize">
                        {c.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {c.isFree ? 'Free' : formatPrice(c.price ?? 0)} · {c.enrollmentCount ?? 0}{' '}
                        students
                      </span>
                    </div>
                  </div>
                  <Button asChild variant="outline">
                    <Link href={`/instructor/courses/${c.id}`}>Edit course</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DashboardLayout>
    </RequireAuth>
  )
}
