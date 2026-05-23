import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_CGU_ACCEPTED = 'cgu_accepted_v1';
const KEY_CGU_ACCEPTED_AT = 'cgu_accepted_at_v1';

export async function hasAcceptedCgu(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEY_CGU_ACCEPTED);
  return v === '1';
}

export async function markCguAccepted(): Promise<void> {
  await AsyncStorage.setItem(KEY_CGU_ACCEPTED, '1');
  await AsyncStorage.setItem(KEY_CGU_ACCEPTED_AT, new Date().toISOString());
}
