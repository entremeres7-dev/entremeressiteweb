import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  acceptFriendRequest,
  cancelFriendRequest,
  fetchFriendsLists,
  rejectFriendRequest,
} from '@/lib/friends/friendsService';
import type { FriendsLists } from '@/lib/friends/types';

const EMPTY: FriendsLists = { accepted: [], received: [], sent: [] };

export function useFriendsLists() {
  const { user } = useAuth();
  const [lists, setLists] = useState<FriendsLists>(EMPTY);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (isRefresh = false) => {
      if (!user?.id) return;
      if (isRefresh) setRefreshing(true);
      else setInitialLoading(true);
      setError(null);
      try {
        setLists(await fetchFriendsLists(user.id));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur');
        setLists(EMPTY);
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [user?.id],
  );

  const refresh = useCallback(() => load(true), [load]);

  useEffect(() => {
    load();
  }, [load]);

  const accept = useCallback(
    async (friendshipId: string) => {
      if (!user?.id) return;
      await acceptFriendRequest(friendshipId, user.id);
      await load(true);
    },
    [user?.id, load],
  );

  const reject = useCallback(
    async (friendshipId: string) => {
      if (!user?.id) return;
      await rejectFriendRequest(friendshipId, user.id);
      await load(true);
    },
    [user?.id, load],
  );

  const cancel = useCallback(
    async (friendshipId: string) => {
      if (!user?.id) return;
      await cancelFriendRequest(friendshipId, user.id);
      await load(true);
    },
    [user?.id, load],
  );

  return {
    lists,
    initialLoading,
    refreshing,
    error,
    refresh,
    accept,
    reject,
    cancel,
    pendingCount: lists.received.length,
  };
}
