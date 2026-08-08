'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RequireAuth from '@/components/RequireAuth';

export default function InstructorAnalyticsPage() {
  const [courses, setCourses] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    fetch('/api/instructor/courses')
      .then((r) => r.json())
      .then((data) => setCourses(Array.isArray(data) ? data : []));
  }, []);

  const totalEnrollments = courses.reduce(
    (sum, c) => sum + Number(c.enrollmentCount ?? 0),
    0,
  );

  return (
    <RequireAuth>
      <DashboardLayout title="Analytics">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total courses</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{courses.length}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total enrollments</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{totalEnrollments}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Published</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {courses.filter((c) => c.status === 'published').length}
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Per-course breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {courses.map((c) => (
              <div key={String(c.id)} className="flex justify-between text-sm border-b pb-2">
                <span>{String(c.title)}</span>
                <span className="text-gray-500">
                  {Number(c.enrollmentCount ?? 0)} students · ★ {Number(c.ratingAvg ?? 0).toFixed(1)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </DashboardLayout>
    </RequireAuth>
  );
}
