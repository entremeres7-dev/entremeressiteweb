import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/supabaseClient';

const DEVICE_ID_KEY = 'entremeres_push_device_id';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function getOrCreateDeviceId(): Promise<string> {
  const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;
  const id = `${Platform.OS}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

/** Enregistre le token push dans push_devices (après connexion). */
export async function registerPushDevice(userId: string): Promise<void> {
  if (!Device.isDevice) return;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    process.env.EXPO_PUBLIC_PROJECT_ID ??
    '9f24c677-ba0e-4c73-b4c3-a986201b2cec';

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  const token = tokenData.data;
  const deviceId = await getOrCreateDeviceId();

  const row = {
    user_id: userId,
    device_id: deviceId,
    token,
    os: Platform.OS,
    env: 'prod',
    project_id: projectId,
    is_active: true,
    provider: 'expo',
    last_seen: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  let { error } = await supabase.from('push_devices').upsert(row, { onConflict: 'user_id,device_id' });
  if (error?.message?.includes('ux_push_devices_token')) {
    await supabase.from('push_devices').update(row).eq('token', token);
    error = null;
  }

  if (error) console.warn('[Push] enregistrement:', error.message);
}

export async function deactivatePushDevice(userId: string): Promise<void> {
  const deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) return;
  await supabase
    .from('push_devices')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('device_id', deviceId);
}
