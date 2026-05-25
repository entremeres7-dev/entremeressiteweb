import { supabase } from '@/supabaseClient';

export type PushNotificationType =
  | 'message'
  | 'friend_request'
  | 'friend_accepted'
  | 'rencontre_friend_request'
  | 'sos_maman_reply';

type PushPayload = {
  toUserId: string;
  title: string;
  body: string;
  data: Record<string, string>;
};

async function resolveDisplayName(userId: string): Promise<string> {
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', userId)
    .maybeSingle();
  return data?.username?.trim() || 'Une maman';
}

async function sendPushNotification(payload: PushPayload): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('send-push', { body: payload });
    if (error) console.warn('[push]', error.message);
  } catch (e) {
    console.warn('[push] indisponible:', e);
  }
}

function truncate(text: string, max = 80): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

/** Nouveau message privé reçu. */
export async function pushNotifyNewMessage(
  receiverId: string,
  senderId: string,
  conversationId: string,
  text: string,
): Promise<void> {
  if (receiverId === senderId) return;
  const senderName = await resolveDisplayName(senderId);
  await sendPushNotification({
    toUserId: receiverId,
    title: 'Nouveau message',
    body: `${senderName} : ${truncate(text)}`,
    data: {
      type: 'message',
      senderId,
      peerId: senderId,
      conversationId,
      screen: 'chat',
    },
  });
}

/** Demande d'amitié reçue depuis Rencontres. */
export async function pushNotifyRencontreFriendRequest(
  receiverId: string,
  senderId: string,
  friendshipId: string,
): Promise<void> {
  if (receiverId === senderId) return;
  const senderName = await resolveDisplayName(senderId);
  await sendPushNotification({
    toUserId: receiverId,
    title: 'Rencontres',
    body: `${senderName} souhaite faire votre connaissance`,
    data: {
      type: 'rencontre_friend_request',
      senderId,
      friendshipId,
      screen: 'rencontrer',
    },
  });
}

/** Demande d'amitié reçue (hors Rencontres). */
export async function pushNotifyFriendRequest(
  receiverId: string,
  senderId: string,
  friendshipId: string,
): Promise<void> {
  if (receiverId === senderId) return;
  const senderName = await resolveDisplayName(senderId);
  await sendPushNotification({
    toUserId: receiverId,
    title: 'EntreMeres',
    body: `${senderName} souhaite devenir votre amie`,
    data: {
      type: 'friend_request',
      senderId,
      friendshipId,
      screen: 'mes-mamans',
    },
  });
}

/** Demande d'amitié acceptée. */
export async function pushNotifyFriendAccepted(
  requesterId: string,
  accepterId: string,
): Promise<void> {
  if (requesterId === accepterId) return;
  const accepterName = await resolveDisplayName(accepterId);
  await sendPushNotification({
    toUserId: requesterId,
    title: 'EntreMeres',
    body: `${accepterName} a accepté votre demande d'amitié`,
    data: {
      type: 'friend_accepted',
      senderId: accepterId,
      peerId: accepterId,
      screen: 'mes-mamans',
    },
  });
}

/** Réponse à une publication SOS Maman. */
export async function pushNotifySosMamanReply(
  postAuthorId: string,
  postId: string,
  replierLabel: string,
): Promise<void> {
  await sendPushNotification({
    toUserId: postAuthorId,
    title: 'SOS Maman',
    body: `${replierLabel} a répondu à votre publication SOS`,
    data: {
      type: 'sos_maman_reply',
      postId,
      screen: 'sos-maman',
    },
  });
}
