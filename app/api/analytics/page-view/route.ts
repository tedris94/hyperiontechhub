import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path, referrer, userAgent, visitorId } = body || {};

    if (!path || !visitorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase.from('page_views').insert({
      path,
      referrer: referrer || null,
      user_agent: userAgent || null,
      visitor_id: visitorId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log page view' }, { status: 500 });
  }
}
