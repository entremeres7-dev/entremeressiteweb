import React, { useEffect, useMemo } from 'react';
import { View, Pressable, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSosMamanBadge } from '@/hooks/useSosMamanBadge';
import { useTabBarLayout } from '@/hooks/useTabBarLayout';
import {
  APP_TAB_HREFS,
  getAppTabLabel,
  isAppTabFocused,
  VISIBLE_TABS,
  type AppTabName,
} from '@/lib/navigation/appTabs';

const BAR_BG = '#000000';
const ICON_ACTIVE = '#FFFFFF';
const ICON_INACTIVE = 'rgba(255,255,255,0.42)';
const LABEL_ACTIVE = '#FFFFFF';
const LABEL_INACTIVE = 'rgba(255,255,255,0.42)';
const BORDER_TOP = 'rgba(255,255,255,0.1)';

export function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const layout = useTabBarLayout();
  const { count: sosBadge, refresh: refreshSosBadge } = useSosMamanBadge();

  const styles = useMemo(
    () =>
      createStyles({
        barHeight: layout.barHeight,
        labelGap: layout.labelGap,
        tabHorizontalPadding: layout.tabHorizontalPadding,
        tabLabelMaxWidth: layout.tabLabelMaxWidth,
        iconSize: layout.iconSize,
        labelSize: layout.labelSize,
      }),
    [
      layout.barHeight,
      layout.labelGap,
      layout.tabHorizontalPadding,
      layout.tabLabelMaxWidth,
      layout.iconSize,
      layout.labelSize,
    ],
  );

  useEffect(() => {
    refreshSosBadge();
  }, [pathname, refreshSosBadge]);

  if (Platform.OS === 'web') return null;

  const renderIcon = (tabName: AppTabName, focused: boolean, badge?: number) => {
    const color = focused ? ICON_ACTIVE : ICON_INACTIVE;
    const size = layout.iconSize;

    switch (tabName) {
      case 'accueil':
        return <Ionicons name={focused ? 'tv' : 'tv-outline'} size={size} color={color} />;
      case 'sos-maman':
        return (
          <View style={styles.iconWrap}>
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={size} color={color} />
            {badge != null && badge > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText} numberOfLines={1}>
                  {badge > 9 ? '9+' : `+${badge}`}
                </Text>
              </View>
            ) : null}
          </View>
        );
      case 'rencontrer':
        return (
          <MaterialCommunityIcons
            name={focused ? 'account-heart' : 'account-heart-outline'}
            size={size}
            color={color}
          />
        );
      case 'ma-liste':
        return <Ionicons name={focused ? 'bookmark' : 'bookmark-outline'} size={size} color={color} />;
      case 'profil':
        return <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />;
      default:
        return null;
    }
  };

  return (
    <View
      style={[
        styles.outer,
        {
          paddingBottom: layout.bottomInset,
          backgroundColor: BAR_BG,
          borderTopColor: BORDER_TOP,
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.bar}>
        {VISIBLE_TABS.map((tabName) => {
          const href = APP_TAB_HREFS[tabName];
          const isFocused = isAppTabFocused(pathname, tabName, href);
          const label = getAppTabLabel(tabName, layout.isCompact);

          return (
            <Pressable
              key={tabName}
              style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
              onPress={() => {
                if (!isFocused) router.replace(href as never);
              }}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={getAppTabLabel(tabName, false)}
              hitSlop={layout.isCompact ? { top: 4, bottom: 4 } : undefined}
            >
              {renderIcon(tabName, isFocused, tabName === 'sos-maman' ? sosBadge : undefined)}
              {!layout.hideLabels ? (
                <Text
                  style={[styles.label, { color: isFocused ? LABEL_ACTIVE : LABEL_INACTIVE }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.72}
                >
                  {label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles({
  barHeight,
  labelGap,
  tabHorizontalPadding,
  tabLabelMaxWidth,
  iconSize,
  labelSize,
}: {
  barHeight: number;
  labelGap: number;
  tabHorizontalPadding: number;
  tabLabelMaxWidth: number;
  iconSize: number;
  labelSize: number;
}) {
  const badgeOffset = Math.round(iconSize * 0.22);

  return StyleSheet.create({
    outer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderTopWidth: StyleSheet.hairlineWidth,
      zIndex: 9999,
    },
    bar: {
      flexDirection: 'row',
      height: barHeight,
      alignItems: 'center',
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: labelGap,
      minHeight: barHeight,
      paddingHorizontal: tabHorizontalPadding,
    },
    tabPressed: {
      opacity: 0.72,
    },
    iconWrap: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: labelSize,
      fontWeight: '500',
      letterSpacing: 0.1,
      textAlign: 'center',
      maxWidth: tabLabelMaxWidth,
    },
    badge: {
      position: 'absolute',
      top: -badgeOffset,
      right: -badgeOffset * 2.2,
      minWidth: 18,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#ff6a88',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
      borderWidth: 1.5,
      borderColor: BAR_BG,
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 9,
      fontWeight: '800',
    },
  });
}
