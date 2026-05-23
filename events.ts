type EventCallback<T = any> = (data: T) => void;

interface EventListeners {
  [eventName: string]: EventCallback[];
}

const listeners: EventListeners = {};

export const globalEvents = {
  on<T = any>(eventName: string, callback: EventCallback<T>) {
    if (!listeners[eventName]) {
      listeners[eventName] = [];
    }
    listeners[eventName].push(callback);
  },
  
  off<T = any>(eventName: string, callback: EventCallback<T>) {
    if (listeners[eventName]) {
      const index = listeners[eventName].indexOf(callback);
      if (index !== -1) {
        listeners[eventName].splice(index, 1);
      }
    }
  },
  
  emit<T = any>(eventName: string, data?: T) {
    if (listeners[eventName]) {
      listeners[eventName].forEach(callback => callback(data));
    }
  }
};

// Types d'événements pour la compatibilité
export const EVENT_TYPES = {
  PROFILE_UPDATED: 'profile_updated',
  POST_CREATED: 'post_created',
  POST_DELETED: 'post_deleted',
  STORY_CREATED: 'story_created',
  STORY_DELETED: 'story_deleted',
  FRIEND_REQUEST_SENT: 'friend_request_sent',
  FRIEND_REQUEST_ACCEPTED: 'friend_request_accepted',
  USER_BLOCKED: 'user_blocked',
  USER_UNBLOCKED: 'user_unblocked',
  REFRESH_FEED: 'refresh_feed',
  REFRESH_PROFILE: 'refresh_profile',
  REFRESH_DISCOVERY: 'refresh_discovery',
  /** Après lecture réponse SOS ou retour profil — recharger le badge bulle SOS Maman */
  SOS_MAMAN_BADGE_REFRESH: 'sos_maman_badge_refresh',
  /** Nouveau message reçu ou conversation lue — badge « Mes messages » profil */
  MESSAGES_BADGE_REFRESH: 'messages_badge_refresh',
  GAMIFICATION_UPDATED: 'gamification_updated',
} as const; 