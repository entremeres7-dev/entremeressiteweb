import React, { useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const COLORS = ['#ff6a88', '#ff88a0', '#ffb3c1', '#ffffff', '#ffc9d4', '#e84393'];

type Particle = {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  drift: number;
  rotate: number;
};

type Props = {
  active: boolean;
};

export function ConfettiBurst({ active }: Props) {
  const { width, height } = Dimensions.get('window');
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 48 }, (_, id) => ({
        id,
        x: Math.random() * width,
        delay: Math.random() * 350,
        duration: 1600 + Math.random() * 1400,
        size: 5 + Math.random() * 9,
        color: COLORS[id % COLORS.length],
        drift: -40 + Math.random() * 80,
        rotate: Math.random() * 360,
      })),
    [width],
  );

  const anims = useRef(particles.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (!active) {
      anims.forEach((v) => v.setValue(0));
      return;
    }

    const runs = anims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: particles[index].duration,
        delay: particles[index].delay,
        useNativeDriver: true,
      }),
    );

    Animated.stagger(12, runs).start();
  }, [active, anims, particles]);

  if (!active) return null;

  return (
    <View style={styles.layer} pointerEvents="none">
      {particles.map((p, index) => {
        const progress = anims[index];
        const translateY = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, height + 40],
        });
        const translateX = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, p.drift],
        });
        const rotate = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [`${p.rotate}deg`, `${p.rotate + 720}deg`],
        });
        const opacity = progress.interpolate({
          inputRange: [0, 0.08, 0.85, 1],
          outputRange: [0, 1, 1, 0],
        });

        return (
          <Animated.View
            key={p.id}
            style={[
              styles.piece,
              {
                left: p.x,
                width: p.size,
                height: p.size * 0.55,
                backgroundColor: p.color,
                opacity,
                transform: [{ translateY }, { translateX }, { rotate }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    overflow: 'hidden',
  },
  piece: {
    position: 'absolute',
    top: 0,
    borderRadius: 2,
  },
});
