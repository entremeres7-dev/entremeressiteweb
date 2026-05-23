import { Platform } from 'react-native';

/** URL de connexion du site statique (même domaine que l'export web /app/). */
export function getWebsiteLoginUrl(returnPath?: string): string {
  if (typeof window === 'undefined') return '/login.html';

  const path =
    returnPath ||
    `${window.location.pathname}${window.location.search}${window.location.hash}`;

  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `/login.html?redirect=${encodeURIComponent(normalized || 'app/')}`;
}

export function redirectToWebsiteLogin(returnPath?: string): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  window.location.replace(getWebsiteLoginUrl(returnPath));
}
