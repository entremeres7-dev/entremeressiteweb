import { supabase } from '@/supabaseClient';
import { fetchCoeursMap } from '@/lib/gamification/fetchProfilesCoeurs';
import { mapProfileToMaman } from './mapProfile';
import { PROFILE_SELECT, RENCONTRE_PAGE_SIZE } from './fetchRencontreProfiles';
import type { MamanRencontre, ProfileRow } from './types';

function escapeIlike(value: string): string {
  return value.replace(/[%_\\]/g, (char) => `\\${char}`);
}

async function mapRowsToMamans(
  rows: ProfileRow[],
  options?: { allowWithoutPhoto?: boolean },
): Promise<MamanRencontre[]> {
  if (rows.length === 0) return [];
  const coeursMap = await fetchCoeursMap(rows.map((r) => r.id));
  return rows
    .map((row) =>
      mapProfileToMaman(
        {
          ...row,
          coeurs: coeursMap.get(row.id) ?? row.coeurs ?? 0,
        },
        options,
      ),
    )
    .filter((m): m is MamanRencontre => m !== null);
}

export async function fetchMamanRencontreByUserId(userId: string): Promise<MamanRencontre | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .eq('id', userId)
    .eq('is_hidden', false)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const mapped = await mapRowsToMamans([data as ProfileRow]);
  return mapped[0] ?? null;
}

export async function searchMamansByUsernamePage(
  query: string,
  excludeUserId: string | null | undefined,
  offset: number,
  limit = RENCONTRE_PAGE_SIZE,
): Promise<{ mamans: MamanRencontre[]; hasMore: boolean }> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return { mamans: [], hasMore: false };

  let request = supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .eq('is_hidden', false)
    .ilike('username', `%${escapeIlike(trimmed)}%`)
    .order('username', { ascending: true })
    .range(offset, offset + limit - 1);

  if (excludeUserId) {
    request = request.neq('id', excludeUserId);
  }

  const { data, error } = await request;
  if (error) throw new Error(error.message);

  const rows = (data as ProfileRow[] | null) ?? [];
  const mamans = await mapRowsToMamans(rows, { allowWithoutPhoto: true });

  return {
    mamans,
    hasMore: rows.length === limit,
  };
}
