import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/supabaseClient';

/** Compteur léger pour le badge profil — évite de recharger toute la liste. */
export function usePendingFriendsCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setCount(0);
      return;
    }
    const { count: n, error } = await supabase
      .from('friends')
      .select('id', { count: 'exact', head: true })
      .eq('friend_id', user.id)
      .eq('status', 'pending');

    if (!error) setCount(n ?? 0);
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { pendingCount: count, refresh };
}
