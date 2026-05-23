import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { resolveAdminRegionFromLabel } from '@/lib/rencontres/buildLocationOptions';
import {
  getDepartmentDbValuesForAdminRegion,
  isFranceCountry,
} from '@/lib/rencontres/frenchRegions';
import { fetchCoeursMap } from '@/lib/gamification/fetchProfilesCoeurs';
import { mapProfileToMaman } from '@/lib/rencontres/mapProfile';
import type { MamanRencontre, ProfileRow, RencontreLocationFilter } from '@/lib/rencontres/types';

const PAGE_SIZE = 40;
/** Mamans inscrites depuis moins de N jours = onglet « Récentes » */
export const NEW_MEMBER_DAYS = 30;

function sinceDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export function useRencontreProfiles({
  timeFilter,
  country,
  adminRegionLabel,
}: RencontreLocationFilter) {
  const [mamans, setMamans] = useState<MamanRencontre[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData.session?.user?.id;

        let query = supabase
          .from('profiles')
          .select(
            'id, username, age, region, country, photo, bio, status, job, children, created_at, coeurs',
          )
          .not('photo', 'is', null)
          .neq('photo', '')
          .eq('is_hidden', false);

        if (timeFilter === 'new') {
          query = query
            .gte('created_at', sinceDaysAgo(NEW_MEMBER_DAYS))
            .order('created_at', { ascending: false });
        } else {
          query = query.order('updated_at', { ascending: false });
        }

        if (country) {
          query = query.eq('country', country);
        }

        if (adminRegionLabel && (isFranceCountry(country) || !country)) {
          const adminRegion = resolveAdminRegionFromLabel(adminRegionLabel);
          if (adminRegion) {
            const deptValues = getDepartmentDbValuesForAdminRegion(adminRegion);
            if (deptValues.length > 0) {
              query = query.in('region', deptValues);
            }
          }
        }

        query = query.limit(PAGE_SIZE);

        if (currentUserId) {
          query = query.neq('id', currentUserId);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        const rows = (data as ProfileRow[] | null) ?? [];
        const coeursMap = await fetchCoeursMap(rows.map((r) => r.id));
        const mapped = rows
          .map((row) =>
            mapProfileToMaman({
              ...row,
              coeurs: coeursMap.get(row.id) ?? row.coeurs ?? 0,
            }),
          )
          .filter((m): m is MamanRencontre => m !== null);

        setMamans(mapped);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Impossible de charger les profils.';
        setError(message);
        setMamans([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [timeFilter, country, adminRegionLabel],
  );

  useEffect(() => {
    load();
  }, [load]);

  return { mamans, loading, refreshing, error, refresh: () => load(true) };
}
