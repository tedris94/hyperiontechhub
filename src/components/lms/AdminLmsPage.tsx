'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import RequireAuth from '@/components/RequireAuth'
import { formatPrice } from '@/lib/lmsApi'

export function AdminLmsPage({ view }: { view: 'overview' | 'categories' | 'orders' | 'reviews' | 'courses' }) {
  const [categories, setCategories] = useState<Array<Record<string, unknown>>>([])
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([])
  const [reviews, setReviews] = useState<Array<Record<string, unknown>>>([])
  const [courses, setCourses] = useState<Array<Record<string, unknown>>>([])
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    async function load() {
      if (view === 'categories' || view === 'overview') {
        const r = await fetch('/api/admin/lms/categories')
        if (r.ok) setCategories(await r.json())
      }
      if (view === 'orders' || view === 'overview') {
        const r = await fetch('/api/admin/lms/orders')
        if (r.ok) setOrders(await r.json())
      }
      if (view === 'reviews' || view === 'overview') {
        const r = await fetch('/api/admin/lms/reviews')
        if (r.ok) setReviews(await r.json())
      }
      if (view === 'courses') {
        const r = await fetch('/api/instructor/courses')
        if (r.ok) setCourses(await r.json())
      }
    }
    load()
  }, [view])

  async function createCategory() {
    if (!newCategory.trim()) return
    await fetch('/api/admin/lms/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory.trim() }),
    })
    setNewCategory('')
    const r = await fetch('/api/admin/lms/categories')
    if (r.ok) setCategories(await r.json())
  }

  async function moderateReview(id: number, status: 'approved' | 'rejected') {
    await fetch(`/api/admin/lms/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const r = await fetch('/api/admin/lms/reviews')
    if (r.ok) setReviews(await r.json())
  }

  const titles: Record<string, string> = {
    overview: 'LMS Overview',
    categories: 'Course Categories',
    orders: 'Orders',
    reviews: 'Review Moderation',
    courses: 'All Courses',
  }

  return (
    <RequireAuth message="Sign in with admin access to manage the LMS.">
      <DashboardLayout title={titles[view]}>
        {view === 'overview' && (
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Categories</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{categories.length}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Orders</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{orders.length}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pending reviews</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">
                {reviews.filter((r) => r.status === 'pending').length}
              </CardContent>
            </Card>
          </div>
        )}

        {view === 'categories' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="border rounded px-3 py-2 flex-1"
                placeholder="Category name"
              />
              <Button onClick={createCategory} className="bg-[#1A2BC2]">
                Add
              </Button>
            </div>
            {categories.map((c) => (
              <Card key={String(c.id)}>
                <CardContent className="p-4">{String(c.name)}</CardContent>
              </Card>
            ))}
          </div>
        )}

        {view === 'orders' && (
          <div className="space-y-3">
            {orders.map((o) => (
              <Card key={String(o.id)}>
                <CardContent className="p-4 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">{String(o.reference)}</p>
                    <p className="text-gray-500">
                      {(o.course as { title?: string })?.title} ·{' '}
                      {(o.student as { email?: string })?.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>{formatPrice(Number(o.amount ?? 0), String(o.currency))}</p>
                    <p className="capitalize text-gray-500">{String(o.status)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {view === 'reviews' && (
          <div className="space-y-3">
            {reviews.map((r) => (
              <Card key={String(r.id)}>
                <CardContent className="p-4 space-y-2">
                  <p className="text-sm">
                    {(r.student as { fullName?: string })?.fullName} · {'★'.repeat(Number(r.rating))}
                  </p>
                  <p className="text-sm text-gray-600">{String(r.comment ?? '')}</p>
                  <p className="text-xs capitalize text-gray-400">{String(r.status)}</p>
                  {r.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => moderateReview(Number(r.id), 'approved')}>
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moderateReview(Number(r.id), 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {view === 'courses' && (
          <div className="space-y-3">
            {courses.map((c) => (
              <Card key={String(c.id)}>
                <CardContent className="p-4 flex justify-between">
                  <span>{String(c.title)}</span>
                  <span className="text-sm capitalize text-gray-500">{String(c.status)}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DashboardLayout>
    </RequireAuth>
  )
}
