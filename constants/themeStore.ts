import type { AppColors } from './themes';
import { THEMES } from './themes';

let current = THEMES.dark;

export function setGlobalColors(colors: AppColors) {
  current = colors;
}

export function getGlobalColors(): AppColors {
  return current;
}

/** Proxy : les imports TV_COLORS lisent toujours le thème actif */
export const TV_COLORS: AppColors = new Proxy({} as AppColors, {
  get(_target, prop: string) {
    return current[prop as keyof AppColors];
  },
});
