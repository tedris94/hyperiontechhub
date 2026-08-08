'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import RequireAuth from '@/components/RequireAuth'
import { STUDENT_SECTIONS } from '@/lib/roleSectionTitles'
import { MyLearningPage, type MyLearningEnrollment } from '@/components/lms/MyLearningPage'

export function StudentSectionRouter() {
  const params = useParams<{ section: string }>()
  const section = params.section
  const title = STUDENT_SECTIONS[section]

  if (!title) notFound()

  return (
    <RequireAuth message="Please sign in to access your student portal.">
      <StudentSectionContent section={section} title={title} />
    </RequireAuth>
  )
}

function StudentSectionContent({ section, title }: { section: string; title: string }) {
  const [enrollments, setEnrollments] = useState<MyLearningEnrollment[]>([])
  const [certificates, setCertificates] = useState<Array<Record<string, unknown>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      if (section === 'my-courses' || section === 'resources') {
        const res = await fetch('/api/lms/my-courses')
        const data = await res.json()
        setEnrollments(Array.isArray(data) ? data : [])
      }
      if (section === 'certificates') {
        const res = await fetch('/api/lms/my-courses')
        const data = (await res.json()) as MyLearningEnrollment[]
        const completed = (Array.isArray(data) ? data : []).filter(
          (e) => e.status === 'completed' || (e.progressPercent ?? 0) >= 100,
        )
        const certs = await Promise.all(
          completed.map(async (e) => {
            const r = await fetch(`/api/lms/certificate/${e.id}`)
            if (r.ok) return r.json()
            return null
          }),
        )
        setCertificates(certs.filter(Boolean))
      }
      setLoading(false)
    }
    load()
  }, [section])

  return (
    <DashboardLayout title={title}>
      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading…</div>
      ) : section === 'my-courses' ? (
        <MyLearningPage enrollments={enrollments} />
      ) : section === 'certificates' ? (
        <div className="grid gap-4">
          {certificates.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-600">
                Complete a course to earn your certificate.
              </CardContent>
            </Card>
          ) : (
            certificates.map((c, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {(c.course as { title?: string })?.title ?? 'Certificate'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Serial: {String(c.serial)}</p>
                  <p className="text-sm text-gray-600">
                    Issued: {c.issuedAt ? new Date(String(c.issuedAt)).toLocaleDateString() : '—'}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : section === 'grades' || section === 'assignments' ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-600">
            Quiz grades appear here after you complete assessments in your courses.
            <div className="mt-4">
              <Button asChild variant="outline">
                <Link href="/student/my-courses">View my learning</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : section === 'resources' ? (
        <div className="grid gap-4">
          {enrollments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-600">
                Enroll in a course to access learning resources.
              </CardContent>
            </Card>
          ) : (
            enrollments.map((e) => (
              <Card key={e.id}>
                <CardContent className="p-4 flex justify-between items-center gap-4">
                  <span className="font-medium">{e.course?.title}</span>
                  {e.learnUrl ? (
                    <Button asChild size="sm" className="bg-[#1A2BC2]">
                      <Link href={e.learnUrl}>Open player</Link>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : null}
    </DashboardLayout>
  )
}
