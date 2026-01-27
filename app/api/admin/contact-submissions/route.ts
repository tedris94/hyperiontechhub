import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';

export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const submissions = (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone || '',
    service: item.service,
    message: item.message,
    status: item.status,
    createdAt: item.created_at,
    read: item.read,
    replies: item.replies || [],
  }));

  return NextResponse.json({ submissions });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, updates } = body || {};

  if (!id || !updates) {
    return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('contact_submissions')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ submission: data });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body || {};

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { error } = await supabase.from('contact_submissions').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
