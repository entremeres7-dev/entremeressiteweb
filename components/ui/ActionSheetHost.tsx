import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import type { ActionSheetButton } from '@/lib/ui/actionSheet';
import { dismissActionSheet, subscribeActionSheet } from '@/lib/ui/actionSheet';

export function ActionSheetHost() {
  const { colors } = useTheme();
  const [sheet, setSheet] = useState<{ title: string; message?: string; buttons: ActionSheetButton[] } | null>(
    null,
  );

  useEffect(() => subscribeActionSheet(setSheet), []);

  const close = () => {
    dismissActionSheet();
    setSheet(null);
  };

  const handlePress = (button: ActionSheetButton) => {
    close();
    if (button.style !== 'cancel') {
      void Promise.resolve(button.onPress?.());
    }
  };

  return (
    <Modal visible={!!sheet} transparent animationType="fade" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close}>
        <Pressable style={[styles.sheet, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
          {sheet ? (
            <>
              <Text style={[styles.title, { color: colors.text }]}>{sheet.title}</Text>
              {sheet.message ? (
                <Text style={[styles.message, { color: colors.textMuted }]}>{sheet.message}</Text>
              ) : null}
              {sheet.buttons.map((button) => (
                <Pressable
                  key={button.text}
                  style={[styles.button, { borderTopColor: colors.border }]}
                  onPress={() => handlePress(button)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color:
                          button.style === 'destructive'
                            ? '#ff6b6b'
                            : button.style === 'cancel'
                              ? colors.textMuted
                              : colors.text,
                      },
                      button.style === 'cancel' && styles.cancelText,
                    ]}
                  >
                    {button.text}
                  </Text>
                </Pressable>
              ))}
            </>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    lineHeight: 20,
  },
  button: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelText: {
    fontWeight: '500',
  },
});
