import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { cardElevation } from '@/constants/themeUtils';
import { useTheme } from '@/context/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { useSosMamanFeed } from '@/hooks/useSosMaman';
import type { SosMamanPost, SosMamanPostType } from '@/lib/sos-maman/types';
import { SOS_POST_TYPES, getPostTypeMeta } from '@/lib/sos-maman/constants';
import { showSosContentActions } from './sosMamanActions';
import { SosPostCard } from './SosPostCard';
import { SosMamanDesktopView } from './SosMamanDesktopView';
import { MAX_SOS_POST_PHOTOS, pickSosPhotos, takeSosPhoto } from '@/lib/sos-maman/pickSosPhotos';
import { globalEvents, EVENT_TYPES } from '@/events';
import { markSosFeedSeen } from '@/lib/sos-maman/sosMamanService';
import { TAB_BAR_CLEARANCE } from '@/constants/tabBarLayout';

export function SosMamanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isLight } = useTheme();
  const styles = useThemedStyles(buildStyles);
  const { useDesktopAppLayout } = useResponsiveLayout();
  const {
    posts,
    loading,
    refreshing,
    error,
    needsSetup,
    refresh,
    publish,
    removePost,
    editPost,
    reportPost,
    currentUserId,
  } = useSosMamanFeed();
  const [showCompose, setShowCompose] = useState(false);
  const [editingPost, setEditingPost] = useState<SosMamanPost | null>(null);
  const [draft, setDraft] = useState('');
  const [postType, setPostType] = useState<SosMamanPostType>('question');
  const [pollChoices, setPollChoices] = useState(['', '']);
  const [anonymous, setAnonymous] = useState(false);
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!currentUserId) return;
      markSosFeedSeen(currentUserId).then(() => {
        globalEvents.emit(EVENT_TYPES.SOS_MAMAN_BADGE_REFRESH);
      });
    }, [currentUserId]),
  );

  const composeMeta = getPostTypeMeta(postType);

  const closeCompose = () => {
    setShowCompose(false);
    setEditingPost(null);
    setDraft('');
    setPostType('question');
    setPollChoices(['', '']);
    setAnonymous(false);
    setPhotoUris([]);
  };

  const addPhotosFromGallery = async () => {
    try {
      const picked = await pickSosPhotos(MAX_SOS_POST_PHOTOS - photoUris.length);
      if (picked.length) setPhotoUris((prev) => [...prev, ...picked].slice(0, MAX_SOS_POST_PHOTOS));
    } catch (e) {
      Alert.alert('Photos', e instanceof Error ? e.message : 'Sélection impossible');
    }
  };

  const addPhotoFromCamera = async () => {
    if (photoUris.length >= MAX_SOS_POST_PHOTOS) return;
    try {
      const uri = await takeSosPhoto();
      if (uri) setPhotoUris((prev) => [...prev, uri].slice(0, MAX_SOS_POST_PHOTOS));
    } catch (e) {
      Alert.alert('Caméra', e instanceof Error ? e.message : 'Prise de photo impossible');
    }
  };

  const canPublish = draft.trim().length > 0 || photoUris.length > 0;

  const handlePublish = async () => {
    const text = draft.trim();
    if (!canPublish) return;
    if (!editingPost && postType === 'poll' && pollChoices.filter((c) => c.trim()).length < 2) {
      Alert.alert('Sondage', 'Ajoutez au moins 2 choix de réponse.');
      return;
    }
    setPublishing(true);
    try {
      if (editingPost) {
        await editPost(editingPost.id, text);
      } else {
        await publish({
          content: text,
          isAnonymous: anonymous,
          postType,
          pollOptions: postType === 'poll' ? pollChoices : undefined,
          photoUris: photoUris.length ? photoUris : undefined,
        });
      }
      closeCompose();
      globalEvents.emit(EVENT_TYPES.SOS_MAMAN_BADGE_REFRESH);
    } catch (e) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Publication impossible');
    } finally {
      setPublishing(false);
    }
  };

  const openThread = (post: SosMamanPost) => {
    router.push(`/sos-maman/${post.id}`);
  };

  const handlePostMenu = useCallback(
    (post: SosMamanPost) => {
      const isOwner = currentUserId === post.user_id;
      showSosContentActions({
        isOwner,
        onEdit: isOwner
          ? () => {
              setEditingPost(post);
              setDraft(post.content);
              setPostType(post.post_type);
              setAnonymous(post.is_anonymous);
              setShowCompose(true);
            }
          : undefined,
        onDelete: isOwner
          ? async () => {
              try {
                await removePost(post.id);
              } catch (e) {
                Alert.alert('Erreur', e instanceof Error ? e.message : 'Suppression impossible');
              }
            }
          : undefined,
        onReport: !isOwner
          ? async () => {
              try {
                await reportPost(post.id);
                Alert.alert('Merci', 'Votre signalement a été enregistré.');
              } catch (e) {
                Alert.alert('Erreur', e instanceof Error ? e.message : 'Signalement impossible');
              }
            }
          : undefined,
      });
    },
    [currentUserId, removePost, reportPost],
  );

  const composeModal = (
    <Modal visible={showCompose} animationType={useDesktopAppLayout ? 'fade' : 'slide'} transparent onRequestClose={closeCompose}>
      <KeyboardAvoidingView
        style={[styles.modalOverlay, useDesktopAppLayout && styles.modalOverlayDesktop]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.modalSheet, useDesktopAppLayout && styles.modalSheetDesktop]}>
          <Text style={styles.modalTitle}>
            {editingPost ? `Modifier — ${getPostTypeMeta(editingPost.post_type).composeTitle}` : composeMeta.composeTitle}
          </Text>
          {!editingPost ? (
            <View style={styles.typeRow}>
              {SOS_POST_TYPES.map((t) => {
                const active = postType === t.id;
                return (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.typeChip, active && styles.typeChipActive]}
                    onPress={() => setPostType(t.id)}
                  >
                    <Ionicons
                      name={t.icon}
                      size={14}
                      color={active ? colors.pink : colors.textMuted}
                    />
                    <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>{t.shortLabel}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
          <TextInput
            style={styles.modalInput}
            placeholder={composeMeta.placeholder}
            placeholderTextColor={colors.textMuted}
            value={draft}
            onChangeText={setDraft}
            multiline
            maxLength={2000}
          />
          {!editingPost ? (
            <View style={styles.photoSection}>
              <View style={styles.photoActions}>
                <TouchableOpacity style={styles.photoBtn} onPress={addPhotosFromGallery}>
                  <Ionicons name="images-outline" size={20} color={colors.pink} />
                  <Text style={styles.photoBtnText}>Galerie</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoBtn} onPress={addPhotoFromCamera}>
                  <Ionicons name="camera-outline" size={20} color={colors.pink} />
                  <Text style={styles.photoBtnText}>Caméra</Text>
                </TouchableOpacity>
                <Text style={styles.photoHint}>
                  {photoUris.length}/{MAX_SOS_POST_PHOTOS} photo{MAX_SOS_POST_PHOTOS > 1 ? 's' : ''}
                </Text>
              </View>
              {photoUris.length > 0 ? (
                <View style={styles.photoPreviewRow}>
                  {photoUris.map((uri, index) => (
                    <View key={`${uri}-${index}`} style={styles.photoPreviewWrap}>
                      <Image source={{ uri }} style={styles.photoPreview} contentFit="cover" />
                      <TouchableOpacity
                        style={styles.photoRemove}
                        onPress={() => setPhotoUris(photoUris.filter((_, i) => i !== index))}
                      >
                        <Ionicons name="close-circle" size={22} color={colors.pink} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}
          {!editingPost && postType === 'poll' ? (
            <View style={styles.pollSection}>
              <Text style={styles.pollLabel}>Choix du sondage (2 à 4)</Text>
              {pollChoices.map((choice, index) => (
                <View key={index} style={styles.pollChoiceRow}>
                  <TextInput
                    style={styles.pollInput}
                    placeholder={`Choix ${index + 1}`}
                    placeholderTextColor={colors.textMuted}
                    value={choice}
                    onChangeText={(v) => {
                      const next = [...pollChoices];
                      next[index] = v;
                      setPollChoices(next);
                    }}
                  />
                  {pollChoices.length > 2 ? (
                    <TouchableOpacity
                      onPress={() => setPollChoices(pollChoices.filter((_, i) => i !== index))}
                    >
                      <Ionicons name="close-circle" size={22} color={colors.textMuted} />
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))}
              {pollChoices.length < 4 ? (
                <TouchableOpacity
                  style={styles.addPollBtn}
                  onPress={() => setPollChoices([...pollChoices, ''])}
                >
                  <Ionicons name="add" size={18} color={colors.pink} />
                  <Text style={styles.addPollText}>Ajouter un choix</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
          {!editingPost ? (
            <View style={styles.anonRow}>
              <Text style={styles.anonLabel}>Publier anonymement</Text>
              <Switch
                value={anonymous}
                onValueChange={setAnonymous}
                trackColor={{ false: colors.grayDark, true: colors.pink }}
              />
            </View>
          ) : null}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalCancel} onPress={closeCompose}>
              <Text style={styles.modalCancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalSend, (!canPublish || publishing) && styles.modalSendDisabled]}
              onPress={handlePublish}
              disabled={!canPublish || publishing}
            >
              {publishing ? (
                <ActivityIndicator color={colors.onPink} />
              ) : (
                <Text style={styles.modalSendText}>{editingPost ? 'Enregistrer' : 'Publier'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <View style={[styles.screen, { paddingTop: useDesktopAppLayout ? 0 : insets.top }]}>
      <StatusBar barStyle={isLight ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />

      {useDesktopAppLayout ? (
        <SosMamanDesktopView
          colors={colors}
          insetsBottom={insets.bottom}
          posts={posts}
          loading={loading}
          refreshing={refreshing}
          error={error}
          needsSetup={needsSetup}
          currentUserId={currentUserId}
          onRefresh={refresh}
          onPressPost={openThread}
          onMenuPost={handlePostMenu}
          onPublish={() => setShowCompose(true)}
        />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>SOS Maman</Text>
            <Text style={styles.headerSubtitle}>
              Questions du quotidien, confidences ou sondages — les mamans vous répondent avec bienveillance
            </Text>
          </View>

          {needsSetup ? (
            <View style={styles.setupBox}>
              <Ionicons name="construct-outline" size={40} color={colors.pink} />
              <Text style={styles.setupTitle}>Tables à activer dans Supabase</Text>
              <Text style={styles.setupText}>
                Exécutez database/create_sos_maman_tables.sql puis database/add_sos_maman_photos.sql
                dans l’éditeur SQL Supabase, puis rechargez l’app.
              </Text>
            </View>
          ) : loading ? (
            <ActivityIndicator style={{ marginTop: 40 }} color={colors.pink} />
          ) : (
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: TAB_BAR_CLEARANCE + insets.bottom + 80,
                flexGrow: 1,
              }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.pink} />
              }
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Ionicons name="heart-outline" size={48} color={colors.textMuted} />
                  <Text style={styles.emptyText}>
                    {error ??
                      'Posez une question, lancez un sondage ou partagez une confidence.\nLes mamans sont là pour vous 💗'}
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <SosPostCard
                  post={item}
                  colors={colors}
                  currentUserId={currentUserId}
                  variant="mobile"
                  onPress={() => openThread(item)}
                  onMenu={handlePostMenu}
                />
              )}
            />
          )}

          <TouchableOpacity
            style={[styles.fab, { bottom: TAB_BAR_CLEARANCE + insets.bottom + 12 }]}
            onPress={() => setShowCompose(true)}
            activeOpacity={0.9}
          >
            <Ionicons name="add" size={28} color={colors.onPink} />
            <Text style={styles.fabText}>Publier</Text>
          </TouchableOpacity>
        </>
      )}

      {composeModal}
    </View>
  );
}

function buildStyles(c: AppColors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    header: { paddingHorizontal: 20, paddingVertical: 12, paddingBottom: 8 },
    headerTitle: { color: c.text, fontSize: 28, fontWeight: '800' },
    headerSubtitle: { color: c.pink, fontSize: 14, marginTop: 6, lineHeight: 20 },
    fab: {
      position: 'absolute',
      right: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: c.pink,
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderRadius: 28,
      shadowColor: '#000',
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 8,
    },
    fabText: { color: c.onPink, fontWeight: '700', fontSize: 15 },
    empty: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 24 },
    emptyText: { color: c.textMuted, textAlign: 'center', marginTop: 12, lineHeight: 22 },
    setupBox: { padding: 24, alignItems: 'center' },
    setupTitle: { color: c.text, fontSize: 18, fontWeight: '700', marginTop: 12 },
    setupText: { color: c.textMuted, textAlign: 'center', marginTop: 8, lineHeight: 20 },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalOverlayDesktop: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    modalSheet: {
      backgroundColor: c.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      paddingBottom: 32,
    },
    modalSheetDesktop: {
      width: '100%',
      maxWidth: 560,
      borderRadius: 20,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      ...cardElevation(c.bg),
    },
    modalTitle: { color: c.text, fontSize: 20, fontWeight: '700', marginBottom: 12 },
    typeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    typeChip: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    typeChipActive: { borderColor: c.pink, backgroundColor: c.pinkSoft },
    typeChipText: { color: c.textMuted, fontSize: 11, fontWeight: '600' },
    typeChipTextActive: { color: c.pink },
    pollSection: { marginTop: 12, gap: 8 },
    pollLabel: { color: c.textSecondary, fontSize: 13, fontWeight: '600' },
    pollChoiceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    pollInput: {
      flex: 1,
      backgroundColor: c.bg,
      borderRadius: 10,
      padding: 12,
      color: c.text,
      fontSize: 15,
    },
    addPollBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6 },
    addPollText: { color: c.pink, fontWeight: '600', fontSize: 14 },
    modalInput: {
      minHeight: 120,
      backgroundColor: c.bg,
      borderRadius: 12,
      padding: 14,
      color: c.text,
      fontSize: 16,
      textAlignVertical: 'top',
    },
    photoSection: { marginTop: 12, gap: 10 },
    photoActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    photoBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    photoBtnText: { color: c.pink, fontWeight: '600', fontSize: 14 },
    photoHint: { color: c.textMuted, fontSize: 12, marginLeft: 'auto' },
    photoPreviewRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    photoPreviewWrap: { position: 'relative' },
    photoPreview: { width: 72, height: 72, borderRadius: 10 },
    photoRemove: { position: 'absolute', top: -6, right: -6 },
    anonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 14,
    },
    anonLabel: { color: c.textSecondary, fontSize: 15 },
    modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
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
    modalSendDisabled: { opacity: 0.5 },
    modalSendText: { color: c.onPink, fontWeight: '700' },
  });
}
