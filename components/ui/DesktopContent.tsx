import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

type Props = {
  children: React.ReactNode;
  /** Largeur max du contenu — défaut selon breakpoint */
  maxWidth?: number;
  style?: StyleProp<ViewStyle>;
  flex?: boolean;
};

/** Centre le contenu sur grand écran (aligné sur le site web). */
export function DesktopContent({ children, maxWidth, style, flex = true }: Props) {
  const { contentMaxWidth, horizontalPadding } = useResponsiveLayout();

  return (
    <View
      style={[
        {
          width: '100%',
          maxWidth: maxWidth ?? contentMaxWidth,
          alignSelf: 'center',
          paddingHorizontal: horizontalPadding,
          ...(flex ? { flex: 1 } : null),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
