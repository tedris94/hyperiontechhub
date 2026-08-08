'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CourseCard, type CourseListItem } from '@/components/lms/CourseCard'

export function CourseCatalog() {
  const [courses, setCourses] = useState<CourseListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [level, setLevel] = useState('')
  const [freeOnly, setFreeOnly] = useState(false)

  async function load() {
    setLoading(true)
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (level) params.set('level', level)
    if (freeOnly) params.set('free', '1')
    const res = await fetch(`/api/courses?${params}`)
    const data = await res.json()
    setCourses(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses…"
            className="pl-10"
            onKeyDown={(e) => e.key === 'Enter' && load()}
          />
        </div>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <label className="flex items-center gap-2 text-sm px-2">
          <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} />
          Free only
        </label>
        <Button onClick={load} className="bg-[#1A2BC2]">
          Search
        </Button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-500">Loading courses…</div>
      ) : courses.length === 0 ? (
        <div className="py-16 text-center text-gray-500">No courses found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
