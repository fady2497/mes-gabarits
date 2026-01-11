-- Create users table for application profiles
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  password_hash text,
  first_name text,
  last_name text,
  plan text default 'free' check (plan in ('free','premium')),
  created_at timestamp with time zone default now()
);

-- Helpful index on created_at
create index if not exists users_created_at_idx on public.users(created_at desc);

-- Ensure RLS is enabled and allow owners to read/update their own profile
alter table public.users enable row level security;

-- Policy: users can select/update their own row
drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile" on public.users
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Policy: system/service can insert rows (handled by signUp server-side)
drop policy if exists "Service can insert users" on public.users;
create policy "Service can insert users" on public.users
  for insert with check (true);
