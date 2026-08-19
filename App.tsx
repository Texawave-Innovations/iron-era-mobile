import { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts as useOswaldFonts,
  Oswald_500Medium,
  Oswald_600SemiBold,
  Oswald_700Bold,
} from '@expo-google-fonts/oswald';
import { useFonts as useInterFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';

import RootNavigator from './navigation/RootNavigator';
import LaunchScreen from './components/LaunchScreen';
import { WeightUnitProvider } from './hooks/useWeightUnitPreference';
import { ThemeModeProvider, useThemeMode } from './hooks/useThemeMode';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { colors, mode } = useThemeMode();

  const navTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.surface,
      card: colors.surface,
      border: colors.outlineVariant,
      primary: colors.primary,
      text: colors.onSurface,
    },
  };

  return (
    <SafeAreaProvider>
      <WeightUnitProvider>
        <NavigationContainer theme={navTheme}>
          <RootNavigator />
          <StatusBar style={mode === 'light' ? 'dark' : 'light'} />
        </NavigationContainer>
      </WeightUnitProvider>
    </SafeAreaProvider>
  );
}

export default function App() {
  const [oswaldLoaded] = useOswaldFonts({ Oswald_500Medium, Oswald_600SemiBold, Oswald_700Bold });
  const [interLoaded] = useInterFonts({ Inter_400Regular, Inter_700Bold });
  const fontsLoaded = oswaldLoaded && interLoaded;
  const nativeSplashHidden = useRef(false);

  useEffect(() => {
    if (!nativeSplashHidden.current) {
      nativeSplashHidden.current = true;
      SplashScreen.hideAsync();
    }
  }, []);

  if (!fontsLoaded) return <LaunchScreen />;

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webWrapper}>
        <View style={styles.phoneFrame}>
          <ThemeModeProvider>
            <AppContent />
          </ThemeModeProvider>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ThemeModeProvider>
        <AppContent />
      </ThemeModeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh' as any,
  },
  phoneFrame: {
    width: 390,
    height: 844,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 10,
    borderColor: '#1a1a1a',
    // @ts-ignore web-only shadow
    boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
  },
});
