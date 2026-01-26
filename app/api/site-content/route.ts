import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getSiteContent, type SiteContent } from '@/lib/site-content';

const contentPath = path.join(process.cwd(), 'content', 'site-content.json');

function isAuthorized(request: Request): boolean {
  const token = process.env.CMS_ADMIN_TOKEN;
  if (!token) {
    return false;
  }
  const authHeader = request.headers.get('authorization') || '';
  return authHeader === `Bearer ${token}`;
}

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json()) as SiteContent;
  await fs.writeFile(contentPath, JSON.stringify(payload, null, 2), 'utf-8');
  return NextResponse.json({ success: true });
}
