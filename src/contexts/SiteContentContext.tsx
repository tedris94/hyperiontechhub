'use client';

import React, { createContext, useContext } from 'react';
import type { SiteContent } from '@/lib/site-content';

const SiteContentContext = createContext<SiteContent | null>(null);

export function SiteContentProvider({
  initialContent,
  children,
}: {
  initialContent: SiteContent;
  children: React.ReactNode;
}) {
  return (
    <SiteContentContext.Provider value={initialContent}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const content = useContext(SiteContentContext);
  if (!content) {
    throw new Error('useSiteContent must be used within SiteContentProvider');
  }
  return content;
}
