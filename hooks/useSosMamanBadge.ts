import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchSosMamanBadgeCount } from '@/lib/sos-maman/sosMamanService';
import { supabase } from '@/supabaseClient';
import { globalEvents, EVENT_TYPES } from '@/events';

export function useSosMamanBadge() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setCount(0);
      return;
    }
    try {
      const n = await fetchSosMamanBadgeCount(user.id);
      setCount(n);
    } catch {
      setCount(0);
    }
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handler = () => refresh();
    globalEvents.on(EVENT_TYPES.SOS_MAMAN_BADGE_REFRESH, handler);
    return () => globalEvents.off(EVENT_TYPES.SOS_MAMAN_BADGE_REFRESH, handler);
  }, [refresh]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`sos-maman-badge-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sos_maman_posts' },
        (payload) => {
          const authorId = (payload.new as { user_id?: string })?.user_id;
          if (authorId && authorId !== user.id) refresh();
        },
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sos_maman_replies' },
        (payload) => {
          const authorId = (payload.new as { user_id?: string })?.user_id;
          if (authorId && authorId !== user.id) refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refresh]);

  return { count, refresh };
}
