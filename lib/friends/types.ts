export type FriendRelationKind = 'accepted' | 'pending_received' | 'pending_sent';

export type FriendListItem = {
  friendshipId: string;
  peerId: string;
  name: string;
  photo: string | null;
  kind: FriendRelationKind;
  created_at: string;
};

export type FriendsLists = {
  accepted: FriendListItem[];
  received: FriendListItem[];
  sent: FriendListItem[];
};
