import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { cardElevation, isLightTheme } from '@/constants/themeUtils';
import { useTheme } from '@/context/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useAuth } from '@/context/AuthContext';
import { fetchConversations, type ConversationPreview } from '@/lib/messages/conversationsService';
import { formatConversationListDate } from '@/lib/messages/formatMessageDate';

import { TAB_BAR_CLEARANCE } from '@/constants/tabBarLayout';

export function MessagesInboxScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(buildStyles);
  const { user } = useAuth();
  const [conversations, setConversations] = React.useState<ConversationPreview[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = useCallback(async (options?: { isRefresh?: boolean; showLoading?: boolean }) => {
    if (!user?.id) return;
    const isRefresh = options?.isRefresh ?? false;
    const showLoading = options?.showLoading ?? false;

    if (isRefresh) setRefreshing(true);
    else if (showLoading) setLoading(true);
    setError(null);
    try {
      const list = await fetchConversations(user.id);
      setConversations(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      load({ showLoading: true });
    }, [load]),
  );

  useEffect(() => {
    if (!user?.id) return;

    const reload = () => {
      void load();
    };

    const channel = supabase
      .channel(`messages-inbox-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        reload,
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.id}`,
        },
        reload,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, load]);

  const openChat = (conv: ConversationPreview) => {
    router.push({
      pathname: '/chat/[peerId]',
      params: {
        peerId: conv.peerId,
        name: conv.peerName,
        photo: conv.peerPhoto ?? '',
      },
    });
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>Vos conversations avec les mamans</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.pink} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.peerId}
          contentContainerStyle={{
            paddingBottom: TAB_BAR_CLEARANCE + insets.bottom + 16,
            paddingHorizontal: isLightTheme(colors.bg) ? 16 : 0,
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load({ isRefresh: true })}
              tintColor={colors.pink}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>
                {error ?? 'Aucune conversation.\nRencontrez des mamans pour discuter 💬'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.row} onPress={() => openChat(item)} activeOpacity={0.85}>
              {item.peerPhoto ? (
                <Image source={{ uri: item.peerPhoto }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person" size={22} color={colors.pink} />
                </View>
              )}
              <View style={styles.rowBody}>
                <View style={styles.rowTop}>
                  <Text style={styles.rowName} numberOfLines={1}>
                    {item.peerName}
                  </Text>
                  <Text style={styles.rowTime}>{formatConversationListDate(item.lastMessageAt)}</Text>
                </View>
                <Text style={styles.rowPreview} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
              {item.unreadCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.unreadCount}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

function buildStyles(c: AppColors) {
  const light = isLightTheme(c.bg);
  return StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.bg },
  header: { paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { color: c.text, fontSize: 26, fontWeight: '700' },
  headerSubtitle: { color: c.textMuted, fontSize: 14, marginTop: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: light ? 14 : 16,
    paddingVertical: 14,
    gap: 12,
    ...(light
      ? {
          backgroundColor: c.card,
          borderRadius: 14,
          marginBottom: 10,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: c.border,
          ...cardElevation(c.bg),
        }
      : {
          borderBottomWidth: 1,
          borderBottomColor: c.border,
        }),
  },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  avatarPlaceholder: {
    backgroundColor: light ? c.pinkSoft : c.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  rowName: { color: c.text, fontSize: 16, fontWeight: '700', flex: 1 },
  rowTime: { color: c.textMuted, fontSize: 12 },
  rowPreview: { color: c.textSecondary, fontSize: 14, marginTop: 4 },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: c.pink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { color: c.onPink, fontSize: 11, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyText: { color: c.textMuted, textAlign: 'center', marginTop: 12, lineHeight: 22 },
  });
}
