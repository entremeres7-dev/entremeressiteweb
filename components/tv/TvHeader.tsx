import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';

const TV_LOGO = require('@/assets/images/logo2.png');

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
        <Image
          source={TV_LOGO}
          style={styles.logo}
          contentFit="contain"
          accessibilityLabel="EntreMeres TV"
        />
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
    logoContainer: { flexShrink: 1, marginRight: 12 },
    logo: { height: 40, width: 200 },
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
