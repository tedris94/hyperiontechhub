'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import RequireAuth from '@/components/RequireAuth'

export function InstructorCourseEditorPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const courseId = Number(params.id)
  const [course, setCourse] = useState<Record<string, unknown> | null>(null)
  const [sections, setSections] = useState<Array<Record<string, unknown>>>([])
  const [lessons, setLessons] = useState<Array<Record<string, unknown>>>([])
  const [sectionTitle, setSectionTitle] = useState('')
  const [lessonTitle, setLessonTitle] = useState('')
  const [selectedSection, setSelectedSection] = useState<number | null>(null)
  const [uploading, setUploading] = useState<number | null>(null)

  async function load() {
    const res = await fetch(`/api/instructor/courses/${courseId}`)
    const data = await res.json()
    if (!res.ok) {
      alert(data.error || 'Failed to load')
      router.push('/instructor/courses')
      return
    }
    setCourse(data.course)
    setSections(data.sections ?? [])
    setLessons(data.lessons ?? [])
  }

  useEffect(() => {
    if (courseId) load()
  }, [courseId])

  async function saveCourse(updates: Record<string, unknown>) {
    const res = await fetch(`/api/instructor/courses/${courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    const data = await res.json()
    if (res.ok) setCourse(data)
  }

  async function addSection() {
    if (!sectionTitle.trim()) return
    await fetch('/api/instructor/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId,
        title: sectionTitle.trim(),
        order: sections.length,
      }),
    })
    setSectionTitle('')
    load()
  }

  async function addLesson() {
    if (!lessonTitle.trim() || !selectedSection) return
    await fetch('/api/instructor/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId,
        sectionId: selectedSection,
        title: lessonTitle.trim(),
        type: 'video',
        order: lessons.filter((l) => l.section === selectedSection).length,
      }),
    })
    setLessonTitle('')
    load()
  }

  async function publish() {
    await saveCourse({ status: 'published' })
    load()
  }

  async function uploadVideo(lessonId: number, title: string) {
    setUploading(lessonId)
    try {
      const init = await fetch('/api/instructor/video/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      const data = await init.json()
      if (!init.ok) throw new Error(data.error)

      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'video/*'
      input.onchange = async () => {
        const file = input.files?.[0]
        if (!file) return
        const uploadRes = await fetch(data.uploadUrl, {
          method: 'PUT',
          headers: data.uploadHeaders,
          body: file,
        })
        if (!uploadRes.ok) throw new Error('Upload failed')
        await fetch(`/api/instructor/lessons/${lessonId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bunnyVideoId: data.videoId }),
        })
        load()
      }
      input.click()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(null)
    }
  }

  if (!course) {
    return (
      <RequireAuth>
        <DashboardLayout title="Edit course">
          <p className="text-gray-500">Loading…</p>
        </DashboardLayout>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth>
      <DashboardLayout title={String(course.title)}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                defaultValue={String(course.title)}
                onBlur={(e) => saveCourse({ title: e.target.value })}
              />
              <Input
                defaultValue={String(course.subtitle ?? '')}
                placeholder="Subtitle"
                onBlur={(e) => saveCourse({ subtitle: e.target.value })}
              />
              <div className="flex flex-wrap gap-2 items-center">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    defaultChecked={Boolean(course.isFree)}
                    onChange={(e) =>
                      saveCourse({ isFree: e.target.checked, price: e.target.checked ? 0 : course.price })
                    }
                  />
                  Free course
                </label>
                {!course.isFree && (
                  <Input
                    type="number"
                    className="w-40"
                    defaultValue={Number(course.price ?? 0)}
                    placeholder="Price in kobo"
                    onBlur={(e) => saveCourse({ price: Number(e.target.value), isFree: false })}
                  />
                )}
                <Badge variant="outline" className="capitalize">
                  {String(course.status)}
                </Badge>
                {course.status !== 'published' && (
                  <Button onClick={publish} className="bg-[#1A2BC2]">
                    Publish course
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Curriculum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  placeholder="New section title"
                />
                <Button onClick={addSection} variant="outline">
                  Add section
                </Button>
              </div>

              {sections.map((section) => {
                const sectionId = section.id as number
                const sectionLessons = lessons.filter((l) => l.section === sectionId)
                return (
                  <div key={sectionId} className="border rounded-lg p-4 space-y-3">
                    <h3 className="font-medium">{String(section.title)}</h3>
                    <ul className="space-y-2">
                      {sectionLessons.map((lesson) => (
                        <li
                          key={String(lesson.id)}
                          className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                        >
                          <span>{String(lesson.title)}</span>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="capitalize">
                              {String(lesson.type)}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={uploading === lesson.id}
                              onClick={() =>
                                uploadVideo(Number(lesson.id), String(lesson.title))
                              }
                            >
                              {lesson.bunnyVideoId ? 'Re-upload' : 'Upload video'}
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-2">
                      <Input
                        value={selectedSection === sectionId ? lessonTitle : ''}
                        onFocus={() => setSelectedSection(sectionId)}
                        onChange={(e) => {
                          setSelectedSection(sectionId)
                          setLessonTitle(e.target.value)
                        }}
                        placeholder="New lesson title"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedSection(sectionId)
                          addLesson()
                        }}
                      >
                        Add lesson
                      </Button>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </RequireAuth>
  )
}
