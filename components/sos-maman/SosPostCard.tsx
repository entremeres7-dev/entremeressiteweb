import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { cardElevation } from '@/constants/themeUtils';
import { DisplayNameWithTier } from '@/components/gamification/DisplayNameWithTier';
import type { SosMamanPost } from '@/lib/sos-maman/types';
import { SosPostTypeBadge } from './SosPostTypeBadge';
import { SosPollBlock } from './SosPollBlock';
import { SosPostImages } from './SosPostImages';

type Props = {
  post: SosMamanPost;
  colors: AppColors;
  currentUserId: string | null;
  variant?: 'mobile' | 'desktop';
  onPress: () => void;
  onMenu: (post: SosMamanPost) => void;
};

export function SosPostCard({
  post,
  colors,
  currentUserId,
  variant = 'mobile',
  onPress,
  onMenu,
}: Props) {
  const isOwner = currentUserId === post.user_id;
  const isDesktop = variant === 'desktop';
  const styles = buildStyles(colors, isDesktop);

  const formattedDate = new Date(post.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const avatar = post.author_photo && !post.is_anonymous ? (
    <Image source={{ uri: post.author_photo }} style={styles.avatar} contentFit="cover" />
  ) : (
    <View style={[styles.avatar, styles.avatarPlaceholder]}>
      <Ionicons name="heart" size={isDesktop ? 20 : 18} color={colors.pink} />
    </View>
  );

  const menuButton = (
    <TouchableOpacity
      onPress={() => onMenu(post)}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityLabel="Options"
    >
      <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );

  const contentBlock = (
    <>
      <SosPostTypeBadge type={post.post_type} />
      {post.content ? (
        <Text style={styles.cardContent} numberOfLines={isDesktop ? 3 : 6}>
          {post.content}
        </Text>
      ) : null}
      {post.image_urls.length > 0 ? <SosPostImages urls={post.image_urls} compact /> : null}
      {post.post_type === 'poll' && post.poll_options?.length ? (
        <SosPollBlock
          options={post.poll_options}
          totalVotes={post.poll_total_votes ?? 0}
          userOptionId={post.user_poll_option_id}
          compact
        />
      ) : null}
    </>
  );

  if (isDesktop) {
    return (
      <TouchableOpacity
        style={[
          styles.card,
          Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : null,
        ]}
        onPress={onPress}
        onLongPress={() => onMenu(post)}
        activeOpacity={0.92}
      >
        {avatar}
        <View style={styles.body}>
          <View style={styles.topRow}>
            <View style={styles.authorBlock}>
              <DisplayNameWithTier
                name={post.author_name}
                tierEmoji={post.author_tier_emoji}
                style={styles.cardAuthor}
                numberOfLines={1}
              />
              <Text style={styles.cardTime}>{formattedDate}</Text>
            </View>
            <View style={styles.topRowRight}>
              {post.has_unread_replies && isOwner ? <View style={styles.unreadDot} /> : null}
              {menuButton}
            </View>
          </View>
          {contentBlock}
          <View style={styles.cardFooter}>
            <Ionicons name="chatbubble-outline" size={16} color={colors.pink} />
            <Text style={styles.cardReplies}>
              {post.replies_count} réponse{post.replies_count !== 1 ? 's' : ''}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} style={styles.chevron} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <TouchableOpacity style={styles.cardHeaderMain} onPress={onPress} activeOpacity={0.9}>
          {avatar}
          <View style={styles.cardHeaderText}>
            <DisplayNameWithTier
              name={post.author_name}
              tierEmoji={post.author_tier_emoji}
              style={styles.cardAuthor}
              numberOfLines={1}
            />
            <Text style={styles.cardTime}>{formattedDate}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.cardHeaderRight}>
          {post.has_unread_replies && isOwner ? <View style={styles.unreadDot} /> : null}
          {menuButton}
        </View>
      </View>
      <TouchableOpacity onPress={onPress} onLongPress={() => onMenu(post)} activeOpacity={0.9}>
        {contentBlock}
        <View style={styles.cardFooter}>
          <Ionicons name="chatbubble-outline" size={16} color={colors.pink} />
          <Text style={styles.cardReplies}>
            {post.replies_count} réponse{post.replies_count !== 1 ? 's' : ''} de mamans
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function buildStyles(c: AppColors, isDesktop: boolean) {
  return StyleSheet.create({
    card: isDesktop
      ? {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 16,
          backgroundColor: c.card,
          borderRadius: 16,
          padding: 18,
          marginBottom: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: c.border,
          ...cardElevation(c.bg),
        }
      : {
          backgroundColor: c.card,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderLeftWidth: 4,
          borderLeftColor: c.pink,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: c.border,
          ...cardElevation(c.bg),
        },
    body: isDesktop ? { flex: 1, minWidth: 0 } : undefined,
    topRow: isDesktop
      ? { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }
      : undefined,
    topRowRight: isDesktop ? { flexDirection: 'row', alignItems: 'center', gap: 8 } : undefined,
    authorBlock: isDesktop ? { flex: 1, minWidth: 0 } : undefined,
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
    cardHeaderMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
    avatar: isDesktop
      ? { width: 52, height: 52, borderRadius: 26 }
      : { width: 40, height: 40, borderRadius: 20 },
    avatarPlaceholder: {
      backgroundColor: c.pinkSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardHeaderText: { flex: 1 },
    cardHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cardAuthor: { color: c.text, fontSize: isDesktop ? 16 : 15, fontWeight: '700' },
    cardTime: { color: c.textMuted, fontSize: isDesktop ? 12 : 11, marginTop: 2 },
    unreadDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: c.pink,
    },
    cardContent: {
      color: c.text,
      fontSize: isDesktop ? 15 : 15,
      lineHeight: isDesktop ? 23 : 22,
      marginTop: isDesktop ? 8 : 0,
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: isDesktop ? 12 : 12,
    },
    cardReplies: { color: c.pink, fontSize: 13, fontWeight: '600' },
    chevron: { marginLeft: 'auto' },
  });
}
