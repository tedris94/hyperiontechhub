import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  const body = await request.json();
  const { userId } = body || {};

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const supabase = getSupabaseServer();

  const { data: existing } = await supabase
    .from('active_sessions')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (existing?.id) {
    const { error } = await supabase
      .from('active_sessions')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', existing.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  const { error } = await supabase.from('active_sessions').insert({
    user_id: userId,
    last_seen: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { userId } = body || {};

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { error } = await supabase.from('active_sessions').delete().eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
