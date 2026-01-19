'use client';

import { DashboardLayout } from '../DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { GraduationCap, Users, CheckSquare, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function InstructorDashboard() {
  const stats = [
    { title: 'Active Classes', value: '4', icon: GraduationCap, change: 'This semester' },
    { title: 'Total Students', value: '127', icon: Users, change: '+8 new' },
    { title: 'Assignments Pending', value: '23', icon: CheckSquare, change: 'To grade' },
    { title: 'Average Rating', value: '4.8', icon: BarChart3, change: 'Out of 5.0' },
  ];

  const classes = [
    { name: 'Web Development 101', students: 32, assignments: 5, status: 'Active' },
    { name: 'Advanced React', students: 28, assignments: 3, status: 'Active' },
    { name: 'Full Stack Development', students: 45, assignments: 8, status: 'Active' },
  ];

  return (
    <DashboardLayout title="Instructor Dashboard">
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

        {/* My Classes */}
        <Card>
          <CardHeader>
            <CardTitle>My Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classes.map((classItem, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{classItem.name}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {classItem.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {classItem.students} students • {classItem.assignments} assignments
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Manage</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

