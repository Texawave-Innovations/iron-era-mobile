import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export type ScrollFloatHandle = {
  setProgress: (p: number) => void;
  triggerAnimation: () => void;
};

type Props = {
  children: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  stagger?: number;
  distance?: number;
  duration?: number;
  delay?: number;
  autoAnimate?: boolean;
};

/**
 * Text animation component: splits text into characters and smoothly animates
 * opacity/scale/translateY. Re-triggers whenever the host screen gains focus.
 */
const ScrollFloat = forwardRef<ScrollFloatHandle, Props>(
  (
    {
      children,
      containerStyle,
      textStyle,
      stagger = 0.045,
      distance = 20,
      duration = 1400,
      delay = 100,
      autoAnimate = true,
    },
    ref
  ) => {
    const isFocused = useIsFocused();
    const anchor = useRef(new Animated.Value(0)).current;

    // Split text into lines, then characters for full layout control
    const lines = useMemo(() => children.split('\n'), [children]);

    // Flat index tracking for values
    const flatCharsCount = useMemo(() => {
      return lines.reduce((acc, line) => acc + line.length, 0);
    }, [lines]);

    const valuesRef = useRef(
      Array.from({ length: flatCharsCount }, () => new Animated.Value(0))
    );

    if (valuesRef.current.length !== flatCharsCount) {
      valuesRef.current = Array.from({ length: flatCharsCount }, () => new Animated.Value(0));
    }

    const setProgress = (p: number) => {
      const n = flatCharsCount;
      const totalStagger = stagger * Math.max(n - 1, 1);
      valuesRef.current.forEach((v, i) => {
        const raw = p * (1 + totalStagger) - i * stagger;
        v.setValue(Math.min(Math.max(raw, 0), 1));
      });
    };

    const triggerAnimation = () => {
      anchor.setValue(0);
      setProgress(0);
      Animated.timing(anchor, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: false,
      }).start();
    };

    useImperativeHandle(ref, () => ({
      setProgress,
      triggerAnimation,
    }));

    useEffect(() => {
      const listenerId = anchor.addListener(({ value }) => {
        setProgress(value);
      });
      return () => {
        anchor.removeListener(listenerId);
      };
    }, [flatCharsCount, stagger]);

    useEffect(() => {
      if (autoAnimate && isFocused) {
        triggerAnimation();
      } else if (!isFocused) {
        anchor.setValue(0);
        setProgress(0);
      }
    }, [isFocused, autoAnimate, duration, delay]);

    let globalCharIndex = 0;

    const renderChar = (ch: string, charIdx: number) => {
      const v = valuesRef.current[charIdx] || new Animated.Value(0);
      return (
        <Animated.Text
          key={charIdx}
          style={[
            textStyle,
            {
              opacity: v,
              transform: [
                { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) },
                { scaleY: v.interpolate({ inputRange: [0, 1], outputRange: [2.2, 1] }) },
                { scaleX: v.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) },
              ],
            },
          ]}
        >
          {ch}
        </Animated.Text>
      );
    };

    return (
      <View style={[styles.column, containerStyle]}>
        {lines.map((line, lineIdx) => (
          <Animated.View key={lineIdx} style={styles.row}>
            {line.split(/(\s+)/).filter((w) => w.length > 0).map((word, wordIdx) => {
              const isSpace = /^\s+$/.test(word);
              if (isSpace) {
                return (
                  <Animated.Text key={`sp-${wordIdx}`} style={textStyle}>
                    {word}
                  </Animated.Text>
                );
              }
              return (
                <View key={`w-${wordIdx}`} style={styles.word}>
                  {word.split('').map((ch) => {
                    const charIdx = globalCharIndex++;
                    return renderChar(ch, charIdx);
                  })}
                </View>
              );
            })}
          </Animated.View>
        ))}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  column: { flexDirection: 'column' },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  word: { flexDirection: 'row' },
});

export default ScrollFloat;

