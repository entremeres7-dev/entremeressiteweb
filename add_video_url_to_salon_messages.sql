-- Ajoute le support vidéo dans les messages du Salon.
alter table public.salon_messages
add column if not exists video_url text;

-- Index partiel utile pour filtrer les médias du salon.
create index if not exists idx_salon_messages_video_created_at
on public.salon_messages (created_at desc)
where video_url is not null;
