import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TV_COLORS } from '@/constants/tvColors';
import { getPostTypeMeta } from '@/lib/sos-maman/constants';
import type { SosMamanPostType } from '@/lib/sos-maman/types';

const TYPE_COLORS: Record<SosMamanPostType, string> = {
  question: '#3d5a80',
  confession: '#5c2a3a',
  poll: '#2a4a3e',
};

export function SosPostTypeBadge({ type }: { type: SosMamanPostType }) {
  const meta = getPostTypeMeta(type);
  return (
    <View style={[styles.badge, { backgroundColor: TYPE_COLORS[type] }]}>
      <Ionicons name={meta.icon} size={12} color={TV_COLORS.pink} />
      <Text style={styles.text}>{meta.shortLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  text: {
    color: TV_COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
});
