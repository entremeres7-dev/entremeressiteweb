import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AppColors, ThemeMode } from '@/constants/themes';
import { THEMES } from '@/constants/themes';
import { setGlobalColors } from '@/constants/themeStore';
import { getThemeMode, setThemeMode } from '@/lib/settings/userSettings';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: AppColors;
  isLight: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleLightMode: () => Promise<void>;
  ready: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getThemeMode().then((saved) => {
      const initial = saved ?? 'dark';
      setGlobalColors(THEMES[initial]);
      setModeState(initial);
      setReady(true);
    });
  }, []);

  const setMode = useCallback(async (next: ThemeMode) => {
    setGlobalColors(THEMES[next]);
    setModeState(next);
    await setThemeMode(next);
  }, []);

  const toggleLightMode = useCallback(async () => {
    const next: ThemeMode = mode === 'light' ? 'dark' : 'light';
    await setMode(next);
  }, [mode, setMode]);

  const value = useMemo(
    () => ({
      mode,
      colors: THEMES[mode],
      isLight: mode === 'light',
      setMode,
      toggleLightMode,
      ready,
    }),
    [mode, setMode, toggleLightMode, ready],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme doit être utilisé dans ThemeProvider');
  return ctx;
}
