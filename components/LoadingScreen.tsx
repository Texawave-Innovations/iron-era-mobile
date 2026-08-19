import { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { typography, spacing } from '../theme';
import { useThemeMode } from '../hooks/useThemeMode';

type Props = {
  label?: string;
};

export default function LoadingScreen({ label = 'LOADING…' }: Props) {
  const { colors } = useThemeMode();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1100, easing: Easing.linear, useNativeDriver: true })
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    spinLoop.start();
    pulseLoop.start();
    return () => {
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.loadingScreen}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <MaterialIcons name="fitness-center" size={44} color={colors.primary} />
      </Animated.View>
      <Animated.Text style={[styles.loadingText, { opacity: pulse }]}>{label}</Animated.Text>
    </View>
  );
}

const makeStyles = (colors: ReturnType<typeof useThemeMode>['colors']) => StyleSheet.create({
  loadingScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.stackMd },
  loadingText: { ...typography.labelCaps, letterSpacing: 3, color: colors.onSurfaceVariant },
});
