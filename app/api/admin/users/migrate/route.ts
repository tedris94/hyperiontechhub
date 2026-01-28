import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';
import { hashPassword } from '@/lib/password';

function isAuthorized(request: Request): boolean {
  const token = process.env.CMS_ADMIN_TOKEN;
  if (!token) {
    return false;
  }
  const authHeader = request.headers.get('authorization') || '';
  return authHeader === `Bearer ${token}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { users } = body || {};

  if (!Array.isArray(users)) {
    return NextResponse.json({ error: 'Users array required.' }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  let insertedCount = 0;

  for (const user of users) {
    const { email, name, role, password } = user || {};
    if (!email || !name || !role || !password) {
      continue;
    }

    const { data: existing } = await supabase
      .from('app_users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      continue;
    }

    const passwordHash = hashPassword(password);
    const { error } = await supabase.from('app_users').insert({
      email,
      name,
      role,
      password_hash: passwordHash,
    });

    if (!error) {
      insertedCount += 1;
    }
  }

  return NextResponse.json({ inserted: insertedCount });
}
