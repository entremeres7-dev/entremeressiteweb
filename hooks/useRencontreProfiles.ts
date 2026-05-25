import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/supabaseClient';
import {
  fetchRencontreMamansPage,
  RENCONTRE_PAGE_SIZE,
} from '@/lib/rencontres/fetchRencontreProfiles';
import { searchMamansByUsernamePage } from '@/lib/rencontres/fetchMamanProfile';
import type { MamanRencontre, RencontreLocationFilter } from '@/lib/rencontres/types';

/** Mamans inscrites depuis moins de N jours = onglet « Récentes » */
export const NEW_MEMBER_DAYS = 30;

export { RENCONTRE_PAGE_SIZE as PAGE_SIZE };

function appendUniqueMamans(prev: MamanRencontre[], next: MamanRencontre[]): MamanRencontre[] {
  if (next.length === 0) return prev;
  const seen = new Set(prev.map((m) => m.id));
  const merged = [...prev];
  for (const m of next) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);
    merged.push(m);
  }
  return merged;
}

export function useRencontreProfiles({
  timeFilter,
  country,
  adminRegionLabel,
  usernameQuery = '',
}: RencontreLocationFilter) {
  const [mamans, setMamans] = useState<MamanRencontre[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const offsetRef = useRef(0);
  const trimmedSearch = usernameQuery.trim();
  const isSearching = trimmedSearch.length >= 2;

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      offsetRef.current = 0;

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData.session?.user?.id ?? null;

        const page = isSearching
          ? await searchMamansByUsernamePage(trimmedSearch, currentUserId, 0, RENCONTRE_PAGE_SIZE)
          : await fetchRencontreMamansPage({
              timeFilter,
              country,
              adminRegionLabel,
              excludeUserId: currentUserId,
              newMemberDays: NEW_MEMBER_DAYS,
              offset: 0,
            });

        setMamans(page.mamans);
        setHasMore(page.hasMore);
        offsetRef.current = page.mamans.length;
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Impossible de charger les profils.';
        setError(message);
        setMamans([]);
        setHasMore(false);
        offsetRef.current = 0;
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [timeFilter, country, adminRegionLabel, isSearching, trimmedSearch],
  );

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || refreshing || !hasMore) return;

    setLoadingMore(true);
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData.session?.user?.id ?? null;
      const offset = offsetRef.current;

      const page = isSearching
        ? await searchMamansByUsernamePage(trimmedSearch, currentUserId, offset, RENCONTRE_PAGE_SIZE)
        : await fetchRencontreMamansPage({
            timeFilter,
            country,
            adminRegionLabel,
            excludeUserId: currentUserId,
            newMemberDays: NEW_MEMBER_DAYS,
            offset,
          });

      setMamans((prev) => appendUniqueMamans(prev, page.mamans));
      setHasMore(page.hasMore);
      offsetRef.current = offset + page.mamans.length;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Impossible de charger plus de profils.';
      setError(message);
    } finally {
      setLoadingMore(false);
    }
  }, [
    loading,
    loadingMore,
    refreshing,
    hasMore,
    isSearching,
    trimmedSearch,
    timeFilter,
    country,
    adminRegionLabel,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    mamans,
    loading,
    loadingMore,
    refreshing,
    error,
    isSearching,
    hasMore,
    refresh: () => load(true),
    loadMore,
  };
}
