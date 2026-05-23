import { useTheme } from '@/context/ThemeContext';

/** À appeler en tête de chaque écran : force le re-render quand le thème change. */
export function useThemeRefresh() {
  useTheme();
}
