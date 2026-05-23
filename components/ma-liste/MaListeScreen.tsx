import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { cardElevation } from '@/constants/themeUtils';
import { useTheme } from '@/context/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useMaListe } from '@/hooks/useMaListe';
import type { MaListeItem } from '@/lib/ma-liste/types';
import { alertTvWatchUnavailable } from '@/lib/tv/availability';

import { TAB_BAR_CLEARANCE } from '@/constants/tabBarLayout';

export function MaListeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isLight } = useTheme();
  const styles = useThemedStyles(buildStyles);
  const { items, loading, refreshing, error, localOnly, session, refresh, remove } = useMaListe();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const openItem = useCallback((_item: MaListeItem) => {
    alertTvWatchUnavailable();
  }, []);

  const confirmRemove = useCallback(
    (item: MaListeItem) => {
      Alert.alert('Retirer de Ma liste', `Retirer « ${item.title} » ?`, [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: () => remove(item.id).catch(() => Alert.alert('Erreur', 'Suppression impossible')),
        },
      ]);
    },
    [remove],
  );

  if (!session) {
    return (
      <View style={[styles.screen, styles.centered, { paddingTop: insets.top }]}>
        <StatusBar barStyle={isLight ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />
        <Ionicons name="bookmark-outline" size={48} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>Connectez-vous</Text>
        <Text style={styles.emptyText}>
          Votre liste personnelle est liée à votre compte EntreMeres.
        </Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/login')}>
          <Text style={styles.ctaBtnText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle={isLight ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ma liste</Text>
        <Text style={styles.headerSubtitle}>
          {items.length > 0
            ? `${items.length} contenu${items.length > 1 ? 's' : ''} sauvegardé${items.length > 1 ? 's' : ''}`
            : 'Ajoutez des épisodes depuis Accueil TV'}
        </Text>
      </View>

      {localOnly ? (
        <View style={styles.setupBox}>
          <Ionicons name="construct-outline" size={36} color={colors.pink} />
          <Text style={styles.setupTitle}>Synchronisation cloud</Text>
          <Text style={styles.setupText}>
            Vos ajouts sont enregistrés sur cet appareil. Pour les retrouver sur tous vos
            appareils, exécutez database/create_ma_liste_tables.sql dans Supabase.
          </Text>
        </View>
      ) : null}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.pink} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.pink} />
          }
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: TAB_BAR_CLEARANCE + insets.bottom + 16,
            gap: 12,
            flexGrow: items.length === 0 ? 1 : undefined,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.row, { borderLeftColor: item.color }]}
              onPress={() => openItem(item)}
              onLongPress={() => confirmRemove(item)}
              activeOpacity={0.85}
            >
              <View style={[styles.thumb, { backgroundColor: item.color }]}>
                <Ionicons name="play" size={20} color="#ffffff" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                {item.episode ? <Text style={styles.rowEpisode}>{item.episode}</Text> : null}
              </View>
              <TouchableOpacity
                onPress={() => confirmRemove(item)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="bookmark-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Votre liste est vide</Text>
              <Text style={styles.emptyText}>
                Sur Accueil TV, touchez + MA LISTE ou maintenez un contenu pour l&apos;ajouter.
              </Text>
              <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/(tabs)/accueil')}>
                <Text style={styles.ctaBtnText}>Découvrir Accueil TV</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

function buildStyles(c: AppColors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    centered: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
    header: { paddingHorizontal: 20, paddingVertical: 12, marginBottom: 8 },
    headerTitle: { color: c.text, fontSize: 26, fontWeight: '700' },
    headerSubtitle: { color: c.textMuted, fontSize: 14, marginTop: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.card,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.border,
    ...cardElevation(c.bg),
  },
    thumb: {
      width: 56,
      height: 56,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowText: { flex: 1 },
    rowTitle: { color: c.text, fontSize: 15, fontWeight: '600' },
    rowEpisode: { color: c.textMuted, fontSize: 12, marginTop: 2 },
    emptyWrap: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 28 },
    emptyTitle: { color: c.text, fontSize: 18, fontWeight: '700', marginTop: 12 },
    emptyText: { color: c.textMuted, textAlign: 'center', marginTop: 8, lineHeight: 22 },
    ctaBtn: {
      marginTop: 20,
      backgroundColor: c.pink,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 24,
    },
    ctaBtnText: { color: c.onPink, fontWeight: '700' },
    setupBox: { marginHorizontal: 20, marginBottom: 12, padding: 16, borderRadius: 12, backgroundColor: c.card },
    setupTitle: { color: c.text, fontSize: 16, fontWeight: '700', marginTop: 8 },
    setupText: { color: c.textMuted, fontSize: 13, marginTop: 6, lineHeight: 20 },
    errorText: { color: '#ff6b6b', textAlign: 'center', marginHorizontal: 20, marginBottom: 8 },
  });
}
