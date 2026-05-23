import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeMode } from '@/constants/themes';

const KEY_PUSH = 'settings_push_enabled';
const KEY_THEME = 'settings_theme_mode';
const KEY_SOS = 'settings_sos_notifications';
const KEY_MESSAGES = 'settings_messages_notifications';

export async function getPushEnabled(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEY_PUSH);
  return v !== 'false';
}

export async function setPushEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(KEY_PUSH, enabled ? 'true' : 'false');
}

export async function getSosNotificationsEnabled(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEY_SOS);
  return v !== 'false';
}

export async function setSosNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(KEY_SOS, enabled ? 'true' : 'false');
}

export async function getMessagesNotificationsEnabled(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEY_MESSAGES);
  return v !== 'false';
}

export async function setMessagesNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(KEY_MESSAGES, enabled ? 'true' : 'false');
}

export async function getThemeMode(): Promise<ThemeMode | null> {
  const v = await AsyncStorage.getItem(KEY_THEME);
  if (v === 'light' || v === 'dark') return v;
  return null;
}

export async function setThemeMode(mode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(KEY_THEME, mode);
}
