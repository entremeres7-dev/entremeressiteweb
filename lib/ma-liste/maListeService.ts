import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/supabaseClient';
import type { AddToMaListeInput, MaListeItem } from './types';

const LOCAL_KEY = (userId: string) => `ma_liste_v1:${userId}`;

function isMissingTableError(message: string) {
  return message.includes('does not exist') || message.includes('schema cache');
}

function rowToItem(row: Record<string, unknown>): MaListeItem {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    content_key: String(row.content_key),
    title: String(row.title),
    episode: row.episode != null ? String(row.episode) : null,
    color: String(row.color ?? '#1a1a1a'),
    watch_show_title: row.watch_show_title != null ? String(row.watch_show_title) : null,
    watch_episode_title: row.watch_episode_title != null ? String(row.watch_episode_title) : null,
    watch_episode_subtitle:
      row.watch_episode_subtitle != null ? String(row.watch_episode_subtitle) : null,
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
}

function inputToRow(userId: string, input: AddToMaListeInput) {
  return {
    user_id: userId,
    content_key: input.contentKey,
    title: input.title.trim(),
    episode: input.episode?.trim() || null,
    color: input.color,
    watch_show_title: input.watchShowTitle ?? null,
    watch_episode_title: input.watchEpisodeTitle ?? null,
    watch_episode_subtitle: input.watchEpisodeSubtitle ?? null,
  };
}

async function loadLocal(userId: string): Promise<MaListeItem[]> {
  const raw = await AsyncStorage.getItem(LOCAL_KEY(userId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as MaListeItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveLocal(userId: string, items: MaListeItem[]): Promise<void> {
  await AsyncStorage.setItem(LOCAL_KEY(userId), JSON.stringify(items));
}

function localItemFromInput(userId: string, input: AddToMaListeInput, existing?: MaListeItem): MaListeItem {
  const now = new Date().toISOString();
  return {
    id: existing?.id ?? `local-${input.contentKey}`,
    user_id: userId,
    content_key: input.contentKey,
    title: input.title.trim(),
    episode: input.episode?.trim() || null,
    color: input.color,
    watch_show_title: input.watchShowTitle ?? null,
    watch_episode_title: input.watchEpisodeTitle ?? null,
    watch_episode_subtitle: input.watchEpisodeSubtitle ?? null,
    created_at: existing?.created_at ?? now,
  };
}

export async function fetchMaListe(
  userId: string,
): Promise<{ items: MaListeItem[]; localOnly: boolean }> {
  const { data, error } = await supabase
    .from('ma_liste_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    if (isMissingTableError(error.message)) {
      return { items: await loadLocal(userId), localOnly: true };
    }
    throw new Error(error.message);
  }

  return {
    items: (data ?? []).map((row) => rowToItem(row as Record<string, unknown>)),
    localOnly: false,
  };
}

async function addToMaListeLocal(
  userId: string,
  input: AddToMaListeInput,
): Promise<{ item: MaListeItem; alreadySaved: boolean }> {
  const list = await loadLocal(userId);
  const found = list.find((i) => i.content_key === input.contentKey);
  if (found) return { item: found, alreadySaved: true };
  const item = localItemFromInput(userId, input);
  await saveLocal(userId, [item, ...list]);
  return { item, alreadySaved: false };
}

export async function addToMaListe(
  userId: string,
  input: AddToMaListeInput,
): Promise<{ item: MaListeItem; alreadySaved: boolean }> {
  const { data: existing, error: existError } = await supabase
    .from('ma_liste_items')
    .select('*')
    .eq('user_id', userId)
    .eq('content_key', input.contentKey)
    .maybeSingle();

  if (existError) {
    if (isMissingTableError(existError.message)) {
      return addToMaListeLocal(userId, input);
    }
    throw new Error(existError.message);
  }

  if (existing) {
    return { item: rowToItem(existing as Record<string, unknown>), alreadySaved: true };
  }

  const { data, error } = await supabase
    .from('ma_liste_items')
    .insert(inputToRow(userId, input))
    .select('*')
    .single();

  if (error) {
    if (isMissingTableError(error.message)) {
      return addToMaListeLocal(userId, input);
    }
    throw new Error(error.message);
  }

  return { item: rowToItem(data as Record<string, unknown>), alreadySaved: false };
}

export async function removeFromMaListe(userId: string, itemId: string): Promise<void> {
  const { error } = await supabase.from('ma_liste_items').delete().eq('id', itemId).eq('user_id', userId);

  if (error) {
    if (isMissingTableError(error.message)) {
      const list = await loadLocal(userId);
      await saveLocal(
        userId,
        list.filter((i) => i.id !== itemId),
      );
      return;
    }
    throw new Error(error.message);
  }
}
