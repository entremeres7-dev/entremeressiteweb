-- Candidatures casting EntreMeres TV
-- À exécuter dans Supabase SQL Editor (une seule fois)

create table if not exists public.casting_applications (
  id uuid primary key default gen_random_uuid(),
  show_name text not null check (char_length(trim(show_name)) > 0),
  first_name text not null check (char_length(trim(first_name)) > 0),
  last_name text not null check (char_length(trim(last_name)) > 0),
  email text not null check (char_length(trim(email)) > 0),
  phone text not null check (char_length(trim(phone)) > 0),
  city text not null check (char_length(trim(city)) > 0),
  age int not null check (age >= 18 and age <= 99),
  children_count int not null check (children_count >= 0 and children_count <= 20),
  availability text not null check (availability in ('semaine', 'weekend', 'flexible')),
  motivation text not null check (char_length(trim(motivation)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_casting_applications_created
  on public.casting_applications (created_at desc);

alter table public.casting_applications enable row level security;

drop policy if exists "casting_applications_anon_insert" on public.casting_applications;
create policy "casting_applications_anon_insert"
  on public.casting_applications
  for insert
  to anon
  with check (true);
