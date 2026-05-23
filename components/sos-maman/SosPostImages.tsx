import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  urls: string[];
  compact?: boolean;
};

const SCREEN_W = Dimensions.get('window').width;

export function SosPostImages({ urls, compact }: Props) {
  const { colors } = useTheme();
  const [fullscreen, setFullscreen] = useState<string | null>(null);

  if (!urls.length) return null;

  const thumbH = compact ? 140 : 200;
  const thumbW = urls.length === 1 ? SCREEN_W - (compact ? 64 : 32) : 160;

  return (
    <>
      <View style={[styles.row, compact && styles.rowCompact]}>
        {urls.map((url) => (
          <TouchableOpacity
            key={url}
            activeOpacity={0.9}
            onPress={() => setFullscreen(url)}
            accessibilityLabel="Voir la photo en grand"
          >
            <Image
              source={{ uri: url }}
              style={[
                styles.thumb,
                { width: thumbW, height: thumbH },
                urls.length === 1 && styles.thumbSingle,
              ]}
              contentFit="cover"
            />
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={!!fullscreen} transparent animationType="fade" onRequestClose={() => setFullscreen(null)}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setFullscreen(null)}>
            <Ionicons name="close" size={28} color={colors.white} />
          </TouchableOpacity>
          {fullscreen ? (
            <Image source={{ uri: fullscreen }} style={styles.full} contentFit="contain" />
          ) : null}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  rowCompact: {
    marginTop: 8,
  },
  thumb: {
    borderRadius: 10,
    backgroundColor: '#2a2a2a',
  },
  thumbSingle: {
    maxWidth: '100%',
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 2,
    padding: 8,
  },
  full: {
    width: '100%',
    height: '80%',
  },
});
