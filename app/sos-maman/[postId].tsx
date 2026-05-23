import React, { useState, useCallback } from 'react';

import {

  View,

  Text,

  StyleSheet,

  ScrollView,

  TextInput,

  TouchableOpacity,

  ActivityIndicator,

  Switch,

  KeyboardAvoidingView,

  Platform,

  Alert,

  Modal,

} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import type { AppColors } from '@/constants/themes';

import { TV_COLORS } from '@/constants/tvColors';

import { useTheme } from '@/context/ThemeContext';

import { useThemedStyles } from '@/hooks/useThemedStyles';

import { useSosMamanThread } from '@/hooks/useSosMaman';

import { showSosContentActions } from '@/components/sos-maman/sosMamanActions';

import { SosPostTypeBadge } from '@/components/sos-maman/SosPostTypeBadge';

import { SosPollBlock } from '@/components/sos-maman/SosPollBlock';
import { SosPostImages } from '@/components/sos-maman/SosPostImages';
import { DisplayNameWithTier } from '@/components/gamification/DisplayNameWithTier';

import type { SosMamanReply } from '@/lib/sos-maman/types';



export default function SosMamanThreadScreen() {

  const { postId } = useLocalSearchParams<{ postId: string }>();

  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { colors } = useTheme();

  const styles = useThemedStyles(buildStyles);

  const {

    post,

    replies,

    loading,

    error,

    reply,

    removeReply,

    editReply,

    removePost,

    editPost,

    reportContent,

    votePoll,

    currentUserId,

  } = useSosMamanThread(postId ?? '');

  const [draft, setDraft] = useState('');

  const [anonymous, setAnonymous] = useState(false);

  const [sending, setSending] = useState(false);

  const [editModal, setEditModal] = useState<{ type: 'post' | 'reply'; id: string; text: string } | null>(

    null,

  );

  const [editDraft, setEditDraft] = useState('');

  const [savingEdit, setSavingEdit] = useState(false);



  const handleReply = async () => {

    const text = draft.trim();

    if (!text) return;

    setSending(true);

    try {

      await reply(text, anonymous);

      setDraft('');

    } catch (e) {

      Alert.alert('Erreur', e instanceof Error ? e.message : 'Envoi impossible');

    } finally {

      setSending(false);

    }

  };



  const handleSaveEdit = async () => {

    const text = editDraft.trim();

    if (!text || !editModal) return;

    setSavingEdit(true);

    try {

      if (editModal.type === 'post') {

        await editPost(text);

      } else {

        await editReply(editModal.id, text);

      }

      setEditModal(null);

    } catch (e) {

      Alert.alert('Erreur', e instanceof Error ? e.message : 'Modification impossible');

    } finally {

      setSavingEdit(false);

    }

  };



  const openPostMenu = useCallback(() => {

    if (!post || !currentUserId) return;

    const isOwner = post.user_id === currentUserId;

    showSosContentActions({

      isOwner,

      onEdit: isOwner

        ? () => {

            setEditModal({ type: 'post', id: post.id, text: post.content });

            setEditDraft(post.content);

          }

        : undefined,

      onDelete: isOwner

        ? async () => {

            try {

              await removePost();

              router.back();

            } catch (e) {

              Alert.alert('Erreur', e instanceof Error ? e.message : 'Suppression impossible');

            }

          }

        : undefined,

      onReport: !isOwner

        ? async () => {

            try {

              await reportContent({ postId: post.id });

              Alert.alert('Merci', 'Votre signalement a été enregistré.');

            } catch (e) {

              Alert.alert('Erreur', e instanceof Error ? e.message : 'Signalement impossible');

            }

          }

        : undefined,

    });

  }, [post, currentUserId, editPost, removePost, reportContent, router]);



  const openReplyMenu = useCallback(

    (r: SosMamanReply) => {

      if (!currentUserId) return;

      const isOwner = r.user_id === currentUserId;

      showSosContentActions({

        isOwner,

        onEdit: isOwner

          ? () => {

              setEditModal({ type: 'reply', id: r.id, text: r.content });

              setEditDraft(r.content);

            }

          : undefined,

        onDelete: isOwner

          ? async () => {

              try {

                await removeReply(r.id);

              } catch (e) {

                Alert.alert('Erreur', e instanceof Error ? e.message : 'Suppression impossible');

              }

            }

          : undefined,

        onReport: !isOwner

          ? async () => {

              try {

                await reportContent({ replyId: r.id });

                Alert.alert('Merci', 'Votre signalement a été enregistré.');

              } catch (e) {

                Alert.alert('Erreur', e instanceof Error ? e.message : 'Signalement impossible');

              }

            }

          : undefined,

      });

    },

    [currentUserId, removeReply, reportContent],

  );



  if (loading || !post) {

    return (

      <View style={[styles.centered, { paddingTop: insets.top }]}>

        <ActivityIndicator color={colors.pink} />

      </View>

    );

  }



  return (

    <KeyboardAvoidingView

      style={[styles.screen, { paddingTop: insets.top }]}

      behavior={Platform.OS === 'ios' ? 'padding' : undefined}

    >

      <View style={styles.header}>

        <TouchableOpacity onPress={() => router.back()}>

          <Ionicons name="arrow-back" size={24} color={colors.text} />

        </TouchableOpacity>

        <Text style={styles.headerTitle}>Réponses des mamans</Text>

        <TouchableOpacity onPress={openPostMenu} accessibilityLabel="Options confidence">

          <Ionicons name="ellipsis-horizontal" size={22} color={colors.text} />

        </TouchableOpacity>

      </View>



      {error ? <Text style={styles.error}>{error}</Text> : null}



      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.confessionBox}>

          <SosPostTypeBadge type={post.post_type} />

          <DisplayNameWithTier
            name={post.author_name}
            tierEmoji={post.author_tier_emoji}
            style={styles.confessionAuthor}
          />

          {post.content ? <Text style={styles.confessionContent}>{post.content}</Text> : null}

          {post.image_urls.length > 0 ? <SosPostImages urls={post.image_urls} /> : null}

          {post.post_type === 'poll' && post.poll_options?.length ? (
            <SosPollBlock
              options={post.poll_options}
              totalVotes={post.poll_total_votes ?? 0}
              userOptionId={post.user_poll_option_id}
              onVote={(optionId) => votePoll(optionId)}
            />
          ) : null}

        </View>



        <Text style={styles.repliesTitle}>

          {post.post_type === 'poll' ? 'Discussions' : 'Réponses'} — {replies.length}{' '}

          {replies.length !== 1 ? 'messages' : 'message'}

        </Text>



        {replies.map((r) => (

          <View key={r.id} style={styles.replyBubble}>

            <View style={styles.replyHeader}>

              <DisplayNameWithTier
                name={r.author_name}
                tierEmoji={r.author_tier_emoji}
                style={styles.replyAuthor}
              />

              <TouchableOpacity onPress={() => openReplyMenu(r)} hitSlop={8} accessibilityLabel="Options réponse">

                <Ionicons name="ellipsis-horizontal" size={18} color={colors.textMuted} />

              </TouchableOpacity>

            </View>

            <TouchableOpacity onLongPress={() => openReplyMenu(r)} activeOpacity={0.9}>

              <Text style={styles.replyContent}>{r.content}</Text>

              <Text style={styles.replyTime}>

                {new Date(r.created_at).toLocaleString('fr-FR', {

                  day: 'numeric',

                  month: 'short',

                  hour: '2-digit',

                  minute: '2-digit',

                })}

              </Text>

            </TouchableOpacity>

          </View>

        ))}

      </ScrollView>



      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>

        <TextInput

          style={styles.input}

          placeholder={
            post.post_type === 'poll'
              ? 'Commenter ce sondage…'
              : post.post_type === 'question'
                ? 'Répondre à cette question…'
                : 'Répondre avec bienveillance…'
          }

          placeholderTextColor={colors.textMuted}

          value={draft}

          onChangeText={setDraft}

          multiline

        />

        <View style={styles.anonRow}>

          <Text style={styles.anonLabel}>Anonyme</Text>

          <Switch

            value={anonymous}

            onValueChange={setAnonymous}

            trackColor={{ false: colors.border, true: colors.pink }}

          />

        </View>

        <TouchableOpacity

          style={[styles.sendBtn, (!draft.trim() || sending) && styles.sendDisabled]}

          onPress={handleReply}

          disabled={!draft.trim() || sending}

        >

          {sending ? (

            <ActivityIndicator color={colors.onPink} />

          ) : (

            <Text style={styles.sendText}>Envoyer ma réponse</Text>

          )}

        </TouchableOpacity>

      </View>



      <Modal visible={!!editModal} animationType="slide" transparent onRequestClose={() => setEditModal(null)}>

        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

          <View style={styles.modalSheet}>

            <Text style={styles.modalTitle}>Modifier</Text>

            <TextInput

              style={styles.modalInput}

              value={editDraft}

              onChangeText={setEditDraft}

              multiline

              maxLength={2000}

              placeholderTextColor={colors.textMuted}

            />

            <View style={styles.modalActions}>

              <TouchableOpacity style={styles.modalCancel} onPress={() => setEditModal(null)}>

                <Text style={styles.modalCancelText}>Annuler</Text>

              </TouchableOpacity>

              <TouchableOpacity

                style={[styles.modalSend, (!editDraft.trim() || savingEdit) && styles.sendDisabled]}

                onPress={handleSaveEdit}

                disabled={!editDraft.trim() || savingEdit}

              >

                {savingEdit ? (

                  <ActivityIndicator color={colors.onPink} />

                ) : (

                  <Text style={styles.modalSendText}>Enregistrer</Text>

                )}

              </TouchableOpacity>

            </View>

          </View>

        </KeyboardAvoidingView>

      </Modal>

    </KeyboardAvoidingView>

  );

}



