'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { GraduationCap, Users, BookOpen, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

type CourseItem = {
  id: number;
  title: string;
  status: string;
  enrollmentCount?: number;
  ratingAvg?: number;
};

export function InstructorDashboard() {
  const [courses, setCourses] = useState<CourseItem[]>([]);

  useEffect(() => {
    fetch('/api/instructor/courses')
      .then((r) => r.json())
      .then((data) => setCourses(Array.isArray(data) ? data : []))
      .catch(() => setCourses([]));
  }, []);

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollmentCount ?? 0), 0);
  const published = courses.filter((c) => c.status === 'published').length;
  const avgRating =
    courses.length > 0
      ? (
          courses.reduce((sum, c) => sum + (c.ratingAvg ?? 0), 0) / courses.length
        ).toFixed(1)
      : '0';

  const stats = [
    { title: 'My Courses', value: String(courses.length), icon: GraduationCap, change: `${published} published` },
    { title: 'Total Students', value: String(totalStudents), icon: Users, change: 'Across all courses' },
    { title: 'Draft Courses', value: String(courses.length - published), icon: BookOpen, change: 'Ready to publish' },
    { title: 'Average Rating', value: avgRating, icon: BarChart3, change: 'Out of 5.0' },
  ];

  return (
    <DashboardLayout title="Instructor Dashboard">
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-[#1A2BC2]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Courses</CardTitle>
            <Button asChild size="sm" className="bg-[#1A2BC2]">
              <Link href="/instructor/courses">Manage courses</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-gray-500 text-sm">No courses yet. Create your first course to get started.</p>
            ) : (
              <div className="space-y-3">
                {courses.slice(0, 5).map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{course.title}</span>
                        <Badge variant="outline" className="capitalize">
                          {course.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {course.enrollmentCount ?? 0} students · Rating {course.ratingAvg ?? 0}
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/instructor/courses/${course.id}`}>Edit</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
