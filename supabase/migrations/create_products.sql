create table if not exists public.products (
  id text primary key,
  name text not null,
  description text,
  price numeric not null,
  currency text default 'EUR',
  stock int default 0,
  supplier_id text references public.suppliers(id),
  image_url text,
  created_at timestamptz default now()
);
alter table public.products disable row level security;
