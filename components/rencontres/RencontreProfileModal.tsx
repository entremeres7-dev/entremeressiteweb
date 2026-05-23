import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { createPortal } from 'react-dom';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { getFriendRelationWith, sendFriendRequest } from '@/lib/friends/friendsService';
import type { FriendRelationKind } from '@/lib/friends/types';
import type { AppColors } from '@/constants/themes';
import { TV_COLORS } from '@/constants/tvColors';
import { useTheme } from '@/context/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { DisplayNameWithTier } from '@/components/gamification/DisplayNameWithTier';
import { showAppAlert, showLoginRequiredAlert } from '@/lib/ui/actionSheet';
import type { MamanRencontre } from '@/lib/rencontres/types';

const DESKTOP_MODAL_WIDTH = 480;
const DESKTOP_PHOTO_HEIGHT = 360;
const WEB_OVERLAY_Z_INDEX = 100000;

const WEB_OVERLAY_STYLE: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: WEB_OVERLAY_Z_INDEX,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.72)',
  padding: 24,
  boxSizing: 'border-box',
};

type Props = {
  profile: MamanRencontre | null;
  onClose: () => void;
  onPass?: (profile: MamanRencontre) => void;
  onLike?: (profile: MamanRencontre) => void;
};

export function RencontreProfileModal({ profile, onClose, onPass, onLike }: Props) {
  const styles = useThemedStyles(buildStyles);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session, user } = useAuth();
  const { useDesktopRencontreLayout, height: screenHeight } = useResponsiveLayout();
  const { width: windowWidth } = useWindowDimensions();
  const [portalReady, setPortalReady] = useState(false);
  const [addingFriend, setAddingFriend] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusIsError, setStatusIsError] = useState(false);
  const [friendRelation, setFriendRelation] = useState<FriendRelationKind | null>(null);
  const [loadingRelation, setLoadingRelation] = useState(false);

  useEffect(() => {
    if (!profile) {
      setPortalReady(false);
      return;
    }
    setStatusMessage(null);
    setStatusIsError(false);
    setAddingFriend(false);
    const frame = requestAnimationFrame(() => setPortalReady(true));
    return () => cancelAnimationFrame(frame);
  }, [profile?.id]);

  useEffect(() => {
    if (!profile?.id || !user?.id || user.id === profile.id) {
      setFriendRelation(null);
      setLoadingRelation(false);
      return;
    }

    let cancelled = false;
    setLoadingRelation(true);
    getFriendRelationWith(user.id, profile.id)
      .then((relation) => {
        if (!cancelled) setFriendRelation(relation);
      })
      .catch(() => {
        if (!cancelled) setFriendRelation(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingRelation(false);
      });

    return () => {
      cancelled = true;
    };
  }, [profile?.id, user?.id]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined' || !profile) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [profile?.id]);

  if (!profile || (Platform.OS === 'web' && !portalReady)) return null;

  const useDesktopModal = useDesktopRencontreLayout;
  const modalWidth = useDesktopModal ? Math.min(DESKTOP_MODAL_WIDTH, windowWidth - 48) : windowWidth;
  const modalMaxHeight = useDesktopModal ? Math.min(720, screenHeight - 48) : screenHeight;
  const isOwnProfile = Boolean(user?.id && user.id === profile.id);
  const showAddFriend = !isOwnProfile;
  const isWeb = Platform.OS === 'web';
  const requestSent = friendRelation === 'pending_sent';
  const alreadyFriends = friendRelation === 'accepted';
  const requestReceived = friendRelation === 'pending_received';
  const canSendRequest = friendRelation === null;

  const addFriendLabel = loadingRelation
    ? 'Chargement…'
    : requestSent
      ? 'Demande envoyée'
      : alreadyFriends
        ? 'Déjà amie'
        : requestReceived
          ? 'Demande reçue'
          : addingFriend
            ? 'Envoi en cours…'
            : 'Ajouter cette maman';

  const addFriendIcon = requestSent
    ? 'checkmark-circle-outline'
    : alreadyFriends
      ? 'heart-outline'
      : requestReceived
        ? 'mail-outline'
        : 'person-add-outline';

  const addFriendDisabled =
    loadingRelation || addingFriend || !canSendRequest || requestSent || alreadyFriends || requestReceived;

  const handleLike = () => {
    onLike?.(profile);
    showAppAlert('J\'aime 💕', `Vous avez aimé ${profile.name}.`, onClose);
  };

  const handlePass = () => {
    onPass?.(profile);
    onClose();
  };

  const handleAddFriend = async () => {
    if (addingFriend || addFriendDisabled || !canSendRequest) return;

    setStatusMessage(null);
    setStatusIsError(false);

    if (!user?.id) {
      showLoginRequiredAlert('Connectez-vous pour ajouter une maman.', () => {
        onClose();
        router.push('/login');
      });
      return;
    }
    if (user.id === profile.id) {
      showAppAlert('Info', 'C’est votre propre profil 💗');
      return;
    }

    setAddingFriend(true);
    try {
      await sendFriendRequest(user.id, profile.id);
      setFriendRelation('pending_sent');
      const successText = `Demande envoyée à ${profile.name} 💗 Vous gagnerez 10 cœurs quand elle acceptera.`;
      setStatusMessage(successText);
      showAppAlert('Demande envoyée 💗', successText);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Demande impossible';
      if (message.includes('demande existe déjà') || message.includes('déjà amies')) {
        setFriendRelation(message.includes('déjà amies') ? 'accepted' : 'pending_sent');
        setStatusMessage(message.includes('déjà amies') ? 'Vous êtes déjà amies 💗' : 'Demande déjà envoyée.');
        setStatusIsError(false);
      } else {
        setStatusMessage(message);
        setStatusIsError(true);
        showAppAlert('Erreur', message);
      }
    } finally {
      setAddingFriend(false);
    }
  };

  const handleMessage = () => {
    if (!session) {
      showLoginRequiredAlert('Connectez-vous pour envoyer un message.', () => {
        onClose();
        router.push('/login');
      });
      return;
    }
    onClose();
    router.push({
      pathname: '/chat/[peerId]',
      params: {
        peerId: profile.id,
        name: profile.name,
        photo: profile.photoUrl,
      },
    });
  };

  const profileInfo = (
    <>
      <View style={styles.nameRow}>
        <DisplayNameWithTier
          name={profile.name}
          tierEmoji={profile.tierEmoji}
          style={[styles.name, useDesktopModal && { color: colors.text }]}
        />
        {profile.age != null ? (
          <Text style={[styles.age, useDesktopModal && { color: colors.textSecondary }]}>
            , {profile.age}
          </Text>
        ) : null}
      </View>

      <View style={styles.locationRow}>
        <Ionicons
          name="location-outline"
          size={16}
          color={useDesktopModal ? colors.textSecondary : TV_COLORS.grayLight}
        />
        <Text style={[styles.location, useDesktopModal && { color: colors.textSecondary }]}>
          {profile.city}
        </Text>
      </View>

      {profile.tags.length > 0 ? (
        <View style={styles.tagsRow}>
          {profile.tags.map((tag) => (
            <View key={tag} style={[styles.tag, useDesktopModal && styles.tagWide]}>
              <Text style={[styles.tagText, useDesktopModal && { color: colors.pink }]}>{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <Text style={[styles.bioLabel, useDesktopModal && { color: colors.textMuted }]}>À propos</Text>
      <Text style={[styles.bio, useDesktopModal && { color: colors.text }]}>{profile.bio}</Text>
    </>
  );

  const primaryActions = (
    <View
      style={[
        styles.primaryActions,
        useDesktopModal && styles.primaryActionsDesktop,
        { paddingBottom: Math.max(insets.bottom, useDesktopModal ? 20 : 16) },
      ]}
    >
      {showAddFriend ? (
        <TouchableOpacity
          style={[
            styles.primaryBtn,
            styles.addBtn,
            addFriendDisabled && styles.addBtnDisabled,
            {
              borderColor: addFriendDisabled ? colors.textMuted : colors.pink,
              opacity: addFriendDisabled ? 0.85 : 1,
            },
          ]}
          onPress={handleAddFriend}
          activeOpacity={0.85}
          disabled={addFriendDisabled}
        >
          {addingFriend || loadingRelation ? (
            <ActivityIndicator size="small" color={colors.pink} />
          ) : (
            <Ionicons
              name={addFriendIcon}
              size={20}
              color={addFriendDisabled ? colors.textMuted : colors.pink}
            />
          )}
          <Text
            style={[
              styles.primaryBtnText,
              { color: addFriendDisabled ? colors.textMuted : colors.pink },
            ]}
          >
            {addFriendLabel}
          </Text>
        </TouchableOpacity>
      ) : null}

      {statusMessage ? (
        <Text
          style={[
            styles.statusMessage,
            { color: statusIsError ? '#ff6b6b' : colors.pink },
          ]}
        >
          {statusMessage}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[styles.primaryBtn, styles.messageBtnWide, { backgroundColor: colors.pink }]}
        onPress={handleMessage}
        activeOpacity={0.85}
      >
        <Ionicons name="chatbubble-outline" size={20} color={colors.onPink} />
        <Text style={[styles.primaryBtnText, { color: colors.onPink }]}>Envoyer un message</Text>
      </TouchableOpacity>

      {!useDesktopModal ? (
        <View style={styles.secondaryActions}>
          <Pressable style={[styles.actionBtn, styles.passBtn]} onPress={handlePass}>
            <Ionicons name="close" size={28} color="#ff4458" />
          </Pressable>
          <Pressable style={[styles.actionBtn, styles.likeBtn]} onPress={handleLike}>
            <Ionicons name="heart" size={28} color="#2ed573" />
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  const modalBody = (
    <>
      <View style={[styles.photoWrap, useDesktopModal && { height: DESKTOP_PHOTO_HEIGHT }]}>
        <Image
          source={{ uri: profile.photoUrl }}
          style={useDesktopModal ? styles.photoDesktop : StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
        {!useDesktopModal ? (
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.92)']}
            locations={[0.35, 0.65, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        ) : null}
      </View>

      <TouchableOpacity
        style={[
          styles.closeBtn,
          { top: useDesktopModal ? 12 : insets.top + 8 },
          useDesktopModal && styles.closeBtnWide,
        ]}
        onPress={onClose}
        accessibilityLabel="Fermer"
      >
        <Ionicons name={useDesktopModal ? 'close' : 'chevron-down'} size={24} color={TV_COLORS.white} />
      </TouchableOpacity>

      <View
        style={[
          styles.content,
          useDesktopModal && styles.contentWide,
          { paddingBottom: useDesktopModal ? 8 : Math.max(insets.bottom, 20) + 140 },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.scrollContent}
        >
          {profileInfo}
        </ScrollView>
      </View>

      {primaryActions}
    </>
  );

  const profileCard = (
    <View
      style={[
        styles.container,
        styles.containerWide,
        { width: modalWidth, maxHeight: modalMaxHeight },
      ]}
    >
      {modalBody}
    </View>
  );

  if (isWeb && typeof document !== 'undefined') {
    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Profil de ${profile.name}`}
        style={WEB_OVERLAY_STYLE}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          style={{ width: '100%', maxWidth: modalWidth, maxHeight: modalMaxHeight }}
          onClick={(event) => event.stopPropagation()}
        >
          {profileCard}
        </div>
      </div>,
      document.body,
    );
  }

  const desktopSheet = (
    <Pressable
      style={[styles.backdrop, styles.backdropWide]}
      onPress={onClose}
    >
      <Pressable
        style={[
          styles.container,
          styles.containerWide,
          { width: modalWidth, maxHeight: modalMaxHeight },
        ]}
        onPress={(event) => event.stopPropagation()}
      >
        {modalBody}
      </Pressable>
    </Pressable>
  );

  return (
    <Modal
      visible
      animationType={useDesktopModal ? 'fade' : 'slide'}
      transparent={useDesktopModal || isWeb}
      presentationStyle={useDesktopModal ? 'overFullScreen' : 'fullScreen'}
      onRequestClose={onClose}
    >
      {useDesktopModal ? (
        desktopSheet
      ) : (
        <View style={styles.backdrop}>{modalBody}</View>
      )}
    </Modal>
  );
}

function buildStyles(c: AppColors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: c.bg,
    },
    backdropWide: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.72)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    container: {
      flex: 1,
      backgroundColor: c.bg,
    },
    containerWide: {
      flexGrow: 0,
      flexShrink: 1,
      width: '100%',
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.35,
      shadowRadius: 32,
      elevation: 16,
    },
    photoWrap: {
      width: '100%',
      position: 'relative',
      backgroundColor: '#111',
      ...(Platform.OS === 'web' ? { minHeight: DESKTOP_PHOTO_HEIGHT } : null),
    },
    photoDesktop: {
      width: '100%',
      height: '100%',
    },
    closeBtn: {
      position: 'absolute',
      left: 16,
      zIndex: 10,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0,0,0,0.45)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeBtnWide: {
      left: undefined,
      right: 12,
      backgroundColor: 'rgba(0,0,0,0.55)',
    },
    content: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      maxHeight: '48%',
    },
    contentWide: {
      position: 'relative',
      maxHeight: 260,
      backgroundColor: c.card,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 8,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
    },
    name: {
      color: TV_COLORS.white,
      fontSize: 32,
      fontWeight: '800',
      letterSpacing: -0.5,
    },
    age: {
      fontSize: 28,
      fontWeight: '600',
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 6,
    },
    location: {
      color: TV_COLORS.grayLight,
      fontSize: 16,
      fontWeight: '500',
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 14,
    },
    tag: {
      backgroundColor: 'rgba(255,106,136,0.45)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
    },
    tagWide: {
      backgroundColor: c.pinkSoft,
      borderColor: c.border,
    },
    tagText: {
      color: TV_COLORS.white,
      fontSize: 13,
      fontWeight: '600',
    },
    bioLabel: {
      color: TV_COLORS.grayLight,
      fontSize: 13,
      fontWeight: '700',
      marginTop: 18,
      marginBottom: 6,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    bio: {
      color: TV_COLORS.white,
      fontSize: 16,
      lineHeight: 24,
    },
    primaryActions: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 20,
      paddingTop: 12,
      gap: 10,
      backgroundColor: 'rgba(13,13,13,0.92)',
    },
    primaryActionsDesktop: {
      position: 'relative',
      backgroundColor: c.card,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
      paddingTop: 16,
    },
    primaryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 14,
      borderRadius: 999,
    },
    addBtn: {
      borderWidth: 1.5,
      backgroundColor: 'rgba(255,106,136,0.1)',
    },
    addBtnDisabled: {
      backgroundColor: 'rgba(128,128,128,0.08)',
    },
    messageBtnWide: {
      borderWidth: 0,
    },
    primaryBtnText: {
      fontSize: 16,
      fontWeight: '800',
    },
    statusMessage: {
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      paddingHorizontal: 4,
    },
    secondaryActions: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 24,
      marginTop: 4,
    },
    actionBtn: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.card,
      borderWidth: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.35,
      shadowRadius: 6,
      elevation: 8,
    },
    passBtn: {
      borderColor: '#ff4458',
    },
    likeBtn: {
      borderColor: '#2ed573',
    },
  });
}
