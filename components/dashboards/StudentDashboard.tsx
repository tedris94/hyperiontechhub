'use client';

import { DashboardLayout } from '../DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, Award, Clock, TrendingUp, Calendar, Video } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function StudentDashboard() {
  const stats = [
    { title: 'Enrolled Courses', value: '5', icon: BookOpen, change: '+2 this month' },
    { title: 'Completed', value: '3', icon: Award, change: '60% completion' },
    { title: 'Study Hours', value: '48', icon: Clock, change: '+12 this week' },
    { title: 'Average Score', value: '92%', icon: TrendingUp, change: '+5% improvement' },
  ];

  const courses = [
    { title: 'Web Development Fundamentals', progress: 85, instructor: 'John Smith', nextClass: 'Today, 2:00 PM', status: 'In Progress' },
    { title: 'Python for Data Science', progress: 60, instructor: 'Sarah Johnson', nextClass: 'Tomorrow, 10:00 AM', status: 'In Progress' },
    { title: 'Cloud Computing Essentials', progress: 40, instructor: 'Mike Davis', nextClass: 'Friday, 3:00 PM', status: 'In Progress' },
    { title: 'Mobile App Development', progress: 15, instructor: 'Emily Chen', nextClass: 'Monday, 1:00 PM', status: 'In Progress' },
  ];

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
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

        {/* My Courses */}
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-semibold">{course.title}</h4>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {course.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span>Instructor: {course.instructor}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {course.nextClass}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-[#1A2BC2] h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600">{course.progress}% Complete</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Video className="w-3 h-3 mr-1" />
                      Continue Learning
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

