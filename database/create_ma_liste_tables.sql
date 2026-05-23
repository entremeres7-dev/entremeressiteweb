-- Ma liste TV : contenus sauvegardés par utilisatrice
-- À exécuter dans Supabase SQL Editor (une seule fois)

create table if not exists public.ma_liste_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content_key text not null,
  title text not null,
  episode text,
  color text not null default '#1a1a1a',
  watch_show_title text,
  watch_episode_title text,
  watch_episode_subtitle text,
  created_at timestamptz not null default now(),
  unique (user_id, content_key)
);

create index if not exists idx_ma_liste_user_created on public.ma_liste_items (user_id, created_at desc);

alter table public.ma_liste_items enable row level security;

drop policy if exists "ma liste select own" on public.ma_liste_items;
create policy "ma liste select own" on public.ma_liste_items
  for select using (auth.uid() = user_id);

drop policy if exists "ma liste insert own" on public.ma_liste_items;
create policy "ma liste insert own" on public.ma_liste_items
  for insert with check (auth.uid() = user_id);

drop policy if exists "ma liste delete own" on public.ma_liste_items;
create policy "ma liste delete own" on public.ma_liste_items
  for delete using (auth.uid() = user_id);
