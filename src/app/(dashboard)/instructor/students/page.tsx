'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import RequireAuth from '@/components/RequireAuth';

export default function InstructorStudentsPage() {
  const [courses, setCourses] = useState<Array<{ id: number; title: string; enrollmentCount?: number }>>([]);

  useEffect(() => {
    fetch('/api/instructor/courses')
      .then((r) => r.json())
      .then((data) => setCourses(Array.isArray(data) ? data : []));
  }, []);

  return (
    <RequireAuth>
      <DashboardLayout title="Students">
        <div className="space-y-4">
          {courses.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-sm text-gray-500">{c.enrollmentCount ?? 0} enrolled students</p>
                </div>
                <Link href={`/instructor/courses/${c.id}`} className="text-sm text-[#1A2BC2]">
                  View course
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    </RequireAuth>
  );
}
