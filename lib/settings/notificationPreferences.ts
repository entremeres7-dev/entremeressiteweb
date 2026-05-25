import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/supabaseClient';

const KEY_PUSH = 'settings_push_enabled';
const KEY_SOS = 'settings_sos_notifications';
const KEY_MESSAGES = 'settings_messages_notifications';
const KEY_FRIENDS = 'settings_friends_notifications';
const KEY_RENCONTRES = 'settings_rencontres_notifications';

export type NotificationPreferences = {
  pushEnabled: boolean;
  sosEnabled: boolean;
  messagesEnabled: boolean;
  friendsEnabled: boolean;
  rencontresEnabled: boolean;
};

const DEFAULT_PREFS: NotificationPreferences = {
  pushEnabled: true,
  sosEnabled: true,
  messagesEnabled: true,
  friendsEnabled: true,
  rencontresEnabled: true,
};

function readBool(value: string | null, fallback = true): boolean {
  if (value === null) return fallback;
  return value !== 'false';
}

async function cacheLocally(prefs: NotificationPreferences): Promise<void> {
  await AsyncStorage.multiSet([
    [KEY_PUSH, prefs.pushEnabled ? 'true' : 'false'],
    [KEY_SOS, prefs.sosEnabled ? 'true' : 'false'],
    [KEY_MESSAGES, prefs.messagesEnabled ? 'true' : 'false'],
    [KEY_FRIENDS, prefs.friendsEnabled ? 'true' : 'false'],
    [KEY_RENCONTRES, prefs.rencontresEnabled ? 'true' : 'false'],
  ]);
}

function mapRow(row: Record<string, unknown> | null): NotificationPreferences {
  if (!row) return { ...DEFAULT_PREFS };
  return {
    pushEnabled: row.push_enabled !== false,
    sosEnabled: row.push_sos_enabled !== false,
    messagesEnabled: row.push_messages_enabled !== false,
    friendsEnabled: row.push_friends_enabled !== false,
    rencontresEnabled: row.push_rencontres_enabled !== false,
  };
}

export async function getLocalNotificationPreferences(): Promise<NotificationPreferences> {
  const [[, push], [, sos], [, messages], [, friends], [, rencontres]] = await AsyncStorage.multiGet([
    KEY_PUSH,
    KEY_SOS,
    KEY_MESSAGES,
    KEY_FRIENDS,
    KEY_RENCONTRES,
  ]);
  return {
    pushEnabled: readBool(push),
    sosEnabled: readBool(sos),
    messagesEnabled: readBool(messages),
    friendsEnabled: readBool(friends),
    rencontresEnabled: readBool(rencontres),
  };
}

/** Charge les préférences serveur et met à jour le cache local. */
export async function syncNotificationPreferencesFromServer(
  userId: string,
): Promise<NotificationPreferences> {
  const { data, error } = await supabase
    .from('profiles')
    .select('push_enabled, push_sos_enabled, push_messages_enabled, push_friends_enabled, push_rencontres_enabled')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) {
    return getLocalNotificationPreferences();
  }

  const prefs = mapRow(data as Record<string, unknown>);
  await cacheLocally(prefs);
  return prefs;
}

export async function saveNotificationPreferences(
  userId: string,
  prefs: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
  const current = await getLocalNotificationPreferences();
  const next: NotificationPreferences = { ...current, ...prefs };

  await cacheLocally(next);

  const { error } = await supabase
    .from('profiles')
    .update({
      push_enabled: next.pushEnabled,
      push_sos_enabled: next.sosEnabled,
      push_messages_enabled: next.messagesEnabled,
      push_friends_enabled: next.friendsEnabled,
      push_rencontres_enabled: next.rencontresEnabled,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw new Error(error.message);

  return next;
}
