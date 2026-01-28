import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';

export async function GET() {
  const supabase = getSupabaseServer();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count: totalViews, error: totalError } = await supabase
    .from('page_views')
    .select('id', { count: 'exact', head: true });

  if (totalError) {
    return NextResponse.json({ error: totalError.message }, { status: 500 });
  }

  const { data: recentViews, error: recentError } = await supabase
    .from('page_views')
    .select('visitor_id, created_at')
    .gte('created_at', since)
    .limit(10000);

  if (recentError) {
    return NextResponse.json({ error: recentError.message }, { status: 500 });
  }

  const visitors = new Set((recentViews || []).map((row) => row.visitor_id));

  return NextResponse.json({
    totalViews: totalViews || 0,
    last24hViews: (recentViews || []).length,
    last24hVisitors: visitors.size,
  });
}
