-- SOS Maman : confidences, questions du quotidien, sondages + réponses
-- À exécuter dans Supabase SQL Editor (une seule fois)

create table if not exists public.sos_maman_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null default '',
  image_urls text[] not null default '{}',
  post_type text not null default 'question' check (post_type in ('confession', 'question', 'poll')),
  is_anonymous boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sos_maman_posts
  add column if not exists post_type text not null default 'question';

alter table public.sos_maman_posts drop constraint if exists sos_maman_posts_post_type_check;
alter table public.sos_maman_posts
  add constraint sos_maman_posts_post_type_check
  check (post_type in ('confession', 'question', 'poll'));

alter table public.sos_maman_posts
  add column if not exists image_urls text[] not null default '{}';

alter table public.sos_maman_posts drop constraint if exists sos_maman_posts_content_check;
alter table public.sos_maman_posts drop constraint if exists sos_maman_posts_content_or_media_check;
alter table public.sos_maman_posts
  add constraint sos_maman_posts_content_or_media_check
  check (char_length(trim(content)) > 0 or coalesce(array_length(image_urls, 1), 0) > 0);

create table if not exists public.sos_maman_poll_options (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.sos_maman_posts (id) on delete cascade,
  label text not null check (char_length(trim(label)) > 0),
  sort_order int not null default 0
);

create table if not exists public.sos_maman_poll_votes (
  post_id uuid not null references public.sos_maman_posts (id) on delete cascade,
  option_id uuid not null references public.sos_maman_poll_options (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create index if not exists idx_sos_poll_options_post on public.sos_maman_poll_options (post_id, sort_order);
create index if not exists idx_sos_poll_votes_post on public.sos_maman_poll_votes (post_id);

create table if not exists public.sos_maman_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.sos_maman_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null check (char_length(trim(content)) > 0),
  is_anonymous boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sos_maman_reads (
  user_id uuid not null references auth.users (id) on delete cascade,
  post_id uuid not null references public.sos_maman_posts (id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create table if not exists public.sos_maman_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users (id) on delete cascade,
  post_id uuid references public.sos_maman_posts (id) on delete set null,
  reply_id uuid references public.sos_maman_replies (id) on delete set null,
  reason text,
  created_at timestamptz not null default now(),
  check (post_id is not null or reply_id is not null)
);

create index if not exists idx_sos_maman_posts_created on public.sos_maman_posts (created_at desc);
create index if not exists idx_sos_maman_replies_post on public.sos_maman_replies (post_id, created_at asc);
create index if not exists idx_sos_maman_reports_created on public.sos_maman_reports (created_at desc);

-- Colonne updated_at sur replies si table existait déjà sans elle
alter table public.sos_maman_replies
  add column if not exists updated_at timestamptz not null default now();

alter table public.sos_maman_posts enable row level security;
alter table public.sos_maman_replies enable row level security;
alter table public.sos_maman_reads enable row level security;
alter table public.sos_maman_reports enable row level security;
alter table public.sos_maman_poll_options enable row level security;
alter table public.sos_maman_poll_votes enable row level security;

drop policy if exists "sos posts read all" on public.sos_maman_posts;
create policy "sos posts read all" on public.sos_maman_posts for select using (true);

drop policy if exists "sos posts insert own" on public.sos_maman_posts;
create policy "sos posts insert own" on public.sos_maman_posts for insert with check (auth.uid() = user_id);

drop policy if exists "sos posts update own" on public.sos_maman_posts;
create policy "sos posts update own" on public.sos_maman_posts for update using (auth.uid() = user_id);

drop policy if exists "sos posts delete own" on public.sos_maman_posts;
create policy "sos posts delete own" on public.sos_maman_posts for delete using (auth.uid() = user_id);

drop policy if exists "sos replies read all" on public.sos_maman_replies;
create policy "sos replies read all" on public.sos_maman_replies for select using (true);

drop policy if exists "sos replies insert own" on public.sos_maman_replies;
create policy "sos replies insert own" on public.sos_maman_replies for insert with check (auth.uid() = user_id);

drop policy if exists "sos replies update own" on public.sos_maman_replies;
create policy "sos replies update own" on public.sos_maman_replies for update using (auth.uid() = user_id);

drop policy if exists "sos replies delete own" on public.sos_maman_replies;
create policy "sos replies delete own" on public.sos_maman_replies for delete using (auth.uid() = user_id);

drop policy if exists "sos reads own" on public.sos_maman_reads;
create policy "sos reads own" on public.sos_maman_reads for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "sos reports insert own" on public.sos_maman_reports;
create policy "sos reports insert own" on public.sos_maman_reports
  for insert with check (auth.uid() = reporter_id);

drop policy if exists "sos poll options read all" on public.sos_maman_poll_options;
create policy "sos poll options read all" on public.sos_maman_poll_options for select using (true);

drop policy if exists "sos poll options insert post owner" on public.sos_maman_poll_options;
create policy "sos poll options insert post owner" on public.sos_maman_poll_options
  for insert with check (
    exists (
      select 1 from public.sos_maman_posts p
      where p.id = post_id and p.user_id = auth.uid()
    )
  );

drop policy if exists "sos poll votes read all" on public.sos_maman_poll_votes;
create policy "sos poll votes read all" on public.sos_maman_poll_votes for select using (true);

drop policy if exists "sos poll votes insert own" on public.sos_maman_poll_votes;
create policy "sos poll votes insert own" on public.sos_maman_poll_votes
  for insert with check (auth.uid() = user_id);

drop policy if exists "sos poll votes update own" on public.sos_maman_poll_votes;
create policy "sos poll votes update own" on public.sos_maman_poll_votes
  for update using (auth.uid() = user_id);

-- Notification in-app à l'auteure du post quand une maman répond
create or replace function public.notify_sos_maman_reply()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  post_author uuid;
  notif_message text := 'Une maman a répondu à votre publication SOS Maman 💗';
begin
  select user_id into post_author from public.sos_maman_posts where id = new.post_id;
  if post_author is null or post_author = new.user_id then
    return new;
  end if;

  insert into public.notifications (user_id, type, message, read)
  values (post_author, 'sos_maman_reply', notif_message, false);

  return new;
exception
  when others then
    -- Ne pas bloquer la réponse si la table notifications a un schéma différent
    return new;
end;
$$;

drop trigger if exists trg_notify_sos_maman_reply on public.sos_maman_replies;
create trigger trg_notify_sos_maman_reply
  after insert on public.sos_maman_replies
  for each row
  execute function public.notify_sos_maman_reply();
