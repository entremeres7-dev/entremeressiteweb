import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchUnreadMessagesCount } from '@/lib/messages/chatService';
import { supabase } from '@/supabaseClient';
import { globalEvents, EVENT_TYPES } from '@/events';

/** Compteur léger pour le badge « Mes messages » sur le profil. */
export function useUnreadMessagesCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setCount(0);
      return;
    }
    try {
      const n = await fetchUnreadMessagesCount(user.id);
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
    globalEvents.on(EVENT_TYPES.MESSAGES_BADGE_REFRESH, handler);
    return () => globalEvents.off(EVENT_TYPES.MESSAGES_BADGE_REFRESH, handler);
  }, [refresh]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`messages-unread-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => refresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refresh]);

  return { unreadCount: count, refresh };
}
