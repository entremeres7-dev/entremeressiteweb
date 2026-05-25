import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'entremeres_signup_welcome_pending';

/** Mémoire immédiate : évite la course avec onAuthStateChange. */
let pendingInMemory = false;

export function markSignupWelcomePendingSync(): void {
  pendingInMemory = true;
  void AsyncStorage.setItem(KEY, 'true');
}

export async function markSignupWelcomePending(): Promise<void> {
  markSignupWelcomePendingSync();
}

export async function shouldShowSignupWelcome(): Promise<boolean> {
  if (pendingInMemory) return true;
  return (await AsyncStorage.getItem(KEY)) === 'true';
}

export async function clearSignupWelcomePending(): Promise<void> {
  pendingInMemory = false;
  await AsyncStorage.removeItem(KEY);
}
