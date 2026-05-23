import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  addToMaListe,
  fetchMaListe,
  removeFromMaListe,
} from '@/lib/ma-liste/maListeService';
import type { AddToMaListeInput, MaListeItem } from '@/lib/ma-liste/types';

export function useMaListe() {
  const { user, session } = useAuth();
  const [items, setItems] = useState<MaListeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localOnly, setLocalOnly] = useState(false);

  const load = useCallback(
    async (isRefresh = false) => {
      if (!user?.id) {
        setItems([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      setLocalOnly(false);
      try {
        const { items: list, localOnly: isLocal } = await fetchMaListe(user.id);
        setItems(list);
        setLocalOnly(isLocal);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erreur';
        setError(msg);
        setItems([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?.id],
  );

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => load(true), [load]);

  const add = useCallback(
    async (input: AddToMaListeInput) => {
      if (!user?.id) {
        return { ok: false as const, reason: 'login' as const };
      }
      try {
        const { item, alreadySaved } = await addToMaListe(user.id, input);
        setItems((prev) => {
          const without = prev.filter((i) => i.content_key !== item.content_key);
          return [item, ...without];
        });
        return { ok: true as const, alreadySaved };
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Ajout impossible';
        return { ok: false as const, reason: 'error' as const, message: msg };
      }
    },
    [user?.id],
  );

  const remove = useCallback(
    async (itemId: string) => {
      if (!user?.id) return;
      await removeFromMaListe(user.id, itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    },
    [user?.id],
  );

  const isSaved = useCallback(
    (contentKey: string) => items.some((i) => i.content_key === contentKey),
    [items],
  );

  return {
    items,
    loading,
    refreshing,
    error,
    localOnly,
    session,
    refresh,
    add,
    remove,
    isSaved,
  };
}
