-- Permet de choisir si une photo du Salon apparait dans Quotidien.
alter table public.salon_messages
add column if not exists show_in_quotidien boolean not null default true;

-- Optionnel: index partiel pour les requetes Quotidien sur les photos visibles.
create index if not exists idx_salon_messages_quotidien_visible
on public.salon_messages (created_at desc)
where image_url is not null and show_in_quotidien = true;
