import { supabase } from '@/supabaseClient';
import { awardFriendAdded } from '@/lib/gamification/gamificationService';
import { globalEvents, EVENT_TYPES } from '@/events';
import {
  pushNotifyFriendAccepted,
  pushNotifyFriendRequest,
  pushNotifyRencontreFriendRequest,
} from '@/lib/notifications/pushNotify';
import type { FriendListItem, FriendsLists, FriendRelationKind } from './types';

type FriendRow = {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  created_at: string;
};

async function profileMap(userIds: string[]) {
  if (!userIds.length) return new Map<string, { name: string; photo: string | null }>();
  const unique = Array.from(new Set(userIds));
  const { data } = await supabase.from('profiles').select('id, username, photo').in('id', unique);
  return new Map(
    (data ?? []).map((p) => [p.id, { name: p.username?.trim() || 'Maman', photo: p.photo }]),
  );
}

function toItem(
  row: FriendRow,
  peerId: string,
  kind: FriendListItem['kind'],
  profiles: Map<string, { name: string; photo: string | null }>,
): FriendListItem {
  const p = profiles.get(peerId);
  return {
    friendshipId: row.id,
    peerId,
    name: p?.name ?? 'Maman',
    photo: p?.photo ?? null,
    kind,
    created_at: row.created_at,
  };
}

export async function fetchFriendsLists(userId: string): Promise<FriendsLists> {
  const { data: rows, error } = await supabase
    .from('friends')
    .select('id, user_id, friend_id, status, created_at')
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const buckets: { row: FriendRow; peerId: string; kind: FriendListItem['kind'] }[] = [];

  for (const row of (rows ?? []) as FriendRow[]) {
    if (row.status === 'accepted') {
      const peerId = row.user_id === userId ? row.friend_id : row.user_id;
      buckets.push({ row, peerId, kind: 'accepted' });
    } else if (row.status === 'pending') {
      if (row.friend_id === userId) {
        buckets.push({ row, peerId: row.user_id, kind: 'pending_received' });
      } else if (row.user_id === userId) {
        buckets.push({ row, peerId: row.friend_id, kind: 'pending_sent' });
      }
    }
  }

  const profiles = await profileMap(buckets.map((b) => b.peerId));

  const accepted: FriendListItem[] = [];
  const received: FriendListItem[] = [];
  const sent: FriendListItem[] = [];

  for (const b of buckets) {
    const item = toItem(b.row, b.peerId, b.kind, profiles);
    if (b.kind === 'accepted') accepted.push(item);
    else if (b.kind === 'pending_received') received.push(item);
    else sent.push(item);
  }

  return { accepted, received, sent };
}

export async function getFriendRelationWith(
  userId: string,
  peerId: string,
): Promise<FriendRelationKind | null> {
  if (userId === peerId) return null;

  const { data: row, error } = await supabase
    .from('friends')
    .select('id, user_id, friend_id, status')
    .or(
      `and(user_id.eq.${userId},friend_id.eq.${peerId}),and(user_id.eq.${peerId},friend_id.eq.${userId})`,
    )
    .maybeSingle();

  if (error) throw error;
  if (!row) return null;
  if (row.status === 'accepted') return 'accepted';
  if (row.status === 'pending') {
    return row.user_id === userId ? 'pending_sent' : 'pending_received';
  }
  return null;
}

export async function sendFriendRequest(
  userId: string,
  friendId: string,
  options?: { fromRencontres?: boolean },
): Promise<void> {
  if (userId === friendId) throw new Error('Vous ne pouvez pas vous ajouter vous-même.');

  const { data: existing } = await supabase
    .from('friends')
    .select('id, status')
    .or(
      `and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`,
    )
    .maybeSingle();

  if (existing) {
    if (existing.status === 'accepted') throw new Error('Vous êtes déjà amies.');
    throw new Error('Une demande existe déjà entre vous.');
  }

  const { data: created, error } = await supabase
    .from('friends')
    .insert({
      user_id: userId,
      friend_id: friendId,
      status: 'pending',
    })
    .select('id')
    .single();
  if (error) throw error;

  if (created?.id) {
    if (options?.fromRencontres) {
      void pushNotifyRencontreFriendRequest(friendId, userId, created.id);
    } else {
      void pushNotifyFriendRequest(friendId, userId, created.id);
    }
  }
}

export async function acceptFriendRequest(friendshipId: string, userId: string): Promise<void> {
  const { data: row, error: fetchError } = await supabase
    .from('friends')
    .select('id, user_id, friend_id')
    .eq('id', friendshipId)
    .eq('friend_id', userId)
    .eq('status', 'pending')
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!row) throw new Error('Demande introuvable.');

  const { error } = await supabase
    .from('friends')
    .update({ status: 'accepted' })
    .eq('id', friendshipId)
    .eq('friend_id', userId)
    .eq('status', 'pending');
  if (error) throw error;

  void pushNotifyFriendAccepted(row.user_id, userId);

  const ref = friendshipId;
  await Promise.all([
    awardFriendAdded(row.user_id, `${ref}_${row.user_id}`),
    awardFriendAdded(row.friend_id, `${ref}_${row.friend_id}`),
  ]);
  globalEvents.emit(EVENT_TYPES.GAMIFICATION_UPDATED);
}

export async function rejectFriendRequest(friendshipId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', friendshipId)
    .eq('friend_id', userId)
    .eq('status', 'pending');
  if (error) throw error;
}

export async function cancelFriendRequest(friendshipId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', friendshipId)
    .eq('user_id', userId)
    .eq('status', 'pending');
  if (error) throw error;
}
