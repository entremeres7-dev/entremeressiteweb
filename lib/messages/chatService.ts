import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/supabaseClient';
import { pushNotifyNewMessage } from '@/lib/notifications/pushNotify';

export type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  text: string | null;
  created_at: string;
  read: boolean;
  message_type: string | null;
};

export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

export async function findConversationId(
  userId: string,
  peerId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from('messages')
    .select('conversation_id')
    .or(
      `and(sender_id.eq.${userId},receiver_id.eq.${peerId}),and(sender_id.eq.${peerId},receiver_id.eq.${userId})`,
    )
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.conversation_id ?? null;
}

export async function getOrCreateConversationId(
  userId: string,
  peerId: string,
): Promise<string> {
  const existing = await findConversationId(userId, peerId);
  return existing ?? uuidv4();
}

export async function fetchMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_id, receiver_id, text, created_at, read, message_type')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data as ChatMessage[]) ?? [];
}

export async function sendTextMessage(params: {
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
}): Promise<ChatMessage> {
  const trimmed = params.text.trim();
  if (!trimmed) throw new Error('Message vide');

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: params.conversationId,
      sender_id: params.senderId,
      receiver_id: params.receiverId,
      text: trimmed,
      message_type: 'TEXT',
      read: false,
    })
    .select('id, conversation_id, sender_id, receiver_id, text, created_at, read, message_type')
    .single();

  if (error) throw error;
  const message = data as ChatMessage;

  void pushNotifyNewMessage(
    params.receiverId,
    params.senderId,
    params.conversationId,
    trimmed,
  );

  return message;
}

export async function markMessagesAsRead(
  conversationId: string,
  currentUserId: string,
): Promise<void> {
  await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .eq('receiver_id', currentUserId)
    .eq('read', false);
}

/** Nombre total de messages non lus reçus — pour le badge profil. */
export async function fetchUnreadMessagesCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('read', false);

  if (error) throw error;
  return count ?? 0;
}
