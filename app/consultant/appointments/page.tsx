'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Mail, Phone, Video, MapPin, User, Building, MessageSquare, CheckCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getConsultationsByConsultant, updateConsultationStatus, type Consultation } from '@/lib/consultations';

export default function ConsultantAppointmentsPage() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'assigned' | 'scheduled' | 'completed'>('all');

  useEffect(() => {
    if (user?.id) {
      const loadConsultations = () => {
        const assignedConsultations = getConsultationsByConsultant(user.id);
        setConsultations(assignedConsultations);
      };
      
      loadConsultations();
      // Refresh every 5 seconds to catch new assignments
      const interval = setInterval(loadConsultations, 5000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const filteredConsultations = consultations.filter((consultation) => {
    if (filter === 'all') return true;
    return consultation.status === filter;
  });

  const stats = [
    {
      title: 'Total Appointments',
      value: consultations.length.toString(),
      color: 'text-[#1A2BC2]',
    },
    {
      title: 'Pending',
      value: consultations.filter((c) => c.status === 'pending' || c.status === 'assigned').length.toString(),
      color: 'text-yellow-600',
    },
    {
      title: 'Scheduled',
      value: consultations.filter((c) => c.status === 'scheduled').length.toString(),
      color: 'text-blue-600',
    },
    {
      title: 'Completed',
      value: consultations.filter((c) => c.status === 'completed').length.toString(),
      color: 'text-green-600',
    },
  ];

  const getStatusBadge = (status: Consultation['status']) => {
    const variants = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      assigned: 'bg-blue-50 text-blue-700 border-blue-200',
      scheduled: 'bg-green-50 text-green-700 border-green-200',
      completed: 'bg-gray-50 text-gray-700 border-gray-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    return variants[status] || variants.pending;
  };

  return (
    <DashboardLayout title="My Appointments">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Calendar className="h-4 w-4 text-[#1A2BC2]" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'assigned', 'scheduled', 'completed'] as const).map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption)}
              className={
                filter === filterOption
                  ? 'bg-[#1A2BC2] hover:bg-[#0D0D52] text-white'
                  : ''
              }
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </Button>
          ))}
        </div>

        {/* Consultations List */}
        <Card>
          <CardHeader>
            <CardTitle>Consultation Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredConsultations.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No appointments found</p>
                <p className="text-sm">
                  {filter === 'all'
                    ? "You don't have any assigned consultations yet."
                    : `No ${filter} consultations found.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedConsultation(consultation)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-[#1B1C1E]">{consultation.name}</h3>
                          <Badge variant="outline" className={getStatusBadge(consultation.status)}>
                            {consultation.status}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <a
                              href={`mailto:${consultation.email}`}
                              className="text-[#1A2BC2] hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {consultation.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <a
                              href={`tel:${consultation.phone}`}
                              className="text-[#1A2BC2] hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {consultation.phone}
                            </a>
                          </div>
                          {consultation.company && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Building className="w-4 h-4" />
                              {consultation.company}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(consultation.preferredDate).toLocaleDateString()} at {consultation.preferredTime}
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <MessageSquare className="w-4 h-4" />
                            <span className="font-medium">Service:</span>
                            <span>{consultation.service}</span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 ml-6">{consultation.message}</p>
                        </div>

                        {consultation.googleMeetLink && (
                          <div className="mt-3">
                            <a
                              href={consultation.googleMeetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A2BC2] hover:bg-[#0D0D52] text-white rounded-lg transition-colors text-sm font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Video className="w-4 h-4" />
                              Join Google Meet
                            </a>
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          Requested on {new Date(consultation.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Consultation Detail Modal */}
        {selectedConsultation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Consultation Details</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedConsultation(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Client Name
                  </label>
                  <p className="text-base mt-1">{selectedConsultation.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <p className="text-base mt-1">
                    <a
                      href={`mailto:${selectedConsultation.email}`}
                      className="text-[#1A2BC2] hover:underline"
                    >
                      {selectedConsultation.email}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </label>
                  <p className="text-base mt-1">
                    <a
                      href={`tel:${selectedConsultation.phone}`}
                      className="text-[#1A2BC2] hover:underline"
                    >
                      {selectedConsultation.phone}
                    </a>
                  </p>
                </div>
                {selectedConsultation.company && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Company
                    </label>
                    <p className="text-base mt-1">{selectedConsultation.company}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Service
                  </label>
                  <p className="text-base mt-1">{selectedConsultation.service}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Preferred Date & Time
                  </label>
                  <p className="text-base mt-1">
                    {new Date(selectedConsultation.preferredDate).toLocaleDateString()} at {selectedConsultation.preferredTime}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </label>
                  <p className="text-base whitespace-pre-wrap bg-gray-50 p-3 rounded mt-1">
                    {selectedConsultation.message}
                  </p>
                </div>
                {selectedConsultation.googleMeetLink && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Google Meet Link
                    </label>
                    <div className="mt-2">
                      <a
                        href={selectedConsultation.googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A2BC2] hover:bg-[#0D0D52] text-white rounded-lg transition-colors"
                      >
                        <Video className="w-4 h-4" />
                        Join Meeting
                      </a>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <div className="mt-1">
                    <Badge variant="outline" className={getStatusBadge(selectedConsultation.status)}>
                      {selectedConsultation.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  {selectedConsultation.status !== 'scheduled' && selectedConsultation.googleMeetLink && (
                    <Button
                      size="sm"
                      onClick={() => {
                        updateConsultationStatus(selectedConsultation.id, 'scheduled');
                        setConsultations(getConsultationsByConsultant(user?.id || ''));
                        setSelectedConsultation({
                          ...selectedConsultation,
                          status: 'scheduled',
                        });
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark as Scheduled
                    </Button>
                  )}
                  {selectedConsultation.status !== 'completed' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        updateConsultationStatus(selectedConsultation.id, 'completed');
                        setConsultations(getConsultationsByConsultant(user?.id || ''));
                        setSelectedConsultation({
                          ...selectedConsultation,
                          status: 'completed',
                        });
                      }}
                      className="bg-[#1A2BC2] hover:bg-[#0D0D52]"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark as Completed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

