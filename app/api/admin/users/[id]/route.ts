import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';
import { hashPassword } from '@/lib/password';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, context: RouteContext) {
  const userId = context.params.id;
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

  return NextResponse.json({ user: data });
}

export async function DELETE(_: Request, context: RouteContext) {
  const userId = context.params.id;
  const supabase = getSupabaseServer();

  await supabase.from('active_sessions').delete().eq('user_id', userId);
  const { error } = await supabase.from('app_users').delete().eq('id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
