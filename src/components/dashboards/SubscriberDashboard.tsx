'use client';

import { DashboardLayout } from '../DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Package, Folder, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function SubscriberDashboard() {
  const stats = [
    { title: 'Active Subscriptions', value: '3', icon: Package, change: 'All active' },
    { title: 'Resources Available', value: '124', icon: Folder, change: 'Updated weekly' },
    { title: 'Support Tickets', value: '2', icon: HelpCircle, change: '1 open' },
  ];

  const subscriptions = [
    { name: 'Premium Plan', status: 'Active', expires: 'Jan 15, 2026', features: ['All Courses', 'Priority Support'] },
    { name: 'Resource Library', status: 'Active', expires: 'Feb 1, 2026', features: ['Templates', 'Guides'] },
  ];

  return (
    <DashboardLayout title="Subscriber Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
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

        {/* My Subscriptions */}
        <Card>
          <CardHeader>
            <CardTitle>My Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subscriptions.map((subscription, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{subscription.name}</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {subscription.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        Expires: {subscription.expires}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {subscription.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Manage</Button>
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

