import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import type { AppColors } from '@/constants/themes';
import { cardElevation } from '@/constants/themeUtils';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import {
  getLocalNotificationPreferences,
  saveNotificationPreferences,
  syncNotificationPreferencesFromServer,
} from '@/lib/settings/notificationPreferences';
import { deactivatePushDevice, registerPushDevice } from '@/lib/push/registerPushDevice';

const APP_VERSION = Constants.expoConfig?.version ?? '3.0.23';
import { TAB_BAR_CLEARANCE } from '@/constants/tabBarLayout';

function createStyles(c: AppColors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    topTitle: { color: c.text, fontSize: 18, fontWeight: '700' },
    sectionTitle: {
      color: c.pink,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginTop: 20,
      marginBottom: 8,
      marginHorizontal: 20,
    },
    rowWrap: {
      backgroundColor: c.card,
      borderRadius: 12,
      marginHorizontal: 16,
      marginBottom: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      ...cardElevation(c.bg),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      gap: 12,
    },
    rowText: { flex: 1 },
    rowLabel: { color: c.text, fontSize: 16, fontWeight: '500' },
    rowSubtitle: { color: c.textMuted, fontSize: 13, marginTop: 2 },
    logout: { marginTop: 16 },
    logoutText: { color: '#ff6b6b', flex: 1 },
  });
}

function SettingRow({
  icon,
  label,
  subtitle,
  onPress,
  right,
  colors,
  styles,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
}) {
  const content = (
    <View style={styles.row}>
      <Ionicons name={icon} size={22} color={colors.textSecondary} />
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={20} color={colors.textMuted} /> : null)}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.rowWrap} onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }
  return <View style={styles.rowWrap}>{content}</View>;
}

