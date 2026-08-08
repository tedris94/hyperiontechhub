'use client';

import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import { ComingSoonPage } from '@/components/dashboards/ComingSoonPage';

type RoleSectionPageProps = {
  sections: Record<string, string>;
  roleLabel: string;
};

export function RoleSectionPage({ sections, roleLabel }: RoleSectionPageProps) {
  const params = useParams<{ section: string }>();
  const section = params.section;
  const title = sections[section];

  if (!title) {
    notFound();
  }

  return (
    <ComingSoonPage
      title={title}
      description={`${title} for ${roleLabel} accounts will be available in a future update.`}
    />
  );
}
