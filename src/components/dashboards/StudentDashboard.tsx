'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, Award, Clock, TrendingUp, Video } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

type Enrollment = {
  id: number;
  progressPercent: number;
  status: string;
  learnUrl?: string | null;
  course: { title: string; slug: string } | null;
};

export function StudentDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    fetch('/api/lms/my-courses')
      .then((r) => r.json())
      .then((data) => setEnrollments(Array.isArray(data) ? data : []))
      .catch(() => setEnrollments([]));
  }, []);

  const completed = enrollments.filter((e) => e.status === 'completed').length;
  const avgProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + (e.progressPercent ?? 0), 0) / enrollments.length,
        )
      : 0;

  const stats = [
    { title: 'Enrolled Courses', value: String(enrollments.length), icon: BookOpen, change: 'Active enrollments' },
    { title: 'Completed', value: String(completed), icon: Award, change: `${avgProgress}% avg progress` },
    { title: 'In Progress', value: String(enrollments.length - completed), icon: Clock, change: 'Keep learning' },
    { title: 'Average Progress', value: `${avgProgress}%`, icon: TrendingUp, change: 'Across all courses' },
  ];

  return (
    <DashboardLayout title="Student Dashboard">
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
            <CardTitle>My learning</CardTitle>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/courses">Browse</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/student/my-courses">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {enrollments.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm mb-3">No enrollments yet. Browse the catalog to get started.</p>
                <Button asChild size="sm" className="bg-[#1A2BC2]">
                  <Link href="/courses">Browse courses</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.slice(0, 4).map((course) => (
                  <div key={course.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-semibold">{course.course?.title ?? 'Course'}</h4>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 capitalize">
                            {course.status}
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className="bg-[#1A2BC2] h-2 rounded-full transition-all"
                            style={{ width: `${course.progressPercent}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600">{course.progressPercent}% Complete</div>
                      </div>
                    </div>
                    {course.learnUrl ? (
                      <Button asChild size="sm" variant="outline" className="w-full">
                        <Link href={course.learnUrl}>
                          <Video className="w-3 h-3 mr-1" />
                          {(course.progressPercent ?? 0) <= 0 ? 'Start course' : 'Continue learning'}
                        </Link>
                      </Button>
                    ) : null}
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