export function ParametresScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, user, signOut } = useAuth();
  const { colors, isLight, toggleLightMode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [pushEnabled, setPushEnabledState] = useState(true);
  const [sosNotif, setSosNotif] = useState(true);
  const [messagesNotif, setMessagesNotif] = useState(true);
  const [friendsNotif, setFriendsNotif] = useState(true);
  const [rencontresNotif, setRencontresNotif] = useState(true);

  const loadPrefs = useCallback(async () => {
    const userId = user?.id;
    const prefs = userId
      ? await syncNotificationPreferencesFromServer(userId).catch(() => getLocalNotificationPreferences())
      : await getLocalNotificationPreferences();
    setPushEnabledState(prefs.pushEnabled);
    setSosNotif(prefs.sosEnabled);
    setMessagesNotif(prefs.messagesEnabled);
    setFriendsNotif(prefs.friendsEnabled);
    setRencontresNotif(prefs.rencontresEnabled);
  }, [user?.id]);

  useEffect(() => {
    loadPrefs();
  }, [loadPrefs]);

  const updatePref = async (
    patch: Partial<{
      pushEnabled: boolean;
      sosEnabled: boolean;
      messagesEnabled: boolean;
      friendsEnabled: boolean;
      rencontresEnabled: boolean;
    }>,
  ) => {
    if (!user?.id) return;
    try {
      const next = await saveNotificationPreferences(user.id, patch);
      if (Object.prototype.hasOwnProperty.call(patch, 'pushEnabled')) {
        if (next.pushEnabled) {
          await registerPushDevice(user.id).catch(() => {});
        } else {
          await deactivatePushDevice(user.id).catch(() => {});
        }
      }
    } catch (e) {
      Alert.alert(
        'Erreur',
        e instanceof Error ? e.message : 'Impossible de sauvegarder vos préférences.',
      );
      loadPrefs();
    }
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

  const openLegal = (title: string, body: string) => {
    Alert.alert(title, body, [{ text: 'OK' }]);
  };

  const contactSupport = () => {
    router.push('/aide-contact');
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Paramètres</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE + insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Compte</Text>
        <SettingRow
          icon="person-outline"
          label={profile?.username ?? 'Mon profil'}
          subtitle={profile?.email ?? undefined}
          colors={colors}
          styles={styles}
        />
        <SettingRow
          icon="chatbubbles-outline"
          label="Mes messages"
          onPress={() => router.push('/(tabs)/messages')}
          colors={colors}
          styles={styles}
        />

        <Text style={styles.sectionTitle}>Apparence</Text>
        <SettingRow
          icon={isLight ? 'sunny' : 'moon-outline'}
          label="Mode jour"
          subtitle={isLight ? 'Interface claire activée' : 'Interface sombre activée'}
          colors={colors}
          styles={styles}
          right={
            <Switch
              value={isLight}
              onValueChange={() => toggleLightMode()}
              trackColor={{ false: colors.border, true: colors.pink }}
            />
          }
        />

        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingRow
          icon="notifications-outline"
          label="Notifications push"
          subtitle="Alertes sur votre téléphone"
          colors={colors}
          styles={styles}
          right={
            <Switch
              value={pushEnabled}
              onValueChange={async (v) => {
                setPushEnabledState(v);
                await updatePref({ pushEnabled: v });
              }}
              trackColor={{ false: colors.border, true: colors.pink }}
            />
          }
        />
        <SettingRow
          icon="heart-outline"
          label="SOS Maman"
          subtitle="Quand quelqu'un répond à votre publication"
          colors={colors}
          styles={styles}
          right={
            <Switch
              value={sosNotif}
              disabled={!pushEnabled}
              onValueChange={async (v) => {
                setSosNotif(v);
                await updatePref({ sosEnabled: v });
              }}
              trackColor={{ false: colors.border, true: colors.pink }}
            />
          }
        />
        <SettingRow
          icon="people-outline"
          label="Rencontres"
          subtitle="Quand une maman vous contacte via Rencontres"
          colors={colors}
          styles={styles}
          right={
            <Switch
              value={rencontresNotif}
              disabled={!pushEnabled}
              onValueChange={async (v) => {
                setRencontresNotif(v);
                await updatePref({ rencontresEnabled: v });
              }}
              trackColor={{ false: colors.border, true: colors.pink }}
            />
          }
        />
        <SettingRow
          icon="mail-outline"
          label="Messages privés"
          subtitle="Nouveaux messages reçus"
          colors={colors}
          styles={styles}
          right={
            <Switch
              value={messagesNotif}
              disabled={!pushEnabled}
              onValueChange={async (v) => {
                setMessagesNotif(v);
                await updatePref({ messagesEnabled: v });
              }}
              trackColor={{ false: colors.border, true: colors.pink }}
            />
          }
        />
        <SettingRow
          icon="person-add-outline"
          label="Demandes d'amitié"
          subtitle="Quand votre demande est acceptée"
          colors={colors}
          styles={styles}
          right={
            <Switch
              value={friendsNotif}
              disabled={!pushEnabled}
              onValueChange={async (v) => {
                setFriendsNotif(v);
                await updatePref({ friendsEnabled: v });
              }}
              trackColor={{ false: colors.border, true: colors.pink }}
            />
          }
        />

        <Text style={styles.sectionTitle}>Application</Text>
        <SettingRow
          icon="help-circle-outline"
          label="Aide et contact"
          onPress={contactSupport}
          colors={colors}
          styles={styles}
        />
        <SettingRow
          icon="document-text-outline"
          label="Consulter les CGU"
          subtitle="Conditions Générales d’Utilisation"
          onPress={() => router.push('/cgu')}
          colors={colors}
          styles={styles}
        />
        <SettingRow
          icon="shield-checkmark-outline"
          label="Confidentialité"
          onPress={() =>
            openLegal(
              'Confidentialité',
              'Vos données sont hébergées de manière sécurisée. Vous pouvez publier anonymement sur SOS Maman. Pour toute demande : contact@entremeres.fr',
            )
          }
          colors={colors}
          styles={styles}
        />
        <SettingRow
          icon="information-circle-outline"
          label="Version"
          subtitle={`EntreMeres ${APP_VERSION}`}
          colors={colors}
          styles={styles}
        />

        <TouchableOpacity style={[styles.rowWrap, styles.logout]} onPress={handleLogout}>
          <View style={styles.row}>
            <Ionicons name="log-out-outline" size={22} color="#ff6b6b" />
            <Text style={[styles.rowLabel, styles.logoutText]}>Se déconnecter</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
