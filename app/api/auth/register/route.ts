import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';
import { hashPassword } from '@/lib/password';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, name, role } = body || {};

  if (!email || !password || !name || !role) {
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
      email,
      name,
      role,
      password_hash: passwordHash,
    })
    .select('*')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
  }

  return NextResponse.json({
    user: {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
    },
  });
}
