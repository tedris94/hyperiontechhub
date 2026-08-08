'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RequireAuth from '@/components/RequireAuth'
import { useAuth } from '@/contexts/AuthContext'
import CreateSchoolForm from '@/components/edusuite/CreateSchoolForm'

type SchoolRow = {
  id: string | number
  name: string
  slug: string
  schoolType?: string
  city?: string
  state?: string
  status?: string
}

export default function EduSuiteAdminPage() {
  return (
    <RequireAuth message="Sign in as a platform admin to manage EduSuite schools.">
      <EduSuiteAdminInner />
    </RequireAuth>
  )
}

function EduSuiteAdminInner() {
  const { user, hasCap } = useAuth()
  const [schools, setSchools] = useState<SchoolRow[]>([])
  const [error, setError] = useState('')
  const canManage = user?.role === 'super_admin' || user?.role === 'admin' || hasCap('edusuite.manage')

  useEffect(() => {
    if (!canManage) return
    void (async () => {
      try {
        const res = await fetch('/api/edusuite/records?collection=schools')
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load schools')
        setSchools(data.docs || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load')
      }
    })()
  }, [canManage])

  if (!canManage) {
    return (
      <main className="min-h-screen pt-20">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-lg">
          <p className="text-gray-600">Platform admin access required.</p>
          <Link href="/edusuite" className="text-[#1A2BC2] hover:underline text-sm mt-4 inline-block">
            ← Back to EduSuite
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20">
      <Header />
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl space-y-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#1B1C1E]">EduSuite platform admin</h1>
            <p className="text-gray-600 mt-2">{schools.length} school tenant(s).</p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <CreateSchoolForm />
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3">School</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {schools.map((s) => (
                  <tr key={String(s.id)} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3 capitalize">{s.schoolType || '—'}</td>
                    <td className="px-4 py-3">{[s.city, s.state].filter(Boolean).join(', ') || '—'}</td>
                    <td className="px-4 py-3">{s.status || 'active'}</td>
                    <td className="px-4 py-3">
                      <Link href={`/edusuite/${s.slug}`} className="text-[#1A2BC2] hover:underline">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/edusuite" className="text-[#1A2BC2] hover:underline text-sm">
            ← Back to school picker
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
