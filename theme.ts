export const darkColors = {
  surface: '#131313',
  surfaceDim: '#131313',
  surfaceBright: '#393939',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainer: '#201f1f',
  surfaceContainerHigh: '#2a2a2a',
  surfaceContainerHighest: '#353534',
  onSurface: '#e5e2e1',
  onSurfaceVariant: '#d1c5b4',
  outline: '#9a8f80',
  outlineVariant: '#4e4639',
  primary: '#e9c176',
  onPrimary: '#412d00',
  primaryFixedDim: '#c5a059',
  secondary: '#c6c6c7',
  secondaryContainer: '#454748',
  onSecondaryContainer: '#b5b5b6',
  error: '#ffb4ab',
  background: '#131313',
  matteBlack: '#131313',
  charcoal: '#201f1f',
  agedGold: '#e9c176',
  steelGray: '#4e4639',
};

export const lightColors = {
  surface: '#FBF9F4',
  surfaceDim: '#e5e2e1',
  surfaceBright: '#ffffff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f6f3eb',
  surfaceContainer: '#ffffff',
  surfaceContainerHigh: '#f0ebe1',
  surfaceContainerHighest: '#e5e2e1',
  onSurface: '#131313',
  onSurfaceVariant: '#4e4639',
  outline: '#d1c5b4',
  outlineVariant: '#d1c5b4',
  primary: '#c5a059',
  onPrimary: '#ffffff',
  primaryFixedDim: '#e9c176',
  secondary: '#c6c6c7',
  secondaryContainer: '#e3e2e3',
  onSecondaryContainer: '#2f3132',
  error: '#ffb4ab',
  background: '#FBF9F4',
  matteBlack: '#131313',
  charcoal: '#131313',
  agedGold: '#c5a059',
  steelGray: '#4e4639',
};

export type ThemeColors = typeof darkColors;

export const typography = {
  displayXl: { fontFamily: 'Oswald_700Bold', fontSize: 64, lineHeight: 74, letterSpacing: -1 },
  headlineLg: { fontFamily: 'Oswald_700Bold', fontSize: 40, lineHeight: 48, letterSpacing: -0.5 },
  headlineLgMobile: { fontFamily: 'Oswald_700Bold', fontSize: 32, lineHeight: 40, letterSpacing: -0.3 },
  headlineMd: { fontFamily: 'Oswald_600SemiBold', fontSize: 22, lineHeight: 30 },
  bodyLg: { fontFamily: 'Inter_400Regular', fontSize: 18, lineHeight: 28 },
  bodyMd: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 23 },
  labelCaps: { fontFamily: 'Oswald_600SemiBold', fontSize: 12, lineHeight: 20, letterSpacing: 1.8, textTransform: 'uppercase' as const },
  statsNum: { fontFamily: 'Oswald_700Bold', fontSize: 30, lineHeight: 38, letterSpacing: -0.5 },
};

export const spacing = {
  unit: 4,
  gutter: 16,
  marginMobile: 20,
  stackSm: 8,
  stackMd: 24,
  stackLg: 56,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
};
