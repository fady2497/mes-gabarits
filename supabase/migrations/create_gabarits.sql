-- Create table for editor saves
create table if not exists public.gabarits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  nom text not null,
  description text,
  data_svg text not null,
  categorie text check (categorie in ('auto','moto','maison','bateau')) default 'auto',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_gabarits_user_id on public.gabarits(user_id);
create index if not exists idx_gabarits_categorie on public.gabarits(categorie);

-- Ensure RLS disabled for simplicity (anonymous use)
alter table public.gabarits disable row level security;
