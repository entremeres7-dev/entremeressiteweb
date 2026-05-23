import { useMemo } from 'react';
import type { AppColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';

/** Recrée les styles quand le mode jour/nuit change (couleurs du contexte, pas le proxy). */
export function useThemedStyles<T>(factory: (colors: AppColors) => T): T {
  const { colors } = useTheme();
  return useMemo(() => factory(colors), [colors]);
}
