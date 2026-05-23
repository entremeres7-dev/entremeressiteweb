import { Platform, type ViewStyle } from 'react-native';
import { LIGHT_THEME_BG } from './themes';

export function isLightTheme(bg: string): boolean {
  return bg === LIGHT_THEME_BG;
}

/** Ombre douce pour cartes en mode jour */
export function cardElevation(bg: string): ViewStyle {
  if (!isLightTheme(bg)) return {};
  return Platform.select({
    ios: {
      shadowColor: '#4A353F',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
    },
    android: { elevation: 2 },
  }) ?? {};
}

/** Ombre barre d'onglets flottante */
export function tabBarShadow(bg: string): ViewStyle {
  if (!isLightTheme(bg)) {
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 12,
    };
  }
  return Platform.select({
    ios: {
      shadowColor: '#6B4F58',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 14,
    },
    android: { elevation: 6 },
  }) ?? {};
}
