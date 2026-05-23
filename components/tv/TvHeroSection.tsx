import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { isLightTheme } from '@/constants/themeUtils';
import { useTheme } from '@/context/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { TV_HERO_SLIDES, TV_THUMBS, type TvHeroSlide } from '@/lib/tv/catalog';

type Props = {
  onWatch?: (slide: TvHeroSlide) => void;
  onAddToList?: (slide: TvHeroSlide) => void;
};

export function TvHeroSection({ onWatch, onAddToList }: Props) {
  const { colors, isLight } = useTheme();
  const styles = useThemedStyles(buildStyles);
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = TV_HERO_SLIDES[activeSlide];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((i) => (i + 1) % TV_HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.heroContainer}>
      <Image
        source={TV_THUMBS[slide.thumb]}
        style={styles.heroImage}
        contentFit="cover"
        contentPosition="top"
      />

      <LinearGradient
        colors={
          isLight
            ? ['rgba(255,255,255,0)', 'rgba(237,230,225,0.8)', colors.bg]
            : ['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.55)', 'rgba(13,13,13,0.95)']
        }
        style={styles.heroGradientBottom}
      />

      <View style={styles.heroContent}>
        <Text style={styles.heroTags}>{slide.tags}</Text>
        <Text style={styles.heroTitle}>{slide.title}</Text>
        <Text style={styles.heroSubtitle}>{slide.hook}</Text>

        <View style={styles.heroButtons}>
          <TouchableOpacity
            style={styles.watchBtn}
            onPress={() => onWatch?.(slide)}
            activeOpacity={0.85}
          >
            <Ionicons name="play" size={18} color={colors.onPink} />
            <Text style={styles.watchBtnText}>Regarder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.myListBtn}
            onPress={() => onAddToList?.(slide)}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={18} color={isLight ? colors.text : colors.onPink} />
            <Text style={styles.myListBtnText}>Ma liste</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heroEpisode}>{slide.episode}</Text>

        <View style={styles.dotIndicators}>
          {TV_HERO_SLIDES.map((s, i) => (
            <TouchableOpacity
              key={s.id}
              onPress={() => setActiveSlide(i)}
              style={[styles.dot, i === activeSlide && styles.dotActive]}
              accessibilityLabel={`Diapositive ${i + 1} sur ${TV_HERO_SLIDES.length}`}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

function buildStyles(c: AppColors) {
  const light = isLightTheme(c.bg);
  return StyleSheet.create({
    heroContainer: {
      width: '100%',
      height: 360,
      position: 'relative',
      overflow: 'hidden',
    },
    heroImage: {
      ...StyleSheet.absoluteFillObject,
    },
    heroGradientBottom: {
      ...StyleSheet.absoluteFillObject,
    },
    heroContent: {
      position: 'absolute',
      bottom: 24,
      left: 16,
      right: 16,
      zIndex: 2,
    },
    heroTags: {
      color: light ? c.textSecondary : 'rgba(255,255,255,0.72)',
      fontSize: 12,
      marginBottom: 6,
    },
    heroTitle: {
      color: light ? c.text : c.white,
      fontSize: 30,
      fontWeight: '900',
      lineHeight: 34,
      letterSpacing: 0.5,
      textShadowColor: light ? 'rgba(45,37,39,0.12)' : 'rgba(0,0,0,0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: light ? 3 : 6,
    },
    heroSubtitle: {
      color: light ? c.textSecondary : c.grayLight,
      fontSize: 12,
      marginTop: 6,
      lineHeight: 16,
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },
    heroEpisode: {
      color: light ? c.textMuted : 'rgba(255,255,255,0.65)',
      fontSize: 12,
      marginTop: 10,
    },
    heroButtons: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 14,
    },
    watchBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.pink,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 6,
      gap: 6,
    },
    watchBtnText: {
      color: c.onPink,
      fontSize: 13,
      fontWeight: '700',
    },
    myListBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: light ? c.text : c.white,
      backgroundColor: light ? 'rgba(250,247,244,0.55)' : 'transparent',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 6,
      gap: 4,
    },
    myListBtnText: {
      color: light ? c.text : c.white,
      fontSize: 13,
      fontWeight: '600',
    },
    dotIndicators: {
      flexDirection: 'row',
      gap: 6,
      marginTop: 14,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: c.textMuted,
    },
    dotActive: {
      backgroundColor: light ? c.pink : c.white,
      width: 18,
    },
  });
}
