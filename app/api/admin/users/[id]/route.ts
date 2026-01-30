import { NextRequest, NextResponse } from 'next/server';
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

interface RouteContext {
  params: {
    id: string;
  };
}

type NextRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: NextRouteContext) {
  const { id: userId } = await context.params;
  const body = await request.json();
  const { name, email, role, password } = body || {};

  if (!name || !email || !role) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const updatePayload: Record<string, string> = {
    name,
    email,
    role,
  };

  if (password) {
    updatePayload.password_hash = hashPassword(password);
  }

  const { data, error } = await supabase
    .from('app_users')
    .update(updatePayload)
    .eq('id', userId)
    .select('id, email, name, role, created_at')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Failed to update user.' }, { status: 500 });
  }

  const updatedFields = ['name', 'email', 'role'];
  if (password) {
    updatedFields.push('password');
  }
  await logUserActivity('update', data.id, data.email, `Fields: ${updatedFields.join(', ')}`);

  return NextResponse.json({ user: data });
}

export async function DELETE(_: NextRequest, context: NextRouteContext) {
  const { id: userId } = await context.params;
  const supabase = getSupabaseServer();

  const { data: existingUser } = await supabase
    .from('app_users')
    .select('id, email')
    .eq('id', userId)
    .single();

  await supabase.from('active_sessions').delete().eq('user_id', userId);
  const { error } = await supabase.from('app_users').delete().eq('id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (existingUser) {
    await logUserActivity('delete', existingUser.id, existingUser.email);
  }

  return NextResponse.json({ success: true });
}
