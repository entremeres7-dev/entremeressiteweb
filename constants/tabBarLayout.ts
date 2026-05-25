import { Platform } from 'react-native';

/** Hauteur max de la barre (petits écrans → grands téléphones). */
export const TAB_BAR_HEIGHT_MAX = 54;

/** Hauteur de référence. Préférer `useTabBarLayout()` pour du responsive. */
export const TAB_BAR_HEIGHT = TAB_BAR_HEIGHT_MAX;

/** Marge sous le contenu scrollable, en plus de la safe area. */
export const TAB_BAR_CONTENT_GAP = 8;

/** Espace sous le contenu (valeur safe max). Préférer `useTabBarClearance()` dans les écrans. */
export const TAB_BAR_CLEARANCE =
  Platform.OS === 'web' ? 24 : TAB_BAR_HEIGHT_MAX + TAB_BAR_CONTENT_GAP;

/** Hauteur approximative de la barre de navigation web en haut. */
export const WEB_TOP_NAV_HEIGHT = 64;
