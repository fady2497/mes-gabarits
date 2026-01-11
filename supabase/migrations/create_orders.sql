create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  status text default 'pending_drop_ship',
  customer_first_name text,
  customer_last_name text,
  customer_email text,
  customer_phone text,
  address text,
  city text,
  postal_code text,
  country text,
  subtotal numeric,
  shipping numeric,
  tax numeric,
  total numeric,
  tracking text,
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id text,
  name text,
  price numeric,
  quantity int,
  supplier_id text
);

alter table public.orders disable row level security;
alter table public.order_items disable row level security;
