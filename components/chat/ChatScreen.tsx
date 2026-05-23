import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { isLightTheme } from '@/constants/themeUtils';
import { TV_COLORS } from '@/constants/tvColors';
import { requestShowAuthPhase } from '@/lib/onboarding/onboardingPhase';
import { useTheme } from '@/context/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/context/AuthContext';
import type { ChatMessage } from '@/lib/messages/chatService';

type Props = {
  peerId: string;
  peerName: string;
  peerPhoto?: string | null;
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function ChatScreen({ peerId, peerName, peerPhoto }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(buildStyles);
  const listRef = useRef<FlatList>(null);
  const [draft, setDraft] = useState('');
  const { session } = useAuth();
  const { userId, messages, loading, sending, error, send, reload } = useChat(peerId);

  const handleSend = useCallback(async () => {
    const text = draft.trim();
    if (!text || sending) return;
    const ok = await send(text);
    if (ok) {
      setDraft('');
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [draft, send, sending]);

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isMine = item.sender_id === userId;
      return (
        <View style={[styles.bubbleRow, isMine ? styles.bubbleRowMine : styles.bubbleRowTheirs]}>
          <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
            <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>{item.text}</Text>
            <Text style={[styles.bubbleTime, isMine && styles.bubbleTimeMine]}>
              {formatTime(item.created_at)}
            </Text>
          </View>
        </View>
      );
    },
    [userId, styles],
  );

  if (loading) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.pink} />
      </View>
    );
  }

  if (!session || error === 'CONNECT_REQUIRED') {
    return (
      <View style={[styles.centered, { paddingTop: insets.top, paddingHorizontal: 32 }]}>
        <Ionicons name="lock-closed-outline" size={48} color={colors.textMuted} />
        <Text style={styles.errorTitle}>Connexion requise</Text>
        <Text style={styles.errorBody}>
          Connectez-vous à votre compte EntreMeres pour envoyer des messages.
        </Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            requestShowAuthPhase();
            router.replace('/');
          }}
        >
          <Text style={styles.backBtnText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        {peerPhoto ? (
          <Image source={{ uri: peerPhoto }} style={styles.headerAvatar} />
        ) : (
          <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder]}>
            <Ionicons name="person" size={18} color={colors.pink} />
          </View>
        )}
        <Text style={styles.headerName} numberOfLines={1}>
          {peerName}
        </Text>
      </View>

      {error && error !== 'CONNECT_REQUIRED' ? (
        <TouchableOpacity style={styles.errorBanner} onPress={reload}>
          <Text style={styles.errorBannerText}>{error} — Appuyez pour réessayer</Text>
        </TouchableOpacity>
      ) : null}

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, messages.length === 0 && styles.listEmpty]}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <Text style={styles.emptyChat}>Envoyez le premier message à {peerName} 💬</Text>
        }
      />

      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TextInput
          style={styles.input}
          placeholder="Votre message…"
          placeholderTextColor={colors.textMuted}
          value={draft}
          onChangeText={setDraft}
          multiline
          maxLength={2000}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!draft.trim() || sending) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!draft.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color={colors.onPink} />
          ) : (
            <Ionicons name="send" size={20} color={colors.onPink} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function buildStyles(c: AppColors) {
  const light = isLightTheme(c.bg);
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.bg,
    },
    centered: {
      flex: 1,
      backgroundColor: c.bg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      gap: 10,
    },
    headerBack: {
      padding: 4,
    },
    headerAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    headerAvatarPlaceholder: {
      backgroundColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerName: {
      flex: 1,
      color: c.text,
      fontSize: 18,
      fontWeight: '700',
    },
    errorBanner: {
      backgroundColor: 'rgba(255,68,88,0.2)',
      padding: 10,
      marginHorizontal: 12,
      marginTop: 8,
      borderRadius: 8,
    },
    errorBannerText: {
      color: '#ff6b6b',
      fontSize: 12,
      textAlign: 'center',
    },
    listContent: {
      padding: 16,
      paddingBottom: 8,
    },
    listEmpty: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    emptyChat: {
      color: c.textMuted,
      textAlign: 'center',
      fontSize: 15,
    },
    bubbleRow: {
      marginBottom: 10,
      maxWidth: '82%',
    },
    bubbleRowMine: {
      alignSelf: 'flex-end',
    },
    bubbleRowTheirs: {
      alignSelf: 'flex-start',
    },
    bubble: {
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    bubbleMine: {
      backgroundColor: c.pink,
      borderBottomRightRadius: 4,
    },
    bubbleTheirs: {
      backgroundColor: light ? c.surface : c.card,
      borderBottomLeftRadius: 4,
      borderWidth: light ? StyleSheet.hairlineWidth : 0,
      borderColor: c.border,
    },
    bubbleText: {
      color: c.text,
      fontSize: 16,
      lineHeight: 22,
    },
    bubbleTextMine: {
      color: c.onPink,
    },
    bubbleTime: {
      color: c.textMuted,
      fontSize: 10,
      marginTop: 4,
      alignSelf: 'flex-end',
    },
    bubbleTimeMine: {
      color: 'rgba(255,255,255,0.75)',
    },
    inputBar: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 12,
      paddingTop: 10,
      gap: 8,
      borderTopWidth: 1,
      borderTopColor: c.border,
      backgroundColor: light ? c.surface : c.card,
    },
    input: {
      flex: 1,
      minHeight: 44,
      maxHeight: 120,
      backgroundColor: light ? c.card : c.bg,
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingVertical: 10,
      color: c.text,
      fontSize: 16,
    },
    sendBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.pink,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendBtnDisabled: {
      opacity: 0.45,
    },
    errorTitle: {
      color: c.text,
      fontSize: 20,
      fontWeight: '700',
      marginTop: 16,
    },
    errorBody: {
      color: c.textMuted,
      textAlign: 'center',
      marginTop: 8,
      lineHeight: 20,
    },
    backBtn: {
      marginTop: 24,
      paddingHorizontal: 24,
      paddingVertical: 12,
      backgroundColor: c.pink,
      borderRadius: 24,
    },
    backBtnText: {
      color: c.onPink,
      fontWeight: '600',
    },
  });
}
