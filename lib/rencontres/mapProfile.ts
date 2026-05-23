import { tierEmojiForCoeurs } from '@/lib/gamification/tierDisplayEmoji';
import type { MamanRencontre, ProfileRow } from './types';

const CARD_COLORS = ['#3d2a4a', '#2a3d4a', '#4a3d2a', '#2a4a3d', '#4a2a3d', '#3d4a2a'];

function colorFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % CARD_COLORS.length;
  return CARD_COLORS[hash] ?? CARD_COLORS[0];
}

function buildTags(row: ProfileRow): string[] {
  const tags: string[] = [];
  if (row.status?.trim()) tags.push(row.status.trim());
  if (row.job?.trim()) tags.push(row.job.trim());
  if (row.children?.trim()) tags.push(row.children.trim());
  return tags.slice(0, 3);
}

export function mapProfileToMaman(row: ProfileRow): MamanRencontre | null {
  if (!row.photo?.trim()) return null;

  const name = row.username?.trim() || 'Maman';
  const country = row.country?.trim() || null;
  const region = row.region?.trim() || null;
  const city = [region, country].filter(Boolean).join(', ') || 'France';

  return {
    id: row.id,
    name,
    tierEmoji: tierEmojiForCoeurs(row.coeurs),
    age: row.age ?? null,
    city,
    country,
    region,
    bio: row.bio?.trim() || 'Découvrez son profil sur EntreMeres.',
    tags: buildTags(row),
    photoUrl: row.photo.trim(),
    color: colorFromId(row.id),
    createdAt: row.created_at,
  };
}
