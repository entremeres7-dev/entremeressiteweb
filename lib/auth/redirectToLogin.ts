import { Platform } from 'react-native';
import { router } from 'expo-router';
import { redirectToWebsiteLogin } from '@/lib/web/websiteAuth';

/** Redirige vers la page de connexion (web statique ou route /login). */
export function redirectToLogin(): void {
  if (Platform.OS === 'web') {
    redirectToWebsiteLogin();
    return;
  }
  router.replace('/login');
}
