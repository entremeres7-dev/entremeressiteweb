-- Préférences de notifications push (synchronisées app ↔ serveur)
alter table public.profiles
  add column if not exists push_enabled boolean not null default true,
  add column if not exists push_sos_enabled boolean not null default true,
  add column if not exists push_messages_enabled boolean not null default true,
  add column if not exists push_friends_enabled boolean not null default true,
  add column if not exists push_rencontres_enabled boolean not null default true;

comment on column public.profiles.push_enabled is 'Notifications push globales';
comment on column public.profiles.push_sos_enabled is 'Push SOS Maman (réponses à vos publications)';
comment on column public.profiles.push_messages_enabled is 'Push messages privés';
comment on column public.profiles.push_friends_enabled is 'Push acceptations d''amitié';
comment on column public.profiles.push_rencontres_enabled is 'Push demandes reçues via Rencontres';
