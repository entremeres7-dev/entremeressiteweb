-- SOS Maman : photos sur les publications
-- Exécuter dans Supabase SQL Editor après create_sos_maman_tables.sql

alter table public.sos_maman_posts
  add column if not exists image_urls text[] not null default '{}';

-- Texte OU au moins une photo
alter table public.sos_maman_posts drop constraint if exists sos_maman_posts_content_check;
alter table public.sos_maman_posts
  add constraint sos_maman_posts_content_or_media_check
  check (char_length(trim(content)) > 0 or coalesce(array_length(image_urls, 1), 0) > 0);

-- Bucket stockage (public pour affichage dans l'app)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sos-maman-photos',
  'sos-maman-photos',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "sos maman photos public read" on storage.objects;
create policy "sos maman photos public read" on storage.objects
  for select using (bucket_id = 'sos-maman-photos');

drop policy if exists "sos maman photos insert own folder" on storage.objects;
create policy "sos maman photos insert own folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'sos-maman-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "sos maman photos delete own folder" on storage.objects;
create policy "sos maman photos delete own folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'sos-maman-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
