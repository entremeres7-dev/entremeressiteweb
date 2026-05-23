import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';

const CONTACT_EMAIL = 'contact@entremeres.fr';

export function AideContactScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Aide et contact</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)} activeOpacity={0.8}>
          <Text style={styles.email}>{CONTACT_EMAIL}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
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
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
    email: { color: c.pink, fontSize: 18, fontWeight: '600', textAlign: 'center' },
  });
}
