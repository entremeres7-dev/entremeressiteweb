import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { isLightTheme } from '@/constants/themeUtils';
import { CguDocument } from '@/components/legal/CguDocument';

type Props = {
  colors: AppColors;
  onAccept: () => void;
};

export function CguAcceptanceScreen({ colors, onAccept }: Props) {
  const insets = useSafeAreaInsets();
  const [checked, setChecked] = useState(false);
  const styles = createStyles(colors);

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle={isLightTheme(colors.bg) ? 'dark-content' : 'light-content'} />
      <CguDocument colors={colors} showIntro />

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable style={styles.checkRow} onPress={() => setChecked((v) => !v)}>
          <View style={[styles.checkbox, checked && styles.checkboxOn]}>
            {checked ? <Ionicons name="checkmark" size={16} color={colors.onPink} /> : null}
          </View>
          <Text style={styles.checkLabel}>
            J’ai lu et j’accepte les Conditions Générales d’Utilisation d’EntreMeres
          </Text>
        </Pressable>

        <TouchableOpacity
          style={[styles.acceptBtn, !checked && styles.acceptBtnDisabled]}
          onPress={onAccept}
          disabled={!checked}
          activeOpacity={0.9}
        >
          <Text style={styles.acceptBtnText}>J’accepte et je continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.bg,
    },
    footer: {
      paddingHorizontal: 20,
      paddingTop: 14,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
      backgroundColor: c.card,
      gap: 14,
    },
    checkRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    checkboxOn: {
      backgroundColor: c.pink,
      borderColor: c.pink,
    },
    checkLabel: {
      flex: 1,
      color: c.text,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
    },
    acceptBtn: {
      backgroundColor: c.pink,
      borderRadius: 28,
      paddingVertical: 16,
      alignItems: 'center',
    },
    acceptBtnDisabled: {
      opacity: 0.45,
    },
    acceptBtnText: {
      color: c.onPink,
      fontSize: 17,
      fontWeight: '700',
    },
  });
}
