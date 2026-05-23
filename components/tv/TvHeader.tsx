import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { TV_COLORS } from '@/constants/tvColors';
import { useTheme } from '@/context/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';

type Props = {
  onSearch?: () => void;
  onProfile?: () => void;
};

export function TvHeader({ onSearch, onProfile }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(buildStyles);

  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoEntre}>Entre</Text>
        <Text style={styles.logoMeres}>Meres</Text>
        <View style={styles.tvBadge}>
          <Text style={styles.tvText}>TV</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconBtn} onPress={onSearch} accessibilityLabel="Rechercher">
          <Ionicons name="search" size={22} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarBtn} onPress={onProfile} accessibilityLabel="Profil">
          <View style={styles.avatar}>
            <Ionicons name="person" size={14} color={colors.pink} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function buildStyles(c: AppColors) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    logoContainer: { flexDirection: 'row', alignItems: 'center' },
    logoEntre: {
      color: c.text,
      fontSize: 20,
      fontWeight: '300',
      fontStyle: 'italic',
    },
    logoMeres: {
      color: c.pink,
      fontSize: 20,
      fontWeight: '700',
      fontStyle: 'italic',
    },
    tvBadge: {
      backgroundColor: c.pink,
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginLeft: 6,
    },
    tvText: { color: c.onPink, fontSize: 12, fontWeight: '700' },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconBtn: { padding: 4 },
    avatarBtn: { padding: 2 },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: c.pinkSoft,
      borderWidth: 1.5,
      borderColor: c.pink,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
