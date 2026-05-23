import { supabase } from '@/supabaseClient';

export type ConversationPreview = {
  peerId: string;
  peerName: string;
  peerPhoto: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};

type RawMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  text: string | null;
  created_at: string;
  read: boolean;
};

export async function fetchConversations(userId: string): Promise<ConversationPreview[]> {
  const { data: messages, error } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_id, receiver_id, text, created_at, read')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) throw error;
  if (!messages?.length) return [];

  const byPeer = new Map<string, RawMessage[]>();

  for (const msg of messages as RawMessage[]) {
    const peerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
    if (!byPeer.has(peerId)) byPeer.set(peerId, []);
    byPeer.get(peerId)!.push(msg);
  }

  const peerIds = [...byPeer.keys()];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, photo')
    .in('id', peerIds);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, { name: p.username ?? 'Maman', photo: p.photo }]),
  );

  const previews: ConversationPreview[] = [];

  for (const [peerId, msgs] of byPeer) {
    const sorted = [...msgs].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    const latest = sorted[0];
    const prof = profileMap.get(peerId);
    const unreadCount = sorted.filter(
      (m) => m.receiver_id === userId && !m.read,
    ).length;

    previews.push({
      peerId,
      peerName: prof?.name ?? 'Maman',
      peerPhoto: prof?.photo ?? null,
      lastMessage: latest.text?.trim() || 'Message',
      lastMessageAt: latest.created_at,
      unreadCount,
    });
  }

  previews.sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  );

  return previews;
}
