import { useWindowDimensions, Platform } from 'react-native';

export const TABLET_BREAKPOINT = 768;
export const DESKTOP_BREAKPOINT = 900;
export const WIDE_BREAKPOINT = 1200;
export const CONTENT_MAX_WIDTH = 1120;
export const CONTENT_NARROW_MAX_WIDTH = 820;

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;
  const isWide = width >= DESKTOP_BREAKPOINT;
  const isDesktop = width >= WIDE_BREAKPOINT;
  const isWebDesktop = Platform.OS === 'web' && width >= TABLET_BREAKPOINT;
  /** Même page Rencontres partout (web + app mobile). */
  const useDesktopRencontreLayout = true;
  const useDesktopAppLayout = useDesktopRencontreLayout;
  const contentMaxWidth = isDesktop
    ? CONTENT_MAX_WIDTH
    : isWide
      ? CONTENT_NARROW_MAX_WIDTH
      : width;
  const horizontalPadding = isWide ? 32 : 16;
  const gridColumns = isDesktop ? 4 : isWide ? 3 : 2;
  const cardGap = isWide ? 16 : 12;
  const shellWidth = Math.min(width, contentMaxWidth);
  const cardWidth =
    (shellWidth - horizontalPadding * 2 - cardGap * (gridColumns - 1)) / gridColumns;

  return {
    width,
    height,
    isTablet,
    isWide,
    isDesktop,
    isWebDesktop,
    useDesktopRencontreLayout,
    useDesktopAppLayout,
    contentMaxWidth,
    horizontalPadding,
    gridColumns,
    cardGap,
    cardWidth,
    shellWidth,
  };
}
