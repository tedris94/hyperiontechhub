'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, FileText, Calendar, MessageSquare, Mail, Phone, Clock, CheckCircle, X, Send, AlertCircle, Video, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { getContactSubmissions, markAsRead, updateSubmissionStatus, deleteSubmission, addReply, type ContactSubmission } from '@/lib/contactSubmissions';
import { getConsultations, markAsRead as markConsultationAsRead, updateConsultationStatus, assignConsultation, generateGoogleMeetLink, updateConsultation, deleteConsultation, type Consultation } from '@/lib/consultations';
import { getStoredUsersCount, getActiveSessionCount } from '@/lib/adminMetrics';
import { useAuth } from '@/contexts/AuthContext';

export function AdminDashboard() {
  const { user } = useAuth();
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);
  
  // Consultation states
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeSessions, setActiveSessions] = useState(0);

  const refreshSubmissions = async () => {
    const submissions = await getContactSubmissions();
    setContactSubmissions(submissions);
  };

  const refreshConsultations = async () => {
    const consultationList = await getConsultations();
    setConsultations(consultationList);
  };

  useEffect(() => {
    const loadSubmissions = async () => {
      await refreshSubmissions();
    };
    
    const loadConsultations = async () => {
      await refreshConsultations();
    };

    const loadMetrics = async () => {
      const userCount = await getStoredUsersCount();
      setTotalUsers(userCount);
      setActiveSessions(getActiveSessionCount());
    };
    
    void loadSubmissions();
    void loadConsultations();
    void loadMetrics();
    // Refresh every 5 seconds to catch new submissions
    const interval = setInterval(() => {
      void loadSubmissions();
      void loadConsultations();
      void loadMetrics();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = contactSubmissions.filter((s) => !s.read).length;
  const newSubmissions = contactSubmissions.filter((s) => s.status === 'new').length;
  const pendingConsultations = consultations.filter((c) => c.status === 'pending').length;
  const unreadConsultations = consultations.filter((c) => !c.read).length;
  const scheduledConsultations = consultations.filter((c) => c.status === 'scheduled').length;

  // Get all consultants for assignment
  const getConsultants = () => {
    if (typeof window === 'undefined') return [];
    const storedUsers = localStorage.getItem('hyperion_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    return users.filter((u: any) => u.role === 'consultant');
  };

  const stats = [
    {
      title: 'Active Users',
      value: activeSessions.toString(),
      icon: Users,
      change: `${totalUsers} total`,
    },
    {
      title: 'Pending Consultations',
      value: pendingConsultations.toString(),
      icon: Calendar,
      change: `${unreadConsultations} unread`,
    },
    {
      title: 'Contact Submissions',
      value: contactSubmissions.length.toString(),
      icon: MessageSquare,
      change: `${unreadCount} unread`,
    },
    {
      title: 'Scheduled Events',
      value: scheduledConsultations.toString(),
      icon: Calendar,
      change: 'Scheduled',
    },
  ];

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    void refreshSubmissions();
    if (selectedSubmission?.id === id) {
      setSelectedSubmission({ ...selectedSubmission, read: true, status: 'read' });
    }
  };

  const handleStatusChange = async (id: string, status: ContactSubmission['status']) => {
    await updateSubmissionStatus(id, status);
    void refreshSubmissions();
    if (selectedSubmission?.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      await deleteSubmission(id);
      void refreshSubmissions();
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    }
  };

  const handleReply = async () => {
    if (!selectedSubmission) return;

    setReplyError('');
    setReplySuccess(false);
    setReplyLoading(true);

    try {
      const subject = replySubject || `Re: Your inquiry about ${selectedSubmission.service}`;
      
      const response = await fetch('/api/contact/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          to: selectedSubmission.email,
          subject: subject,
          message: replyMessage,
          replyTo: 'info@hyperiontechhub.com',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reply');
      }

      // Add reply to submission
      const reply = {
        id: Date.now().toString(),
        message: replyMessage,
        sentAt: new Date().toISOString(),
        sentBy: user?.name || 'Admin',
      };

      await addReply(selectedSubmission.id, reply, selectedSubmission.replies || []);
      void refreshSubmissions();
      
      // Update selected submission
      const updatedSubmission = {
        ...selectedSubmission,
        replies: [...(selectedSubmission.replies || []), reply],
        status: 'replied' as const,
      };
      setSelectedSubmission(updatedSubmission);

      setReplySuccess(true);
      setReplySubject('');
      setReplyMessage('');
      setShowReplyForm(false);

      // Clear success message after 3 seconds
      setTimeout(() => setReplySuccess(false), 3000);
    } catch (error) {
      setReplyError(error instanceof Error ? error.message : 'Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const pendingRequests = [
    { id: 'REQ-1234', type: 'Course Approval', user: 'Dr. Emily Parker', status: 'Pending', priority: 'High' },
    { id: 'REQ-1233', type: 'Enrollment Request', user: 'Michael Chen', status: 'Pending', priority: 'Medium' },
    { id: 'REQ-1232', type: 'Content Update', user: 'Sarah Johnson', status: 'In Review', priority: 'Low' },
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
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

        {/* Contact Form Submissions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#1A2BC2]" />
                Contact Form Submissions
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white">{unreadCount} new</Badge>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {contactSubmissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No contact submissions yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {contactSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                      !submission.read ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => {
                      setSelectedSubmission(submission);
                      if (!submission.read) {
                        handleMarkAsRead(submission.id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">{submission.name}</span>
                          {!submission.read && (
                            <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {submission.service}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {submission.email}
                          </span>
                          {submission.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {submission.phone}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{submission.message}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {new Date(submission.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 ml-2">
                        <Badge
                          variant="outline"
                          className={
                            submission.status === 'new'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : submission.status === 'read'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }
                        >
                          {submission.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Consultation Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#1A2BC2]" />
                Consultation Requests
                {unreadConsultations > 0 && (
                  <Badge className="bg-red-500 text-white">{unreadConsultations} new</Badge>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {consultations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No consultation requests yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {consultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className={`p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                      !consultation.read ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={async () => {
                      setSelectedConsultation(consultation);
                      if (!consultation.read) {
                        await markConsultationAsRead(consultation.id);
                        void refreshConsultations();
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">{consultation.name}</span>
                          {!consultation.read && (
                            <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              consultation.status === 'pending'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : consultation.status === 'assigned'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : consultation.status === 'scheduled'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : ''
                            }`}
                          >
                            {consultation.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {consultation.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {consultation.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(consultation.preferredDate).toLocaleDateString()} {consultation.preferredTime}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{consultation.message}</p>
                        {consultation.assignedToName && (
                          <div className="mt-2 text-xs text-gray-500">
                            Assigned to: <span className="font-medium">{consultation.assignedToName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {new Date(consultation.createdAt).toLocaleString()}
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
                  <CardTitle>Consultation Request Details</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedConsultation(null);
                      setShowAssignForm(false);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Name</label>
                  <p className="text-base">{selectedConsultation.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-base">
                    <a
                      href={`mailto:${selectedConsultation.email}`}
                      className="text-[#1A2BC2] hover:underline"
                    >
                      {selectedConsultation.email}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Phone</label>
                  <p className="text-base">
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
                    <label className="text-sm font-semibold text-gray-600">Company</label>
                    <p className="text-base">{selectedConsultation.company}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-600">Service</label>
                  <p className="text-base">{selectedConsultation.service}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Preferred Date & Time</label>
                  <p className="text-base">
                    {new Date(selectedConsultation.preferredDate).toLocaleDateString()} at {selectedConsultation.preferredTime}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Message</label>
                  <p className="text-base whitespace-pre-wrap bg-gray-50 p-3 rounded">
                    {selectedConsultation.message}
                  </p>
                </div>
                {selectedConsultation.assignedToName && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Assigned To</label>
                    <p className="text-base">{selectedConsultation.assignedToName}</p>
                  </div>
                )}
                {selectedConsultation.googleMeetLink && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Google Meet Link</label>
                    <div className="flex items-center gap-2">
                      <a
                        href={selectedConsultation.googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1A2BC2] hover:underline flex items-center gap-1"
                      >
                        <Video className="w-4 h-4" />
                        Join Meeting
                      </a>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <Badge
                    variant="outline"
                    className={
                      selectedConsultation.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : selectedConsultation.status === 'assigned'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : selectedConsultation.status === 'scheduled'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : ''
                    }
                  >
                    {selectedConsultation.status}
                  </Badge>
                </div>

                {/* Assignment Form */}
                {showAssignForm && (
                  <div className="pt-4 border-t space-y-4">
                    <Label htmlFor="consultant-select">Assign to Consultant</Label>
                    <select
                      id="consultant-select"
                      value={selectedConsultant}
                      onChange={(e) => setSelectedConsultant(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A2BC2] focus:border-[#1A2BC2]"
                    >
                      <option value="">Select a consultant</option>
                      {getConsultants().map((consultant: any) => (
                        <option key={consultant.id} value={consultant.id}>
                          {consultant.name} ({consultant.email})
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={async () => {
                          if (selectedConsultant) {
                            const consultant = getConsultants().find((c: any) => c.id === selectedConsultant);
                            if (consultant) {
                              await assignConsultation(
                                selectedConsultation.id,
                                consultant.id,
                                consultant.name
                              );
                              // Generate Google Meet link
                              const meetLink = generateGoogleMeetLink(
                                selectedConsultation.id,
                                `Consultation with ${selectedConsultation.name}`
                              );
                              await updateConsultation(selectedConsultation.id, {
                                googleMeetLink: meetLink,
                                status: 'assigned',
                              });
                              void refreshConsultations();
                              setSelectedConsultation({
                                ...selectedConsultation,
                                assignedTo: consultant.id,
                                assignedToName: consultant.name,
                                googleMeetLink: meetLink,
                                status: 'assigned',
                              });
                              setShowAssignForm(false);
                              setSelectedConsultant('');
                            }
                          }
                        }}
                        disabled={!selectedConsultant}
                        className="bg-[#1A2BC2] hover:bg-[#0D0D52]"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Assign
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowAssignForm(false);
                          setSelectedConsultant('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t flex-wrap">
                  {!showAssignForm && selectedConsultation.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => setShowAssignForm(true)}
                      className="bg-[#1A2BC2] hover:bg-[#0D0D52]"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Assign Consultant
                    </Button>
                  )}
                  {selectedConsultation.status === 'assigned' && !selectedConsultation.googleMeetLink && (
                    <Button
                      size="sm"
                        onClick={async () => {
                        const meetLink = generateGoogleMeetLink(
                          selectedConsultation.id,
                          `Consultation with ${selectedConsultation.name}`
                        );
                          await updateConsultation(selectedConsultation.id, {
                          googleMeetLink: meetLink,
                          status: 'scheduled',
                        });
                          void refreshConsultations();
                        setSelectedConsultation({
                          ...selectedConsultation,
                          googleMeetLink: meetLink,
                          status: 'scheduled',
                        });
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Generate Google Meet Link
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await updateConsultationStatus(selectedConsultation.id, 'scheduled');
                      void refreshConsultations();
                      setSelectedConsultation({
                        ...selectedConsultation,
                        status: 'scheduled',
                      });
                    }}
                  >
                    Mark as Scheduled
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await updateConsultationStatus(selectedConsultation.id, 'completed');
                      void refreshConsultations();
                      setSelectedConsultation({
                        ...selectedConsultation,
                        status: 'completed',
                      });
                    }}
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this consultation?')) {
                        await deleteConsultation(selectedConsultation.id);
                        void refreshConsultations();
                        setSelectedConsultation(null);
                      }
                    }}
                    className="ml-auto"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Submission Detail Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Contact Submission Details</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedSubmission(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Name</label>
                  <p className="text-base">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-base">
                    <a
                      href={`mailto:${selectedSubmission.email}`}
                      className="text-[#1A2BC2] hover:underline"
                    >
                      {selectedSubmission.email}
                    </a>
                  </p>
                </div>
                {selectedSubmission.phone && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Phone</label>
                    <p className="text-base">
                      <a
                        href={`tel:${selectedSubmission.phone}`}
                        className="text-[#1A2BC2] hover:underline"
                      >
                        {selectedSubmission.phone}
                      </a>
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-600">Service</label>
                  <p className="text-base">{selectedSubmission.service}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Message</label>
                  <p className="text-base whitespace-pre-wrap bg-gray-50 p-3 rounded">
                    {selectedSubmission.message}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Submitted</label>
                  <p className="text-base text-gray-500">
                    {new Date(selectedSubmission.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Replies Section */}
                {selectedSubmission.replies && selectedSubmission.replies.length > 0 && (
                  <div className="pt-4 border-t">
                    <label className="text-sm font-semibold text-gray-600 mb-3 block">Replies</label>
                    <div className="space-y-3">
                      {selectedSubmission.replies.map((reply) => (
                        <div key={reply.id} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-900">{reply.sentBy}</span>
                            <span className="text-xs text-blue-600">
                              {new Date(reply.sentAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-blue-800 whitespace-pre-wrap">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reply Form */}
                {showReplyForm && (
                  <div className="pt-4 border-t space-y-4">
                    {replyError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{replyError}</AlertDescription>
                      </Alert>
                    )}
                    {replySuccess && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Reply sent successfully!
                        </AlertDescription>
                      </Alert>
                    )}
                    <div>
                      <Label htmlFor="reply-subject">Subject</Label>
                      <Input
                        id="reply-subject"
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        placeholder={`Re: Your inquiry about ${selectedSubmission.service}`}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reply-message">Message</Label>
                      <textarea
                        id="reply-message"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply here..."
                        rows={6}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A2BC2] focus:border-[#1A2BC2] resize-none"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleReply}
                        disabled={replyLoading || !replyMessage.trim()}
                        className="bg-[#1A2BC2] hover:bg-[#0D0D52]"
                      >
                        {replyLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-1" />
                            Send Reply
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowReplyForm(false);
                          setReplyError('');
                          setReplyMessage('');
                          setReplySubject('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  {!showReplyForm && (
                    <Button
                      size="sm"
                      onClick={() => setShowReplyForm(true)}
                      className="bg-[#1A2BC2] hover:bg-[#0D0D52]"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(selectedSubmission.id, 'read')}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Mark as Read
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(selectedSubmission.id, 'replied')}
                  >
                    Mark as Replied
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(selectedSubmission.id, 'archived')}
                  >
                    Archive
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(selectedSubmission.id)}
                    className="ml-auto"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

