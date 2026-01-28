'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Briefcase, Users, Calendar, BarChart3, Video, Mail, Phone, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getConsultationsByConsultant, type Consultation } from '@/lib/consultations';
import Link from 'next/link';

export function ConsultantDashboard() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    if (user?.id) {
      const loadConsultations = async () => {
        const assignedConsultations = await getConsultationsByConsultant(user.id);
        setConsultations(assignedConsultations);
      };
      
      void loadConsultations();
      // Refresh every 5 seconds to catch new assignments
      const interval = setInterval(loadConsultations, 5000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const pendingConsultations = consultations.filter((c) => c.status === 'pending' || c.status === 'assigned').length;
  const scheduledConsultations = consultations.filter((c) => c.status === 'scheduled').length;
  const completedConsultations = consultations.filter((c) => c.status === 'completed').length;

  const stats = [
    { title: 'Total Appointments', value: consultations.length.toString(), icon: Calendar, change: 'All time' },
    { title: 'Pending', value: pendingConsultations.toString(), icon: Briefcase, change: 'Requires attention' },
    { title: 'Scheduled', value: scheduledConsultations.toString(), icon: Calendar, change: 'Upcoming' },
    { title: 'Completed', value: completedConsultations.toString(), icon: BarChart3, change: 'This month' },
  ];

  return (
    <DashboardLayout title="Consultant Dashboard">
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

        {/* Recent Consultations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Consultations</CardTitle>
              <Link href="/consultant/appointments">
                <Button size="sm" variant="outline">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {consultations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-2">No consultations assigned yet</p>
                <p className="text-sm">You'll see consultation requests here once they're assigned to you.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {consultations.slice(0, 5).map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{consultation.name}</span>
                        <Badge
                          variant="outline"
                          className={
                            consultation.status === 'pending' || consultation.status === 'assigned'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              : consultation.status === 'scheduled'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }
                        >
                          {consultation.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        {consultation.service} • {new Date(consultation.preferredDate).toLocaleDateString()} at {consultation.preferredTime}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {consultation.email}
                        </span>
                        {consultation.googleMeetLink && (
                          <a
                            href={consultation.googleMeetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#1A2BC2] hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Video className="w-3 h-3" />
                            Join Meeting
                          </a>
                        )}
                      </div>
                    </div>
                    <Link href="/consultant/appointments">
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                  </div>
                ))}
                {consultations.length > 5 && (
                  <div className="text-center pt-2">
                    <Link href="/consultant/appointments">
                      <Button variant="ghost" size="sm">
                        View {consultations.length - 5} more
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

