import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { cardElevation } from '@/constants/themeUtils';
import {
  TV_AVAILABILITY_BODY,
  TV_AVAILABILITY_BRAND,
  TV_AVAILABILITY_CTA,
  TV_AVAILABILITY_TITLE,
} from '@/lib/tv/availability';
import { dismissTvAvailabilityModal, subscribeTvAvailabilityModal } from '@/lib/tv/tvAvailabilityModal';

export function TvAvailabilityModalHost() {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => subscribeTvAvailabilityModal(setVisible), []);

  const close = () => dismissTvAvailabilityModal();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close}>
        <Pressable
          style={[
            styles.panel,
            { backgroundColor: colors.card, borderColor: colors.border },
            cardElevation(colors.bg),
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[styles.brand, { color: colors.pink }]}>{TV_AVAILABILITY_BRAND}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{TV_AVAILABILITY_TITLE}</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>{TV_AVAILABILITY_BODY}</Text>
          <Pressable
            style={[styles.button, { backgroundColor: colors.pink }]}
            onPress={close}
            accessibilityRole="button"
          >
            <Text style={[styles.buttonText, { color: colors.onPink }]}>{TV_AVAILABILITY_CTA}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 28,
    alignItems: 'center',
    gap: 12,
  },
  brand: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 30,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  button: {
    width: '100%',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