function buildStyles(c: AppColors) {

  return StyleSheet.create({

  screen: { flex: 1, backgroundColor: c.bg },

  centered: { flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' },

  header: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 12,

    paddingHorizontal: 16,

    paddingVertical: 12,

    borderBottomWidth: 1,

    borderBottomColor: c.border,

  },

  headerTitle: { color: c.text, fontSize: 18, fontWeight: '700', flex: 1 },

  error: { color: '#ff6b6b', padding: 12, textAlign: 'center' },

  scroll: { padding: 16, paddingBottom: 24 },

  confessionBox: {

    backgroundColor: c.card,

    borderRadius: 16,

    padding: 16,

    borderLeftWidth: 4,

    borderLeftColor: c.pink,

    marginBottom: 20,

  },

  confessionLabel: { color: c.pink, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },

  confessionAuthor: { color: c.text, fontSize: 16, fontWeight: '700', marginTop: 6 },

  confessionContent: { color: c.text, fontSize: 16, lineHeight: 24, marginTop: 10 },

  repliesTitle: { color: c.text, fontSize: 16, fontWeight: '700', marginBottom: 12 },

  replyBubble: {

    backgroundColor: c.card,

    borderRadius: 14,

    padding: 14,

    marginBottom: 10,

  },

  replyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  replyAuthor: { color: c.pink, fontSize: 13, fontWeight: '700' },

  replyContent: { color: c.text, fontSize: 15, lineHeight: 22, marginTop: 6 },

  replyTime: { color: c.textMuted, fontSize: 11, marginTop: 8 },

  inputBar: {

    paddingHorizontal: 16,

    paddingTop: 10,

    borderTopWidth: 1,

    borderTopColor: c.border,

    backgroundColor: c.card,

  },

  input: {

    minHeight: 56,

    backgroundColor: c.bg,

    borderRadius: 12,

    padding: 12,

    color: c.text,

    fontSize: 15,

    textAlignVertical: 'top',

  },

  anonRow: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginTop: 8,

  },

  anonLabel: { color: c.textSecondary, fontSize: 13 },

  sendBtn: {

    backgroundColor: c.pink,

    borderRadius: 12,

    paddingVertical: 14,

    alignItems: 'center',

    marginTop: 10,

  },

  sendDisabled: { opacity: 0.5 },

  sendText: { color: c.onPink, fontWeight: '700' },

  modalOverlay: {

    flex: 1,

    justifyContent: 'flex-end',

    backgroundColor: 'rgba(0,0,0,0.6)',

  },

  modalSheet: {

    backgroundColor: c.card,

    borderTopLeftRadius: 20,

    borderTopRightRadius: 20,

    padding: 20,

    paddingBottom: 32,

  },

  modalTitle: { color: c.text, fontSize: 20, fontWeight: '700', marginBottom: 12 },

  modalInput: {

    minHeight: 100,

    backgroundColor: c.bg,

    borderRadius: 12,

    padding: 14,

    color: c.text,

    fontSize: 16,

    textAlignVertical: 'top',

  },

  modalActions: { flexDirection: 'row', gap: 12, marginTop: 16 },

  modalCancel: {

    flex: 1,

    paddingVertical: 14,

    alignItems: 'center',

    borderRadius: 12,

    borderWidth: 1,

    borderColor: c.border,

  },

  modalCancelText: { color: c.textSecondary, fontWeight: '600' },

  modalSend: {

    flex: 1,

    paddingVertical: 14,

    alignItems: 'center',

    borderRadius: 12,

    backgroundColor: c.pink,

  },

  modalSendText: { color: c.onPink, fontWeight: '700' },

  });

}


