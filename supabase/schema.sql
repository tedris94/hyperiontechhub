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
