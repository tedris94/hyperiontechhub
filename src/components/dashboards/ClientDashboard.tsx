'use client';

import { DashboardLayout } from '../DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FolderOpen, CheckCircle, Clock, DollarSign, FileText, MessageSquare, Calendar, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function ClientDashboard() {
  const stats = [
    { title: 'Active Projects', value: '3', icon: FolderOpen, change: '+1 this month', trend: 'up' },
    { title: 'Completed', value: '7', icon: CheckCircle, change: '70% success rate', trend: 'up' },
    { title: 'Pending Approvals', value: '2', icon: Clock, change: 'Needs attention', trend: 'neutral' },
    { title: 'Total Investment', value: '$42.5K', icon: DollarSign, change: 'Across all projects', trend: 'up' },
  ];

  const projects = [
    { 
      name: 'E-commerce Website Redesign', 
      status: 'In Progress', 
      progress: 65, 
      deadline: 'Dec 30, 2025',
      team: 'Team Alpha',
      budget: '$20,000',
      spent: '$15,000'
    },
    { 
      name: 'Mobile App Development', 
      status: 'In Review', 
      progress: 85, 
      deadline: 'Dec 25, 2025',
      team: 'Team Beta',
      budget: '$25,000',
      spent: '$18,000'
    },
    { 
      name: 'Cloud Infrastructure Migration', 
      status: 'Planning', 
      progress: 30, 
      deadline: 'Jan 20, 2026',
      team: 'Team Gamma',
      budget: '$15,000',
      spent: '$7,500'
    },
  ];

  const documents = [
    { name: 'Project Proposal - Website.pdf', type: 'Proposal', date: 'Dec 1, 2025', size: '2.4 MB' },
    { name: 'Design Mockups.fig', type: 'Design', date: 'Dec 5, 2025', size: '15.8 MB' },
    { name: 'Contract Agreement.pdf', type: 'Contract', date: 'Dec 10, 2025', size: '1.2 MB' },
    { name: 'Monthly Report Nov.pdf', type: 'Report', date: 'Dec 1, 2025', size: '890 KB' },
  ];

  return (
    <DashboardLayout title="Client Dashboard">
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

        {/* Current Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Projects</CardTitle>
              <Button size="sm" variant="outline">Request New Project</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-semibold">{project.name}</h4>
                        <Badge variant="outline" className={
                          project.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          project.status === 'In Review' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {project.deadline}
                        </span>
                        <span>Team: {project.team}</span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {project.spent} / {project.budget}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-[#1A2BC2] h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600">{project.progress}% Complete</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <FileText className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Contact
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3 mr-1" />
                      Files
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#1A2BC2]" />
                Recent Documents
              </span>
              <Button size="sm" variant="outline">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium">{doc.name}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                        <span>{doc.date}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

