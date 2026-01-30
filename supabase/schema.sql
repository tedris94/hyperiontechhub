create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service text not null,
  message text not null,
  status text not null default 'new',
  read boolean not null default false,
  replies jsonb,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  company text,
  service text not null,
  preferred_date date not null,
  preferred_time text not null,
  message text not null,
  status text not null default 'pending',
  read boolean not null default false,
  assigned_to text,
  assigned_to_name text,
  google_meet_link text,
  notes text,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  user_agent text,
  visitor_id text not null,
  created_at timestamp with time zone not null default now()
);

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_visitor_idx on public.page_views (visitor_id);

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  role text not null,
  password_hash text not null,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.active_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  last_seen timestamp with time zone not null default now()
);

create index if not exists active_sessions_last_seen_idx on public.active_sessions (last_seen desc);
create index if not exists active_sessions_user_idx on public.active_sessions (user_id);

create table if not exists public.app_user_activity (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  target_user_id uuid,
  target_email text,
  details text,
  created_at timestamp with time zone not null default now()
);

create index if not exists app_user_activity_created_at_idx on public.app_user_activity (created_at desc);

create table if not exists public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_name text,
  actor_email text,
  actor_role text,
  action text not null,
  target_id uuid,
  target_email text,
  target_role text,
  metadata jsonb,
  created_at timestamp with time zone not null default now()
);

create index if not exists admin_activity_logs_created_at_idx on public.admin_activity_logs (created_at desc);
