import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';
import { hashPassword } from '@/lib/password';

async function logUserActivity(
  action: string,
  targetUserId?: string,
  targetEmail?: string,
  details?: string
) {
  const supabase = getSupabaseServer();
  await supabase.from('app_user_activity').insert({
    action,
    target_user_id: targetUserId || null,
    target_email: targetEmail || null,
    details: details || null,
  });
}

export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('app_users')
    .select('id, email, name, role, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data || [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, role, password } = body || {};

  if (!name || !email || !role || !password) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const supabase = getSupabaseServer();

  const { data: existing } = await supabase
    .from('app_users')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
  }

  const passwordHash = hashPassword(password);

  const { data, error } = await supabase
    .from('app_users')
    .insert({
      name,
      email,
      role,
      password_hash: passwordHash,
    })
    .select('id, email, name, role, created_at')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Failed to create user.' }, { status: 500 });
  }

  await logUserActivity('create', data.id, data.email, `Role: ${data.role}`);

  return NextResponse.json({ user: data });
}
