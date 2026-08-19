import { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import IronHeader from '../components/IronHeader';
import ScrollFloat from '../components/ScrollFloat';
import { typography, spacing, radius } from '../theme';
import { useThemeMode, type ThemeMode } from '../hooks/useThemeMode';
import { useWeightUnitPreference, type WeightUnit } from '../hooks/useWeightUnitPreference';

const WEIGHT_UNITS: { id: WeightUnit; label: string; sub: string }[] = [
  { id: 'LBS', label: 'LBS', sub: 'Pounds' },
  { id: 'KG', label: 'KG', sub: 'Kilograms' },
];

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useThemeMode();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { weightUnit, setWeightUnit } = useWeightUnitPreference();
  const { mode, setThemeMode } = useThemeMode();

  return (
    <View style={styles.screen}>
      <IronHeader title="SETTINGS" showBack onBackPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <ScrollFloat textStyle={styles.pageTitle} duration={1200} distance={20} stagger={0.045}>
          PREFERENCES
        </ScrollFloat>

        <View style={styles.card}>
          <Text style={styles.label}>APPEARANCE</Text>
          <Text style={styles.hint}>Choose how the Gymcom app looks.</Text>
          <View style={styles.optionRow}>
            {(['dark', 'light'] as ThemeMode[]).map((id) => {
              const active = mode === id;
              const meta = id === 'dark' ? { label: 'DARK', sub: 'Iron Room' } : { label: 'LIGHT', sub: 'The Iron Room' };
              return (
                <TouchableOpacity
                  key={id}
                  style={[styles.option, active && styles.optionActive]}
                  activeOpacity={0.85}
                  onPress={() => setThemeMode(id)}
                >
                  <View style={[styles.checkbox, active && styles.checkboxActive]}>
                    {active && <MaterialIcons name="check" size={14} color={colors.onPrimary} />}
                  </View>
                  <View>
                    <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{meta.label}</Text>
                    <Text style={styles.optionSub}>{meta.sub}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>WEIGHT UNIT</Text>
          <Text style={styles.hint}>Used for logging set weight during workouts.</Text>
          <View style={styles.optionRow}>
            {WEIGHT_UNITS.map((opt) => {
              const active = weightUnit === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.option, active && styles.optionActive]}
                  activeOpacity={0.85}
                  onPress={() => setWeightUnit(opt.id)}
                >
                  <View style={[styles.checkbox, active && styles.checkboxActive]}>
                    {active && <MaterialIcons name="check" size={14} color={colors.onPrimary} />}
                  </View>
                  <View>
                    <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{opt.label}</Text>
                    <Text style={styles.optionSub}>{opt.sub}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const makeStyles = (colors: ReturnType<typeof useThemeMode>['colors']) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.surface },
    content: { padding: spacing.marginMobile, gap: spacing.stackMd },
    pageTitle: { ...typography.displayXl, fontSize: 32, lineHeight: 38, color: colors.onSurface, textTransform: 'uppercase' },
    card: {
      backgroundColor: colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radius.md,
      padding: spacing.gutter,
      gap: 4,
    },
    label: { ...typography.labelCaps, color: colors.primary },
    hint: { ...typography.bodyMd, fontSize: 12, color: colors.onSurfaceVariant, marginBottom: spacing.stackSm },
    optionRow: { flexDirection: 'row', gap: spacing.stackSm },
    option: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radius.sm,
      backgroundColor: colors.surfaceContainerLowest,
      paddingVertical: 12,
      paddingHorizontal: 12,
    },
    optionActive: { borderColor: colors.primary, backgroundColor: 'rgba(233,193,118,0.08)' },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 1.5,
      borderColor: colors.outline,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    optionLabel: { ...typography.headlineMd, fontSize: 15, color: colors.onSurface },
    optionLabelActive: { color: colors.primary },
    optionSub: { ...typography.bodyMd, fontSize: 11, color: colors.onSurfaceVariant },
  });
