import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { isLightTheme } from '@/constants/themeUtils';
import { CguDocument } from '@/components/legal/CguDocument';

export function CguViewerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle={isLightTheme(colors.bg) ? 'dark-content' : 'light-content'} />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>CGU EntreMeres</Text>
        <View style={styles.backBtn} />
      </View>
      <CguDocument colors={colors} showIntro={false} />
    </View>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.bg,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    topTitle: { color: c.text, fontSize: 18, fontWeight: '700' },
  });
}
