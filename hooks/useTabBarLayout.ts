import { useMemo } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TAB_BAR_CONTENT_GAP,
  TAB_BAR_HEIGHT_MAX,
} from '@/constants/tabBarLayout';

export type TabBarLayoutMetrics = {
  barHeight: number;
  iconSize: number;
  labelSize: number;
  labelGap: number;
  tabHorizontalPadding: number;
  tabLabelMaxWidth: number;
  bottomInset: number;
  totalHeight: number;
  clearance: number;
  isCompact: boolean;
  isLandscape: boolean;
  hideLabels: boolean;
};

export function computeTabBarLayout(width: number, height: number, safeBottom: number): TabBarLayoutMetrics {
  const isLandscape = width > height;
  const isCompact = width < 360;
  const isLargePhone = width >= 414;
  const tabCount = 5;

  const barHeight = isLandscape
    ? 44
    : isCompact
      ? 48
      : isLargePhone
        ? TAB_BAR_HEIGHT_MAX
        : 52;

  const iconSize = isLandscape ? 22 : isCompact ? 22 : isLargePhone ? 26 : 24;
  const labelSize = isLandscape ? 9 : isCompact ? 9 : isLargePhone ? 11 : 10;
  const labelGap = isCompact || isLandscape ? 2 : 3;
  const tabHorizontalPadding = isCompact ? 1 : 4;
  const tabLabelMaxWidth = Math.floor((width - tabHorizontalPadding * 2) / tabCount) - 2;
  const hideLabels = isLandscape && height < 520;

  const bottomInset = safeBottom;
  const totalHeight = barHeight + bottomInset;
  const clearance = Platform.OS === 'web' ? 24 : barHeight + TAB_BAR_CONTENT_GAP;

  return {
    barHeight,
    iconSize,
    labelSize,
    labelGap,
    tabHorizontalPadding,
    tabLabelMaxWidth,
    bottomInset,
    totalHeight,
    clearance,
    isCompact,
    isLandscape,
    hideLabels,
  };
}

export function useTabBarLayout(): TabBarLayoutMetrics {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(
    () => computeTabBarLayout(width, height, insets.bottom),
    [width, height, insets.bottom],
  );
}

/** Espace à réserver sous le contenu (barre + marge, hors safe area). */
export function useTabBarClearance(): number {
  const { clearance } = useTabBarLayout();
  return clearance;
}
