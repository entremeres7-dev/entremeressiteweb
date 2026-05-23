import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_CHARTER_ACCEPTED = 'community_charter_accepted_v1';
const KEY_CHARTER_ACCEPTED_AT = 'community_charter_accepted_at_v1';

export async function hasAcceptedCommunityCharter(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEY_CHARTER_ACCEPTED);
  return v === '1';
}

export async function markCommunityCharterAccepted(): Promise<void> {
  await AsyncStorage.setItem(KEY_CHARTER_ACCEPTED, '1');
  await AsyncStorage.setItem(KEY_CHARTER_ACCEPTED_AT, new Date().toISOString());
}
