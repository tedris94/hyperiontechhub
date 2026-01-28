import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';
import { hashPassword, verifyPassword } from '@/lib/password';
import { DEMO_USERS } from '@/lib/demoUsers';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body || {};

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  let { data, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('email', email)
    .single();

  if ((!data || error) && DEMO_USERS.some((demo) => demo.email === email)) {
    const demoUser = DEMO_USERS.find((demo) => demo.email === email);
    if (demoUser) {
      const passwordHash = hashPassword(demoUser.password);
      const { data: inserted } = await supabase
        .from('app_users')
        .insert({
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          password_hash: passwordHash,
        })
        .select('*')
        .single();

      if (inserted) {
        data = inserted;
        error = null;
      }
    }
  }

  if (error || !data) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const isValid = verifyPassword(password, data.password_hash);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
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
