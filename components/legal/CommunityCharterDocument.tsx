import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { AppColors } from '@/constants/themes';
import {
  CHARTER_LAST_UPDATE,
  CHARTER_SECTIONS,
  CHARTER_VERSION,
} from '@/constants/communityCharterContent';

type Props = {
  colors: AppColors;
  showIntro?: boolean;
};

export function CommunityCharterDocument({ colors, showIntro = true }: Props) {
  const styles = createStyles(colors);

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.brand}>EntreMeres</Text>
        <Text style={styles.title}>Charte de respect de la communauté</Text>
        <Text style={styles.meta}>
          Version {CHARTER_VERSION} · Mise à jour {CHARTER_LAST_UPDATE}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
      >
        {showIntro ? (
          <Text style={styles.intro}>
            Bienvenue dans la communauté. Merci de lire cette charte : elle fixe les règles
            d’entraide et de respect qui protègent toutes les mamans ici.
          </Text>
        ) : null}

        {CHARTER_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.paragraphs.map((p, i) => (
              <Text key={i} style={styles.paragraph}>
                {p}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
    wrap: { flex: 1 },
    header: {
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
      backgroundColor: c.card,
    },
    brand: {
      color: c.pink,
      fontSize: 13,
      fontWeight: '800',
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    title: {
      color: c.text,
      fontSize: 22,
      fontWeight: '800',
      marginTop: 8,
      lineHeight: 28,
    },
    meta: {
      color: c.textMuted,
      fontSize: 12,
      marginTop: 6,
    },
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 32,
    },
    intro: {
      color: c.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 20,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      color: c.text,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 8,
    },
    paragraph: {
      color: c.textSecondary,
      fontSize: 14,
      lineHeight: 21,
      marginBottom: 10,
    },
  });
}
