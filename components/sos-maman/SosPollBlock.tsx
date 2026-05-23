import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { AppColors } from '@/constants/themes';
import { isLightTheme } from '@/constants/themeUtils';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { SosMamanPollOption } from '@/lib/sos-maman/types';

type Props = {
  options: SosMamanPollOption[];
  totalVotes: number;
  userOptionId?: string | null;
  onVote?: (optionId: string) => void;
  compact?: boolean;
};

export function SosPollBlock({ options, totalVotes, userOptionId, onVote, compact }: Props) {
  const styles = useThemedStyles(buildStyles);
  if (!options.length) return null;

  return (
    <View style={styles.wrap}>
      {options.map((opt) => {
        const pct = totalVotes > 0 ? Math.round((opt.votes_count / totalVotes) * 100) : 0;
        const selected = userOptionId === opt.id;
        const Row = onVote ? TouchableOpacity : View;
        return (
          <Row
            key={opt.id}
            style={[styles.option, selected && styles.optionSelected]}
            onPress={onVote ? () => onVote(opt.id) : undefined}
            activeOpacity={0.85}
            disabled={!onVote}
          >
            {!compact && totalVotes > 0 ? (
              <View style={[styles.fill, { width: `${pct}%` }, selected && styles.fillSelected]} />
            ) : null}
            <View style={styles.optionInner}>
              <Text style={[styles.label, selected && styles.labelSelected]} numberOfLines={2}>
                {opt.label}
              </Text>
              {!compact ? (
                <Text style={styles.pct}>
                  {totalVotes > 0 ? `${pct}%` : '—'} · {opt.votes_count} vote{opt.votes_count !== 1 ? 's' : ''}
                </Text>
              ) : (
                <Text style={styles.pctCompact}>{opt.votes_count} vote{opt.votes_count !== 1 ? 's' : ''}</Text>
              )}
            </View>
          </Row>
        );
      })}
      <Text style={styles.total}>
        {totalVotes} maman{totalVotes !== 1 ? 's' : ''} ont voté
        {userOptionId ? '' : onVote ? ' · Touchez pour voter' : ''}
      </Text>
    </View>
  );
}

function buildStyles(c: AppColors) {
  const light = isLightTheme(c.bg);
  return StyleSheet.create({
    wrap: { gap: 8, marginTop: 4 },
    option: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      overflow: 'hidden',
      backgroundColor: light ? c.surface : c.card,
    },
    optionSelected: { borderColor: c.pink },
    fill: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      backgroundColor: light ? c.pinkSoft : 'rgba(255,106,136,0.15)',
    },
    fillSelected: { backgroundColor: light ? '#EFC8D6' : 'rgba(255,106,136,0.28)' },
    optionInner: { padding: 12, zIndex: 1 },
    label: { color: c.text, fontSize: 14, fontWeight: '600' },
    labelSelected: { color: c.text, fontWeight: '700' },
    pct: { color: c.textMuted, fontSize: 12, marginTop: 4 },
    pctCompact: { color: c.pink, fontSize: 11, marginTop: 2 },
    total: { color: c.textMuted, fontSize: 12, marginTop: 4 },
  });
}
