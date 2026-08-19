import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { darkColors as colors } from '../theme';

export default function LaunchScreen() {
  const enter = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 3000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [enter, breathe]);

  const enterScale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] });
  const enterTranslateY = enter.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });
  const breatheScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] });

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={[colors.surfaceContainerLowest, 'rgba(19,19,19,0.6)', colors.surfaceContainerLowest]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.center}>
        <Animated.View
          style={{
            opacity: enter,
            transform: [{ scale: Animated.multiply(enterScale, breatheScale) }, { translateY: enterTranslateY }],
          }}
        >
          <Image source={require('../assets/gymcom-icon.png')} style={styles.logo} resizeMode="cover" />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 192,
    height: 192,
    borderRadius: 6,
  },
});
