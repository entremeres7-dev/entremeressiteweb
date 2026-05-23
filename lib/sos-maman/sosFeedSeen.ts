import AsyncStorage from '@react-native-async-storage/async-storage';

const key = (userId: string) => `sos_feed_last_seen_${userId}`;

export async function getSosFeedLastSeen(userId: string): Promise<string | null> {
  return AsyncStorage.getItem(key(userId));
}

/** Marque le fil SOS comme vu — remet à zéro le compteur de nouveaux SOS. */
export async function markSosFeedSeen(userId: string): Promise<void> {
  await AsyncStorage.setItem(key(userId), new Date().toISOString());
}

/** Première visite : on part de maintenant pour ne pas afficher tout l'historique. */
export async function ensureSosFeedSeenInitialized(userId: string): Promise<void> {
  const existing = await getSosFeedLastSeen(userId);
  if (!existing) await markSosFeedSeen(userId);
}
