import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { cardElevation } from '@/constants/themeUtils';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { usePendingFriendsCount } from '@/hooks/usePendingFriendsCount';
import { useUnreadMessagesCount } from '@/hooks/useUnreadMessagesCount';
import { useGamification } from '@/hooks/useGamification';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { DesktopContent } from '@/components/ui/DesktopContent';
import { GamificationSection } from './GamificationSection';
import { ProfileAvatarRing } from './ProfileAvatarRing';

import { TAB_BAR_CLEARANCE } from '@/constants/tabBarLayout';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type MenuStyles = ReturnType<typeof createStyles>;

function MenuRow({
  icon,
  label,
  colors,
  styles,
  onPress,
  badge,
  badgeTone = 'default',
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  colors: AppColors;
  styles: MenuStyles;
  onPress: () => void;
  badge?: string;
  badgeTone?: 'default' | 'alert';
}) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.menuIconWrap}>
        <Ionicons name={icon} size={24} color={colors.pink} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      {badge ? (
        <View style={badgeTone === 'alert' ? styles.badgeAlert : styles.badge}>
          <Text style={badgeTone === 'alert' ? styles.badgeAlertText : styles.badgeText}>
            {badge}
          </Text>
        </View>
      ) : null}
      <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export function ProfilScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isLight } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { profile, user, signOut, refreshProfile } = useAuth();
  const { pendingCount, refresh: refreshPendingCount } = usePendingFriendsCount();
  const { unreadCount, refresh: refreshUnreadMessages } = useUnreadMessagesCount();
  const { progress, loading: gamificationLoading, notifyUpdated } = useGamification();
  const { isWide } = useResponsiveLayout();
  const [photoFullscreen, setPhotoFullscreen] = useState(false);
  const metaUsername =
    typeof user?.user_metadata?.username === 'string' ? user.user_metadata.username.trim() : '';
  const displayName = profile?.username?.trim() || metaUsername || 'Ma maman';
  const displayPhoto = profile?.photo?.trim() || null;
  const initial = (displayName[0] ?? 'M').toUpperCase();

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
      refreshPendingCount();
      refreshUnreadMessages();
    }, [refreshProfile, refreshPendingCount, refreshUnreadMessages]),
  );

  const openPhoto = () => {
    if (displayPhoto) setPhotoFullscreen(true);
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle={isLight ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: TAB_BAR_CLEARANCE + insets.bottom + 24,
        }}
      >
        <DesktopContent maxWidth={820} flex={false}>
          <View style={[styles.heroBand, isWide && styles.heroBandWide]}>
            <View style={[styles.header, isWide && styles.headerWide]}>
              {!isWide ? <Text style={styles.name}>{displayName}</Text> : null}
              <ProfileAvatarRing
                colors={colors}
                progress={progress}
                loading={gamificationLoading}
                photoUri={displayPhoto}
                initial={initial}
                onPress={displayPhoto ? openPhoto : undefined}
              />
              {isWide ? (
                <View style={styles.headerMeta}>
                  <Text style={styles.nameWide}>{displayName}</Text>
                  <Text style={styles.headerTagline}>Votre espace maman sur EntreMeres</Text>
                  {!gamificationLoading && progress ? (
                    <Text style={styles.headerStat}>
                      {progress.coeurs} cœurs · {progress.tier.title}
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </View>
          </View>

          <View style={[styles.mainGrid, isWide && styles.mainGridWide]}>
            <View style={styles.menuColumn}>
              <Text style={styles.menuSectionTitle}>MON COMPTE</Text>
              <View style={styles.menuCard}>
                <MenuRow
                  icon="settings-outline"
                  label="Paramètres"
                  colors={colors}
                  styles={styles}
                  onPress={() => router.push('/parametres')}
                />
                <View style={styles.menuDivider} />
                <MenuRow
                  icon="chatbubbles-outline"
                  label="Mes messages"
                  colors={colors}
                  styles={styles}
                  onPress={() => router.push('/(tabs)/messages')}
                  badge={
                    unreadCount > 0
                      ? unreadCount > 9
                        ? '9+'
                        : String(unreadCount)
                      : undefined
                  }
                  badgeTone="alert"
                />
                <View style={styles.menuDivider} />
                <MenuRow
                  icon="heart-outline"
                  label="Mes mamans"
                  colors={colors}
                  styles={styles}
                  onPress={() => router.push('/mes-mamans')}
                  badge={
                    pendingCount > 0 ? (pendingCount > 9 ? '9+' : String(pendingCount)) : undefined
                  }
                />
              </View>
            </View>

            {isWide ? (
              <View style={styles.sidePanel}>
                <View style={styles.sideCard}>
                  <Ionicons name="sparkles-outline" size={28} color={colors.pink} />
                  <Text style={styles.sideTitle}>Bienvenue chez vous</Text>
                  <Text style={styles.sideText}>
                    Retrouvez vos messages, vos amies et votre progression depuis cet espace.
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

          <GamificationSection
            colors={colors}
            progress={progress}
            userId={profile?.id ?? null}
            onPointsUpdated={notifyUpdated}
            placement="footer"
          />

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#ff6b6b" />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
        </DesktopContent>
      </ScrollView>

      <Modal
        visible={photoFullscreen}
        transparent
        animationType="fade"
        onRequestClose={() => setPhotoFullscreen(false)}
      >
        <View style={styles.photoModal}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setPhotoFullscreen(false)} />
          {displayPhoto ? (
            <Image
              source={{ uri: displayPhoto }}
              style={styles.photoFullscreen}
              contentFit="contain"
            />
          ) : null}
          <TouchableOpacity
            style={[styles.photoClose, { top: insets.top + 12 }]}
            onPress={() => setPhotoFullscreen(false)}
            accessibilityLabel="Fermer"
          >
            <Ionicons name="close" size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    heroBand: {
      marginBottom: 8,
    },
    heroBandWide: {
      backgroundColor: c.pinkSoft,
      borderRadius: 20,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      marginTop: 16,
      marginBottom: 24,
      ...cardElevation(c.bg),
    },
    header: { alignItems: 'center', paddingVertical: 24 },
    headerWide: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 28,
      paddingVertical: 32,
      paddingHorizontal: 8,
    },
    headerMeta: {
      flex: 1,
      gap: 6,
    },
    name: {
      color: c.text,
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 16,
      textAlign: 'center',
    },
    nameWide: {
      color: c.text,
      fontSize: 32,
      fontWeight: '800',
      letterSpacing: -0.5,
    },
    headerTagline: {
      color: c.textSecondary,
      fontSize: 15,
      lineHeight: 22,
    },
    headerStat: {
      color: c.pink,
      fontSize: 14,
      fontWeight: '700',
      marginTop: 4,
    },
    mainGrid: {
      width: '100%',
    },
    mainGridWide: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 24,
    },
    menuColumn: {
      flex: 1,
    },
    sidePanel: {
      width: 260,
      flexShrink: 0,
    },
    sideCard: {
      backgroundColor: c.card,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      padding: 20,
      gap: 10,
      ...cardElevation(c.bg),
    },
    sideTitle: {
      color: c.text,
      fontSize: 18,
      fontWeight: '800',
    },
    sideText: {
      color: c.textSecondary,
      fontSize: 14,
      lineHeight: 21,
    },
    menuSectionTitle: {
      color: c.text,
      fontSize: 13,
      fontWeight: '800',
      letterSpacing: 0.6,
      marginTop: 8,
      marginBottom: 10,
    },
    menuCard: {
      backgroundColor: c.card,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      overflow: 'hidden',
      ...cardElevation(c.bg),
    },
    menuRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 18,
      paddingHorizontal: 16,
      gap: 14,
    },
    menuIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: c.pinkSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.border,
      marginLeft: 74,
    },
    menuLabel: {
      flex: 1,
      color: c.text,
      fontSize: 17,
      fontWeight: '700',
    },
    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 24,
      paddingVertical: 16,
    },
    logoutText: { color: '#ff6b6b', fontSize: 16, fontWeight: '600' },
    badge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: c.pink,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
    },
    badgeAlert: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#ff3b30',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
    },
    badgeText: { color: c.onPink, fontSize: 11, fontWeight: '800' },
    badgeAlertText: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
    photoModal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.95)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    photoFullscreen: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT * 0.7,
    },
    photoClose: {
      position: 'absolute',
      right: 20,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255,255,255,0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
  });
}
