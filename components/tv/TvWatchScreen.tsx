import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { TV_COLORS } from '@/constants/tvColors';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { SOS_MAMAN_EPISODE_1 } from '@/constants/sosMamanEpisode';
import { TV_AVAILABILITY_LABEL, TV_STREAMING_ENABLED } from '@/lib/tv/availability';

type Props = {
  showTitle?: string;
  episodeLabel?: string;
  episodeTitle?: string;
  episodeSubtitle?: string;
  videoUri?: string | null;
};

function TvVideoLayer({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    p.play();
  });

  return (
    <VideoView style={StyleSheet.absoluteFill} player={player} contentFit="contain" nativeControls={false} />
  );
}

export function TvWatchScreen({
  showTitle = SOS_MAMAN_EPISODE_1.showTitle,
  episodeLabel = `Épisode ${SOS_MAMAN_EPISODE_1.episodeNumber}`,
  episodeTitle = SOS_MAMAN_EPISODE_1.episodeTitle,
  episodeSubtitle = SOS_MAMAN_EPISODE_1.episodeSubtitle,
  videoUri = SOS_MAMAN_EPISODE_1.videoUrl,
}: Props) {
  const styles = useThemedStyles(buildStyles);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const hasVideo = TV_STREAMING_ENABLED && Boolean(videoUri?.trim());

  useEffect(() => {
    if (!showControls) return;
    const t = setTimeout(() => setShowControls(false), 4000);
    return () => clearTimeout(t);
  }, [showControls]);

  const toggleControls = () => setShowControls((v) => !v);

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" hidden={!showControls} />

      {hasVideo && isPlaying ? (
        <TvVideoLayer uri={videoUri!} />
      ) : (
        <Image source={SOS_MAMAN_EPISODE_1.poster} style={StyleSheet.absoluteFill} contentFit="cover" />
      )}

      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'transparent', 'transparent', 'rgba(0,0,0,0.85)']}
        locations={[0, 0.25, 0.6, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <Pressable style={StyleSheet.absoluteFill} onPress={toggleControls} />

      {showControls && (
        <>
          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity onPress={handleClose} style={styles.backBtn} accessibilityLabel="Fermer">
              <Ionicons name="chevron-down" size={28} color={TV_COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.topTitle} numberOfLines={1}>
              {showTitle}
            </Text>
            <View style={{ width: 44 }} />
          </View>

          <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <Text style={styles.episodeLabel}>{episodeLabel}</Text>
            <Text style={styles.episodeTitle}>{episodeTitle}</Text>
            <Text style={styles.episodeSubtitle}>{episodeSubtitle}</Text>

            {!hasVideo && isPlaying ? (
              <View style={styles.noVideoBox}>
                <Text style={styles.noVideoTitle}>Disponible le {TV_AVAILABILITY_LABEL}</Text>
                <Text style={styles.noVideoText}>
                  Cet épisode sera accessible sur EntreMeres TV à partir du {TV_AVAILABILITY_LABEL}.
                </Text>
                <TouchableOpacity style={styles.noVideoBtn} onPress={handleClose}>
                  <Text style={styles.noVideoBtnText}>Retour</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {hasVideo && isPlaying ? (
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: '8%' }]} />
              </View>
            ) : null}
          </View>
        </>
      )}
    </View>
  );
}

function buildStyles(c: AppColors) {
  return StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    zIndex: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  episodeLabel: {
    color: c.pink,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  episodeTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  episodeSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: c.pink,
  },
  noVideoBox: {
    marginTop: 16,
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
  },
  noVideoTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  noVideoText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    lineHeight: 20,
  },
  noVideoBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: c.pink,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  noVideoBtnText: {
    color: c.onPink,
    fontWeight: '700',
  },
  });
}
