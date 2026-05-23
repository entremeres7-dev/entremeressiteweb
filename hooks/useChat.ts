import { useCallback, useEffect, useState } from 'react';
import {
  fetchMessages,
  getCurrentUserId,
  getOrCreateConversationId,
  markMessagesAsRead,
  sendTextMessage,
  type ChatMessage,
} from '@/lib/messages/chatService';
import { globalEvents, EVENT_TYPES } from '@/events';

export function useChat(peerId: string) {
  const [userId, setUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const init = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const uid = await getCurrentUserId();
      if (!uid) {
        setError('CONNECT_REQUIRED');
        setUserId(null);
        return;
      }
      setUserId(uid);

      const convId = await getOrCreateConversationId(uid, peerId);
      setConversationId(convId);

      const list = convId ? await fetchMessages(convId) : [];
      setMessages(list);

      if (convId && list.length > 0) {
        await markMessagesAsRead(convId, uid);
        globalEvents.emit(EVENT_TYPES.MESSAGES_BADGE_REFRESH);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [peerId]);

  useEffect(() => {
    init();
  }, [init]);

  const send = useCallback(
    async (text: string) => {
      if (!userId || !conversationId) return false;
      setSending(true);
      try {
        const msg = await sendTextMessage({
          conversationId,
          senderId: userId,
          receiverId: peerId,
          text,
        });
        setMessages((prev) => [...prev, msg]);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Envoi impossible');
        return false;
      } finally {
        setSending(false);
      }
    },
    [userId, conversationId, peerId],
  );

  return {
    userId,
    conversationId,
    messages,
    loading,
    sending,
    error,
    send,
    reload: init,
  };
}
