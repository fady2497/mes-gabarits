create table if not exists public.order_shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  supplier_id text references public.suppliers(id),
  supplier_order_id text,
  status text default 'processing',
  created_at timestamptz default now()
);
alter table public.order_shipments disable row level security;
