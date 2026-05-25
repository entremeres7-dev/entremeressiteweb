import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { useSosMamanBadge } from '@/hooks/useSosMamanBadge';
import {
  APP_TAB_HREFS,
  APP_TAB_LABELS,
  isAppTabFocused,
  VISIBLE_TABS,
  type AppTabName,
} from '@/lib/navigation/appTabs';

const WEB_LOGO = require('@/assets/images/logo2.png');

function createStyles(c: AppColors) {
  return StyleSheet.create({
    shell: {
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      backgroundColor: c.bg,
      zIndex: 9999,
    },
    inner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      maxWidth: 1120,
      width: '100%',
      alignSelf: 'center',
      paddingHorizontal: 24,
      paddingVertical: 12,
      minHeight: 56,
    },
    brand: {
      flexShrink: 0,
    },
    brandLogo: {
      height: 40,
      width: 200,
    },
    navScroll: {
      flexGrow: 1,
      flexShrink: 1,
    },
    navRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 4,
    },
    navItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
    },
    navItemActive: {
      backgroundColor: c.pinkSoft,
    },
    navLabel: {
      fontSize: 14,
      fontWeight: '600',
    },
    navLabelActive: {
      color: c.text,
    },
    navLabelInactive: {
      color: c.textMuted,
    },
    badge: {
      marginLeft: 2,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: c.pink,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    badgeText: {
      color: c.onPink,
      fontSize: 10,
      fontWeight: '800',
    },
    siteLink: {
      flexShrink: 0,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    siteLinkText: {
      fontSize: 13,
      fontWeight: '600',
      color: c.textMuted,
    },
  });
}

export function WebTopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { count: sosBadge, refresh: refreshSosBadge } = useSosMamanBadge();

  useEffect(() => {
    refreshSosBadge();
  }, [pathname, refreshSosBadge]);

  const goToTab = (tabName: AppTabName) => {
    const href = APP_TAB_HREFS[tabName];
    if (!isAppTabFocused(pathname, tabName, href)) {
      router.replace(href as never);
    }
  };

  return (
    <View style={[styles.shell, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        <TouchableOpacity
          style={styles.brand}
          onPress={() => goToTab('accueil')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="EntreMeres TV — Accueil"
        >
          <Image
            source={WEB_LOGO}
            style={styles.brandLogo}
            contentFit="contain"
            accessibilityLabel="EntreMeres TV"
          />
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.navScroll}
          contentContainerStyle={styles.navRow}
        >
          {VISIBLE_TABS.map((tabName) => {
            const href = APP_TAB_HREFS[tabName];
            const focused = isAppTabFocused(pathname, tabName, href);
            const label = APP_TAB_LABELS[tabName];
            const showBadge = tabName === 'sos-maman' && sosBadge > 0;

            return (
              <TouchableOpacity
                key={tabName}
                style={[
                  styles.navItem,
                  focused && styles.navItemActive,
                  Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : null,
                ]}
                onPress={() => goToTab(tabName)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={label}
              >
                <Text
                  style={[
                    styles.navLabel,
                    focused ? styles.navLabelActive : styles.navLabelInactive,
                  ]}
                >
                  {label}
                </Text>
                {showBadge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{sosBadge > 9 ? '9+' : `+${sosBadge}`}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          style={styles.siteLink}
          activeOpacity={0.85}
          accessibilityRole="link"
          accessibilityLabel="Retour au site"
          onPress={() => {
            if (Platform.OS === 'web' && typeof window !== 'undefined') {
              window.location.assign('/');
            }
          }}
        >
          <Ionicons name="open-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
