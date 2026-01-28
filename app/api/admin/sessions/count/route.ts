import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';

export async function GET() {
  const supabase = getSupabaseServer();
  const activeSince = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from('active_sessions')
    .select('id', { count: 'exact', head: true })
    .gte('last_seen', activeSince);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: count || 0 });
}
