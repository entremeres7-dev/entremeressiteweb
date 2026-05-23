import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

type Props = {
  name: string;
  tierEmoji?: string | null;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

/** Pseudo + emoji de palier gamification (🌸 👑 💎). */
export function DisplayNameWithTier({ name, tierEmoji, style, numberOfLines }: Props) {
  const label = tierEmoji ? `${name} ${tierEmoji}` : name;
  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {label}
    </Text>
  );
}
