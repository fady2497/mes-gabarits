create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('banner','slot')) not null,
  title text not null,
  subtitle text,
  href text,
  active boolean default true,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_ads_active on public.ads(active);
create index if not exists idx_ads_type on public.ads(type);
create index if not exists idx_ads_position on public.ads(position);

alter table public.ads disable row level security;

