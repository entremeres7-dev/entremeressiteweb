import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { cardElevation } from '@/constants/themeUtils';
import { TV_COLORS } from '@/constants/tvColors';
import { useTheme } from '@/context/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useFriendsLists } from '@/hooks/useFriendsLists';
import type { FriendListItem } from '@/lib/friends/types';

import { TAB_BAR_CLEARANCE } from '@/constants/tabBarLayout';

type Section = { title: string; data: FriendListItem[] };

function MamanRow({
  item,
  onPress,
  actions,
  styles,
}: {
  item: FriendListItem;
  onPress: () => void;
  actions?: React.ReactNode;
  styles: ReturnType<typeof buildStyles>;
}) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.rowMain} onPress={onPress} activeOpacity={0.85}>
        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={22} color={TV_COLORS.pink} />
          </View>
        )}
        <View style={styles.rowText}>
          <Text style={styles.rowName}>{item.name}</Text>
          <Text style={styles.rowMeta}>
            {item.kind === 'accepted'
              ? 'Amie sur EntreMeres'
              : item.kind === 'pending_received'
                ? 'Souhaite vous ajouter'
                : 'Demande envoyée'}
          </Text>
        </View>
        {item.kind === 'accepted' ? (
          <Ionicons name="chevron-forward" size={20} color={TV_COLORS.gray} />
        ) : null}
      </TouchableOpacity>
      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
}

export function MesMamansScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(buildStyles);
  const { lists, initialLoading, refreshing, error, refresh, accept, reject, cancel } = useFriendsLists();

  const sections: Section[] = useMemo(
    () => [
      { title: `Demandes reçues (${lists.received.length})`, data: lists.received },
      { title: `Mes mamans (${lists.accepted.length})`, data: lists.accepted },
      { title: `Demandes envoyées (${lists.sent.length})`, data: lists.sent },
    ],
    [lists.received, lists.accepted, lists.sent],
  );

  const openChat = (item: FriendListItem) => {
    if (item.kind !== 'accepted') return;
    router.push({
      pathname: '/chat/[peerId]',
      params: { peerId: item.peerId, name: item.name, photo: item.photo ?? '' },
    });
  };

  const handleAccept = (item: FriendListItem) => {
    Alert.alert('Accepter', `Ajouter ${item.name} à vos mamans ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Accepter',
        onPress: async () => {
          try {
            await accept(item.friendshipId);
          } catch (e) {
            Alert.alert('Erreur', e instanceof Error ? e.message : 'Impossible');
          }
        },
      },
    ]);
  };

  const handleReject = (item: FriendListItem) => {
    Alert.alert('Refuser', `Ignorer la demande de ${item.name} ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Refuser',
        style: 'destructive',
        onPress: async () => {
          try {
            await reject(item.friendshipId);
          } catch (e) {
            Alert.alert('Erreur', e instanceof Error ? e.message : 'Impossible');
          }
        },
      },
    ]);
  };

  const handleCancel = (item: FriendListItem) => {
    Alert.alert('Annuler', `Retirer votre demande à ${item.name} ?`, [
      { text: 'Non', style: 'cancel' },
      {
        text: 'Annuler la demande',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancel(item.friendshipId);
          } catch (e) {
            Alert.alert('Erreur', e instanceof Error ? e.message : 'Impossible');
          }
        },
      },
    ]);
  };

  const isEmpty =
    !initialLoading &&
    lists.accepted.length === 0 &&
    lists.received.length === 0 &&
    lists.sent.length === 0;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Mes mamans</Text>
        <View style={styles.backBtn} />
      </View>

      <Text style={styles.subtitle}>
        Vos amies et les demandes d'ajout reçues ou envoyées
      </Text>

      {initialLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={TV_COLORS.pink} />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.friendshipId}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{
            paddingBottom: TAB_BAR_CLEARANCE + insets.bottom + 24,
            flexGrow: isEmpty ? 1 : undefined,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={TV_COLORS.pink} />
          }
          ListEmptyComponent={
            isEmpty ? (
              <View style={styles.empty}>
                <Ionicons name="heart-outline" size={48} color={TV_COLORS.gray} />
                <Text style={styles.emptyText}>
                  {error ??
                    'Aucune amie pour le moment.\nDécouvrez des mamans dans Rencontres 💗'}
                </Text>
                <TouchableOpacity
                  style={styles.discoverBtn}
                  onPress={() => router.push('/(tabs)/rencontrer')}
                >
                  <Text style={styles.discoverBtnText}>Découvrir des mamans</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionTitle}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <MamanRow
              item={item}
              styles={styles}
              onPress={() => openChat(item)}
              actions={
                item.kind === 'pending_received' ? (
                  <>
                    <TouchableOpacity style={styles.btnAccept} onPress={() => handleAccept(item)}>
                      <Ionicons name="checkmark" size={20} color={TV_COLORS.white} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnReject} onPress={() => handleReject(item)}>
                      <Ionicons name="close" size={20} color={TV_COLORS.white} />
                    </TouchableOpacity>
                  </>
                ) : item.kind === 'pending_sent' ? (
                  <TouchableOpacity style={styles.btnCancel} onPress={() => handleCancel(item)}>
                    <Text style={styles.btnCancelText}>Annuler</Text>
                  </TouchableOpacity>
                ) : null
              }
            />
          )}
        />
      )}
    </View>
  );
}

function buildStyles(c: AppColors) {
  return StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  topTitle: { color: c.text, fontSize: 18, fontWeight: '700' },
  subtitle: {
    color: c.textMuted,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    color: c.pink,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  row: {
    backgroundColor: c.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.border,
    ...cardElevation(c.bg),
  },
  rowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  avatarPlaceholder: {
    backgroundColor: c.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowName: { color: c.text, fontSize: 16, fontWeight: '600' },
  rowMeta: { color: c.textMuted, fontSize: 12, marginTop: 2 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  btnAccept: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2d6a4f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnReject: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5c2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancel: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: c.border,
  },
  btnCancelText: { color: c.textSecondary, fontSize: 13, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 28 },
  emptyText: { color: c.textMuted, textAlign: 'center', marginTop: 12, lineHeight: 22 },
  discoverBtn: {
    marginTop: 20,
    backgroundColor: c.pink,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  discoverBtnText: { color: c.onPink, fontWeight: '700' },
  });
}
