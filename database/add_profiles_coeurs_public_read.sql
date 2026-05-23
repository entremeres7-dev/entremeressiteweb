-- Permet d'afficher l'emoji de palier à côté des pseudos (SOS Maman, Rencontres).
-- Exécuter dans Supabase SQL Editor après create_gamification_tables.sql

create or replace function public.get_profiles_coeurs(p_user_ids uuid[])
returns table (user_id uuid, coeurs int)
language sql
security definer
stable
set search_path = public
as $$
  select p.id as user_id, coalesce(p.coeurs, 0)::int as coeurs
  from public.profiles p
  where p.id = any (p_user_ids);
$$;

revoke all on function public.get_profiles_coeurs(uuid[]) from public;
grant execute on function public.get_profiles_coeurs(uuid[]) to authenticated;
