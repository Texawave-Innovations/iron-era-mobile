import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';

export type RevealHandle = { reveal: () => void };

type Props = {
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  duration?: number;
  delay?: number;
  scale?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

const RevealOnScroll = forwardRef<RevealHandle, Props>(
  ({ distance = 50, direction = 'vertical', reverse = false, duration = 600, delay = 0, scale = 1, style, children }, ref) => {
    const progress = useRef(new Animated.Value(0)).current;
    const played = useRef(false);

    useImperativeHandle(ref, () => ({
      reveal: () => {
        if (played.current) return;
        played.current = true;
        Animated.timing(progress, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      },
    }));

    const offset = reverse ? -distance : distance;
    const translate = progress.interpolate({ inputRange: [0, 1], outputRange: [offset, 0] });
    const opacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
    const scaleValue = progress.interpolate({ inputRange: [0, 1], outputRange: [scale === 1 ? 0.94 : scale, 1] });

    const transform =
      direction === 'horizontal'
        ? [{ translateX: translate }, { scale: scaleValue }]
        : [{ translateY: translate }, { scale: scaleValue }];

    return <Animated.View style={[style, { opacity, transform }]}>{children}</Animated.View>;
  }
);

export default RevealOnScroll;
