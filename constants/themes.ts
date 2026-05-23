export type ThemeMode = 'dark' | 'light';

/** Fond principal mode jour — pour détecter le thème clair */
export const LIGHT_THEME_BG = '#EDE6E1';

export type AppColors = {
  bg: string;
  /** Zone légèrement surélevée (listes, chips inactifs) */
  surface: string;
  card: string;
  pink: string;
  pinkDark: string;
  /** Fond rose très léger (chips actifs, surbrillance) */
  pinkSoft: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  /** Texte / icônes sur fond rose plein */
  onPink: string;
  tabBarBg: string;
  tabBarBorder: string;
  /** Compatibilité progressive */
  white: string;
  gray: string;
  grayLight: string;
  grayDark: string;
};

const dark: AppColors = {
  bg: '#0d0d0d',
  surface: '#1a1a1a',
  card: '#2a2a2a',
  pink: '#ff6a88',
  pinkDark: '#e8607a',
  pinkSoft: 'rgba(255, 106, 136, 0.14)',
  text: '#ffffff',
  textSecondary: '#bbbbbb',
  textMuted: '#888888',
  border: '#3d3d3d',
  onPink: '#ffffff',
  tabBarBg: 'rgba(42, 42, 42, 0.96)',
  tabBarBorder: '#3d3d3d',
  white: '#ffffff',
  gray: '#888888',
  grayLight: '#bbbbbb',
  grayDark: '#333333',
};

/** Mode jour : tons lin / blush, évite le blanc pur */
const light: AppColors = {
  bg: LIGHT_THEME_BG,
  surface: '#F4EEEA',
  card: '#FAF7F4',
  pink: '#E65778',
  pinkDark: '#CC4A68',
  pinkSoft: '#F5E0E8',
  text: '#2D2527',
  textSecondary: '#574B4E',
  textMuted: '#8F8185',
  border: '#D9C9C2',
  onPink: '#ffffff',
  tabBarBg: 'rgba(250, 247, 244, 0.97)',
  tabBarBorder: '#D4C4BC',
  white: '#ffffff',
  gray: '#8F8185',
  grayLight: '#574B4E',
  grayDark: '#E5D6CF',
};

export const THEMES: Record<ThemeMode, AppColors> = {
  dark,
  light,
};

/** @deprecated Utiliser useTheme().colors */
export const TV_COLORS = dark;
