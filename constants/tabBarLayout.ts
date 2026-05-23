import { Platform } from 'react-native';

/** Espace sous le contenu : barre flottante (mobile) vs rien (web avec nav en haut). */
export const TAB_BAR_CLEARANCE = Platform.OS === 'web' ? 24 : 100;

/** Hauteur approximative de la barre de navigation web en haut. */
export const WEB_TOP_NAV_HEIGHT = 64;
