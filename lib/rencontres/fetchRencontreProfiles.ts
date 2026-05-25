import { supabase } from '@/supabaseClient';
import { fetchCoeursMap } from '@/lib/gamification/fetchProfilesCoeurs';
import { applyProfileLocationFilter } from './applyProfileLocationFilter';
import { mapProfileToMaman } from './mapProfile';
import type { MamanRencontre, ProfileRow, RencontreFilter } from './types';

export const PROFILE_SELECT =
  'id, username, age, region, country, photo, bio, status, job, children, created_at, coeurs';

/** Profils chargés par page (liste + « Voir plus »). */
export const RENCONTRE_PAGE_SIZE = 40;

function sinceDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

async function mapRowsToMamans(rows: ProfileRow[]): Promise<MamanRencontre[]> {
  if (rows.length === 0) return [];
  const coeursMap = await fetchCoeursMap(rows.map((r) => r.id));
  return rows
    .map((row) =>
      mapProfileToMaman({
        ...row,
        coeurs: coeursMap.get(row.id) ?? row.coeurs ?? 0,
      }),
    )
    .filter((m): m is MamanRencontre => m !== null);
}

export type FetchRencontrePageParams = {
  timeFilter: RencontreFilter;
  country: string | null;
  adminRegionLabel: string | null;
  excludeUserId: string | null;
  newMemberDays: number;
  offset: number;
  limit?: number;
};

export async function fetchRencontreMamansPage({
  timeFilter,
  country,
  adminRegionLabel,
  excludeUserId,
  newMemberDays,
  offset,
  limit = RENCONTRE_PAGE_SIZE,
}: FetchRencontrePageParams): Promise<{ mamans: MamanRencontre[]; hasMore: boolean }> {
  let query = supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .not('photo', 'is', null)
    .neq('photo', '')
    .eq('is_hidden', false);

  if (timeFilter === 'new') {
    query = query
      .gte('created_at', sinceDaysAgo(newMemberDays))
      .order('created_at', { ascending: false });
  } else {
    query = query.order('updated_at', { ascending: false });
  }

  query = applyProfileLocationFilter(query, { country, adminRegionLabel });

  if (excludeUserId) {
    query = query.neq('id', excludeUserId);
  }

  const { data, error } = await query.range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);

  const rows = (data as ProfileRow[] | null) ?? [];
  const mamans = await mapRowsToMamans(rows);

  return {
    mamans,
    hasMore: rows.length === limit,
  };
}
