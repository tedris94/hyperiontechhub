import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';

export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const consultations = (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    company: item.company || '',
    service: item.service,
    preferredDate: item.preferred_date,
    preferredTime: item.preferred_time,
    message: item.message,
    status: item.status,
    createdAt: item.created_at,
    read: item.read,
    assignedTo: item.assigned_to || undefined,
    assignedToName: item.assigned_to_name || undefined,
    googleMeetLink: item.google_meet_link || undefined,
    notes: item.notes || undefined,
  }));

  return NextResponse.json({ consultations });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, updates } = body || {};

  if (!id || !updates) {
    return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('consultations')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ consultation: data });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body || {};

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { error } = await supabase.from('consultations').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
