'use client';

import { ReactNode } from 'react';
import RequireAuth from '@/components/RequireAuth';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

type ComingSoonPageProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function ComingSoonPage({ title, description, children }: ComingSoonPageProps) {
  return (
    <RequireAuth>
      <DashboardLayout title={title}>
        {children ?? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Construction className="h-5 w-5 text-[#1A2BC2]" />
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {description ?? 'This section is being built. Check back soon for updates.'}
              </p>
            </CardContent>
          </Card>
        )}
      </DashboardLayout>
    </RequireAuth>
  );
}
