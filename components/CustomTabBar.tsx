import React, { useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { tabBarShadow } from '@/constants/themeUtils';
import { useTheme } from '@/context/ThemeContext';
import { useSosMamanBadge } from '@/hooks/useSosMamanBadge';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import {
  APP_TAB_HREFS,
  APP_TAB_LABELS,
  isAppTabFocused,
  VISIBLE_TABS,
  type AppTabName,
} from '@/lib/navigation/appTabs';

function createStyles(c: AppColors) {
  return StyleSheet.create({
    outer: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 9999,
    },
    container: {
      flexDirection: 'row',
      width: '100%',
      marginHorizontal: 16,
      backgroundColor: c.tabBarBg,
      borderRadius: 28,
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: c.tabBarBorder,
      ...tabBarShadow(c.bg),
    },
    containerWide: {
      maxWidth: 560,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
    },
    label: { fontSize: 8, fontWeight: '600', textAlign: 'center' },
    labelActive: { color: c.text },
    labelInactive: { color: c.textMuted },
    badge: {
      position: 'absolute',
      top: -4,
      right: -10,
      minWidth: 18,
      height: 16,
      borderRadius: 8,
      backgroundColor: c.pink,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    badgeText: { color: c.onPink, fontSize: 9, fontWeight: '800' },
  });
}

export function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 6);
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { isWide } = useResponsiveLayout();
  const { count: sosBadge, refresh: refreshSosBadge } = useSosMamanBadge();

  const active = colors.text;
  const inactive = colors.textMuted;

  useEffect(() => {
    refreshSosBadge();
  }, [pathname, refreshSosBadge]);

  if (Platform.OS === 'web') return null;

  const renderIcon = (tabName: AppTabName, focused: boolean, badge?: number) => {
    switch (tabName) {
      case 'accueil':
        return (
          <Ionicons name={focused ? 'tv' : 'tv-outline'} size={22} color={focused ? active : inactive} />
        );
      case 'sos-maman':
        return (
          <View>
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={22}
              color={focused ? colors.pink : inactive}
            />
            {badge != null && badge > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
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
            size={22}
            color={focused ? active : inactive}
          />
        );
      case 'ma-liste':
        return (
          <Ionicons
            name={focused ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={focused ? active : inactive}
          />
        );
      case 'profil':
        return (
          <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={focused ? active : inactive} />
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={[styles.outer, { bottom: bottomInset }]}
      pointerEvents="box-none"
    >
      <View style={[styles.container, isWide && styles.containerWide]}>
        {VISIBLE_TABS.map((tabName) => {
          const href = APP_TAB_HREFS[tabName];
          const isFocused = isAppTabFocused(pathname, tabName, href);

          return (
            <TouchableOpacity
              key={tabName}
              style={styles.tab}
              onPress={() => {
                if (!isFocused) router.replace(href as never);
              }}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={APP_TAB_LABELS[tabName]}
            >
              {renderIcon(tabName, isFocused, tabName === 'sos-maman' ? sosBadge : undefined)}
              <Text style={[styles.label, isFocused ? styles.labelActive : styles.labelInactive]}>
                {APP_TAB_LABELS[tabName]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
