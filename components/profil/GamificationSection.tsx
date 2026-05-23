import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { requestAppReview } from '@/lib/gamification/requestAppReview';
import type { AppColors } from '@/constants/themes';
import { cardElevation } from '@/constants/themeUtils';
import {
  GAMIFICATION_POINTS,
  GAMIFICATION_TIERS,
  GAMIFICATION_ACTION_LABELS,
} from '@/lib/gamification/constants';
import {
  formatCoeurs,
  tierStatusForList,
  type GamificationProgress,
} from '@/lib/gamification/computeProgress';
import {
  awardShareApp,
  awardStoreReview,
} from '@/lib/gamification/gamificationService';

type Props = {
  colors: AppColors;
  progress: GamificationProgress;
  userId: string | null;
  onPointsUpdated: () => void;
  /** Bloc en bas de l’écran profil */
  placement?: 'footer';
};

export function GamificationSection({ colors, progress, userId, onPointsUpdated, placement }: Props) {
  const styles = createStyles(colors);

  const handleShare = async () => {
    if (!userId) return;
    try {
      await Share.share({
        message:
          'Je utilise EntreMeres pour échanger avec d’autres mamans : SOS Maman, rencontres et émissions TV 💗\nhttps://entremeres.fr',
        title: 'EntreMeres',
      });
      const result = await awardShareApp(userId);
      onPointsUpdated();
      if (result.awarded) {
        Alert.alert(
          'Merci ! 💗',
          `+${GAMIFICATION_POINTS.share_app} cœurs pour avoir partagé EntreMeres.`,
        );
      } else {
        Alert.alert(
          'Partage',
          'Vous avez déjà gagné des cœurs pour un partage cette semaine. Revenez la semaine prochaine !',
        );
      }
    } catch {
      Alert.alert('Partage', 'Le partage n’a pas pu être effectué.');
    }
  };

  const handleReview = async () => {
    if (!userId) return;
    try {
      const outcome = await requestAppReview();
      if (outcome === 'expo_go' || outcome === 'unavailable' || outcome === 'cancelled') return;

      const result = await awardStoreReview(userId);
      onPointsUpdated();
      if (result.awarded) {
        Alert.alert(
          'Merci ! 💗',
          `+${GAMIFICATION_POINTS.store_review} cœurs pour votre avis.`,
        );
      } else {
        Alert.alert('Merci', 'Vous avez déjà reçu des cœurs pour votre avis. Merci infiniment 💗');
      }
    } catch {
      Alert.alert('Avis', 'Impossible d’ouvrir l’avis pour le moment.');
    }
  };

  const isFooter = placement === 'footer';

  return (
    <View style={[styles.wrap, isFooter && styles.wrapFooter]}>
      {isFooter ? <View style={styles.footerDivider} /> : null}
      <Text style={[styles.sectionTitle, isFooter && styles.sectionTitleFooter]}>PROGRESSION</Text>
      {GAMIFICATION_TIERS.map((tier) => {
        const status = tierStatusForList(tier, progress.coeurs);
        const rangeLabel =
          tier.max !== null
            ? `${formatCoeurs(tier.min)} – ${formatCoeurs(tier.max)} ❤️`
            : `${formatCoeurs(tier.min)}+ ❤️`;

        return (
          <View
            key={tier.level}
            style={[styles.tierRow, status === 'current' && styles.tierRowCurrent]}
          >
            <View style={styles.tierIconBox}>
              <Text style={styles.tierEmoji}>{tier.emoji}</Text>
            </View>
            <View style={styles.tierText}>
              <Text style={styles.tierName}>{tier.title}</Text>
              <Text style={styles.tierRange}>{rangeLabel}</Text>
            </View>
            {status === 'obtained' ? (
              <View style={styles.badgeObtained}>
                <Text style={styles.badgeObtainedText}>✓ Obtenu</Text>
              </View>
            ) : status === 'current' ? (
              <View style={styles.badgeCurrent}>
                <Text style={styles.badgeCurrentText}>● En cours</Text>
              </View>
            ) : (
              <View style={styles.badgeLocked}>
                <Text style={styles.badgeLockedText}>À venir</Text>
              </View>
            )}
          </View>
        );
      })}

      <Text style={styles.sectionTitle}>GAGNER DES CŒURS</Text>
      <View style={styles.actionsCard}>
        <TouchableOpacity style={styles.actionRow} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={22} color={colors.pink} />
          <View style={styles.actionText}>
            <Text style={styles.actionLabel}>Partager EntreMeres</Text>
            <Text style={styles.actionSub}>+{GAMIFICATION_POINTS.share_app} cœurs / semaine</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity style={styles.actionRow} onPress={handleReview}>
          <Ionicons name="star-outline" size={22} color={colors.pink} />
          <View style={styles.actionText}>
            <Text style={styles.actionLabel}>Laisser un avis</Text>
            <Text style={styles.actionSub}>+{GAMIFICATION_POINTS.store_review} cœurs (une fois)</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.hintBox}>
        <Text style={styles.hintText}>
          Répondre à un SOS (+{GAMIFICATION_POINTS.sos_reply}) · Publier (+{GAMIFICATION_POINTS.sos_publish}) ·
          Sondage (+{GAMIFICATION_POINTS.sos_poll_vote}) · Réponse reçue (+{GAMIFICATION_POINTS.sos_reply_received}) ·
          {GAMIFICATION_ACTION_LABELS.friend_added} (+{GAMIFICATION_POINTS.friend_added})
        </Text>
      </View>
    </View>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
    wrap: { marginHorizontal: 16, marginBottom: 8 },
    wrapFooter: {
      marginTop: 24,
      paddingTop: 8,
      marginBottom: 16,
    },
    footerDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.border,
      marginBottom: 20,
      opacity: 0.8,
    },
    sectionTitle: {
      color: c.textMuted,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
      marginTop: 8,
      marginBottom: 10,
    },
    sectionTitleFooter: {
      marginTop: 0,
      fontSize: 10,
      opacity: 0.85,
    },
    tierRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      gap: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
    },
    tierRowCurrent: {
      borderColor: c.pink,
      backgroundColor: c.pinkSoft,
    },
    tierIconBox: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: c.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tierEmoji: { fontSize: 20 },
    tierText: { flex: 1 },
    tierName: { color: c.text, fontSize: 15, fontWeight: '700' },
    tierRange: { color: c.textMuted, fontSize: 12, marginTop: 2 },
    badgeObtained: {
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
    },
    badgeObtainedText: { color: '#6fcf97', fontSize: 11, fontWeight: '700' },
    badgeCurrent: {
      backgroundColor: c.pinkSoft,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.pink,
    },
    badgeCurrentText: { color: c.pink, fontSize: 11, fontWeight: '700' },
    badgeLocked: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
    },
    badgeLockedText: { color: c.textMuted, fontSize: 11, fontWeight: '600' },
    actionsCard: {
      backgroundColor: c.card,
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      overflow: 'hidden',
      ...cardElevation(c.bg),
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      gap: 12,
    },
    actionDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.border,
      marginHorizontal: 14,
    },
    actionText: { flex: 1 },
    actionLabel: { color: c.text, fontSize: 15, fontWeight: '600' },
    actionSub: { color: c.textMuted, fontSize: 12, marginTop: 2 },
    hintBox: { marginTop: 12, paddingHorizontal: 4 },
    hintText: { color: c.textMuted, fontSize: 12, lineHeight: 18 },
  });
}
