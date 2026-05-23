-- Gamification EntreMeres : Cœurs + journal d'événements (idempotent)
-- Exécuter dans Supabase SQL Editor

alter table public.profiles
  add column if not exists coeurs int not null default 0 check (coeurs >= 0);

create table if not exists public.gamification_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  action_type text not null,
  reference_id text not null,
  points int not null check (points > 0),
  created_at timestamptz not null default now(),
  unique (user_id, action_type, reference_id)
);

create index if not exists idx_gamification_events_user on public.gamification_events (user_id, created_at desc);

alter table public.gamification_events enable row level security;

drop policy if exists "gamification events read own" on public.gamification_events;
create policy "gamification events read own" on public.gamification_events
  for select using (auth.uid() = user_id);

-- Attribution atomique (évite les doublons)
create or replace function public.award_coeurs(
  p_user_id uuid,
  p_action_type text,
  p_reference_id text,
  p_points int
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rows int;
  v_total int;
begin
  if p_user_id is null or p_points is null or p_points <= 0 then
    return jsonb_build_object('awarded', false, 'total', 0);
  end if;

  insert into public.gamification_events (user_id, action_type, reference_id, points)
  values (p_user_id, p_action_type, p_reference_id, p_points)
  on conflict (user_id, action_type, reference_id) do nothing;

  get diagnostics v_rows = row_count;

  if v_rows > 0 then
    update public.profiles
    set coeurs = coalesce(coeurs, 0) + p_points
    where id = p_user_id
    returning coeurs into v_total;
  else
    select coalesce(coeurs, 0) into v_total from public.profiles where id = p_user_id;
  end if;

  return jsonb_build_object(
    'awarded', v_rows > 0,
    'total', coalesce(v_total, 0)
  );
end;
$$;

grant execute on function public.award_coeurs(uuid, text, text, int) to authenticated;
