import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors, type ThemeColors } from '../theme';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'preference:themeMode';

type ThemeModeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark') setModeState(stored);
    });
  }, []);

  const setThemeMode = (nextMode: ThemeMode) => {
    setModeState(nextMode);
    AsyncStorage.setItem(STORAGE_KEY, nextMode).catch(() => {});
  };

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      colors: mode === 'light' ? lightColors : darkColors,
      setThemeMode,
    }),
    [mode]
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within a ThemeModeProvider');
  return ctx;
}
