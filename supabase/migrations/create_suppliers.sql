create table if not exists public.suppliers (
  id text primary key,
  name text not null,
  api_key text,
  api_base text,
  created_at timestamptz default now()
);
alter table public.suppliers disable row level security;
