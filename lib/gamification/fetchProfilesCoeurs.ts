import { supabase } from '@/supabaseClient';

export function parseCoeurs(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, value);
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    if (Number.isFinite(n)) return Math.max(0, n);
  }
  return 0;
}

/** Cœurs de plusieurs profils (RPC security definer, ou repli select). */
export async function fetchCoeursMap(userIds: string[]): Promise<Map<string, number>> {
  const unique = Array.from(new Set(userIds.filter(Boolean)));
  if (!unique.length) return new Map();

  const { data, error } = await supabase.rpc('get_profiles_coeurs', {
    p_user_ids: unique,
  });

  if (!error && Array.isArray(data)) {
    return new Map(
      data.map((row: { user_id: string; coeurs: unknown }) => [
        row.user_id,
        parseCoeurs(row.coeurs),
      ]),
    );
  }

  const { data: rows } = await supabase.from('profiles').select('id, coeurs').in('id', unique);

  return new Map((rows ?? []).map((r) => [r.id, parseCoeurs(r.coeurs)]));
}
