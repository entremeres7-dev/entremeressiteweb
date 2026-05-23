export type GamificationAction =
  | 'sos_reply'
  | 'sos_reply_received'
  | 'sos_publish'
  | 'sos_poll_vote'
  | 'share_app'
  | 'store_review'
  | 'friend_added';

export const GAMIFICATION_POINTS: Record<GamificationAction, number> = {
  sos_reply: 10,
  sos_reply_received: 2,
  sos_publish: 5,
  sos_poll_vote: 3,
  share_app: 10,
  store_review: 50,
  friend_added: 10,
};

export type GamificationTier = {
  level: number;
  title: string;
  emoji: string;
  min: number;
  /** Points max exclusifs du palier suivant ; null = palier max */
  max: number | null;
};

/** 4 paliers — progression simplifiée */
export const GAMIFICATION_TIERS: GamificationTier[] = [
  { level: 1, title: 'Nouvelle maman', emoji: '🌱', min: 0, max: 100 },
  { level: 2, title: 'Maman active', emoji: '🌸', min: 100, max: 500 },
  { level: 3, title: 'Maman pilier', emoji: '👑', min: 500, max: 1500 },
  { level: 4, title: 'Ambassadrice EntreMeres', emoji: '💎', min: 1500, max: null },
];

export const GAMIFICATION_ACTION_LABELS: Record<GamificationAction, string> = {
  sos_reply: 'Réponse SOS Maman',
  sos_reply_received: 'Réponse reçue sur votre SOS',
  sos_publish: 'Publication SOS Maman',
  sos_poll_vote: 'Participation à un sondage',
  share_app: 'Partage EntreMeres',
  store_review: 'Avis sur l’App Store',
  friend_added: 'Maman ajoutée',
};
