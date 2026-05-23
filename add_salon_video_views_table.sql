-- Vidéo salon vue une seule fois par maman (par message).
create table if not exists public.salon_video_views (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.salon_messages(id) on delete cascade,
  viewer_user_id uuid not null references auth.users(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  unique (message_id, viewer_user_id)
);

alter table public.salon_video_views enable row level security;

-- Une maman voit uniquement ses propres traces de vue.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'salon_video_views'
      and policyname = 'salon_video_views_select_own'
  ) then
    create policy "salon_video_views_select_own"
    on public.salon_video_views
    for select
    to authenticated
    using (auth.uid() = viewer_user_id);
  end if;
end $$;

-- Une maman peut enregistrer sa propre vue.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'salon_video_views'
      and policyname = 'salon_video_views_insert_own'
  ) then
    create policy "salon_video_views_insert_own"
    on public.salon_video_views
    for insert
    to authenticated
    with check (auth.uid() = viewer_user_id);
  end if;
end $$;

create index if not exists idx_salon_video_views_viewer_message
on public.salon_video_views (viewer_user_id, message_id);
