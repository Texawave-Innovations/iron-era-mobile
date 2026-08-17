import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import IronHeader from '../components/IronHeader';
import ScrollFloat from '../components/ScrollFloat';
import { colors, typography, spacing, radius } from '../theme';
import { useAnonymousAuth } from '../hooks/useAnonymousAuth';
import { getUserStats } from '../data/userStats';

type Wizard = 'metrics' | 'calories';
type UnitSystem = 'metric' | 'imperial';
type Gender = 'MALE' | 'FEMALE';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

const ACTIVITY_LEVELS: { key: ActivityLevel; label: string; multiplier: number }[] = [
  { key: 'sedentary', label: 'SEDENTARY', multiplier: 1.2 },
  { key: 'light', label: 'LIGHT', multiplier: 1.375 },
  { key: 'moderate', label: 'MODERATE', multiplier: 1.55 },
  { key: 'active', label: 'ACTIVE', multiplier: 1.725 },
  { key: 'veryActive', label: 'VERY ACTIVE', multiplier: 1.9 },
];

function toNumber(value: string) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : NaN;
}

function isValid(...values: string[]) {
  return values.every((v) => v.trim() !== '' && Number.isFinite(toNumber(v)) && toNumber(v) > 0);
}

function toKg(value: number, unit: UnitSystem) {
  return unit === 'imperial' ? value * 0.453592 : value;
}

function toCm(value: number, unit: UnitSystem) {
  return unit === 'imperial' ? value * 2.54 : value;
}

function kgToLbs(kg: number) {
  return kg * 2.20462;
}

function cmToIn(cm: number) {
  return cm / 2.54;
}

function convertWeightField(value: string, from: UnitSystem, to: UnitSystem) {
  const n = toNumber(value);
  if (!Number.isFinite(n)) return value;
  if (from === to) return value;
  const kg = toKg(n, from);
  const converted = to === 'imperial' ? kgToLbs(kg) : kg;
  return String(parseFloat(converted.toFixed(1)));
}

function convertLengthField(value: string, from: UnitSystem, to: UnitSystem) {
  const n = toNumber(value);
  if (!Number.isFinite(n)) return value;
  if (from === to) return value;
  const cm = toCm(n, from);
  const converted = to === 'imperial' ? cmToIn(cm) : cm;
  return String(parseFloat(converted.toFixed(1)));
}

function cmToFeetInches(cm: number) {
  const totalInches = Math.round(cm / 2.54);
  return { feet: Math.floor(totalInches / 12), inches: totalInches % 12 };
}

function feetInchesToCm(feet: number, inches: number) {
  return Math.round((feet * 12 + inches) * 2.54);
}

function getBMICategory(bmi: number) {
  if (bmi < 18.5) return { text: 'UNDERWEIGHT', color: '#4FACFE' };
  if (bmi < 25) return { text: 'NORMAL', color: '#7cb87c' };
  if (bmi < 30) return { text: 'OVERWEIGHT', color: colors.primary };
  return { text: 'OBESE', color: colors.error };
}

function getWHRCategory(whr: number, gender: Gender) {
  const thresholds = gender === 'MALE' ? [0.9, 1.0] : [0.8, 0.85];
  if (whr < thresholds[0]) return { text: 'LOW RISK', color: '#7cb87c' };
  if (whr < thresholds[1]) return { text: 'MODERATE RISK', color: colors.primary };
  return { text: 'HIGH RISK', color: colors.error };
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  suffix,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  suffix?: string;
}) {
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <View style={styles.fieldInputRow}>
        <TextInput
          style={styles.fieldInput}
          keyboardType="numeric"
          keyboardAppearance="dark"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? '0'}
          placeholderTextColor={colors.surfaceContainerHighest}
        />
        {suffix ? <Text style={styles.fieldSuffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

function HeightInput({
  height,
  onChangeHeight,
  unitSystem,
}: {
  height: string;
  onChangeHeight: (v: string) => void;
  unitSystem: UnitSystem;
}) {
  if (unitSystem === 'metric') {
    return <Field label="HEIGHT" value={height} onChangeText={onChangeHeight} suffix="CM" />;
  }

  const cm = toNumber(height);
  const { feet, inches } = cmToFeetInches(Number.isFinite(cm) ? cm : 0);
  const feetStr = height ? String(feet) : '';
  const inchesStr = height ? String(inches) : '';

  const setFeet = (v: string) => {
    const f = parseInt(v, 10) || 0;
    onChangeHeight(v.trim() === '' ? '' : String(feetInchesToCm(f, inches)));
  };
  const setInches = (v: string) => {
    const i = parseInt(v, 10) || 0;
    onChangeHeight(String(feetInchesToCm(feet, i)));
  };

  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>HEIGHT</Text>
      <View style={styles.fieldRow}>
        <Field label="" value={feetStr} onChangeText={setFeet} suffix="FT" />
        <Field label="" value={inchesStr} onChangeText={setInches} suffix="IN" />
      </View>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress} activeOpacity={0.75}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function ResultRow({ value, label, sub, color }: { value: string; label: string; sub?: string; color?: string }) {
  return (
    <View style={styles.result}>
      <Text style={[styles.resultValue, color ? { color } : null]}>{value}</Text>
      <Text style={styles.resultLabel}>{label}</Text>
      {sub ? <Text style={styles.resultSub}>{sub}</Text> : null}
    </View>
  );
}

function Card({ icon, title, children }: { icon: keyof typeof MaterialIcons.glyphMap; title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialIcons name={icon} size={18} color={colors.primary} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function ProgressScreen() {
  const { uid } = useAnonymousAuth();

  const [wizard, setWizard] = useState<Wizard>('metrics');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [gender, setGender] = useState<Gender>('MALE');

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('sedentary');

  const [bmi, setBmi] = useState<number | null>(null);
  const [leanMass, setLeanMass] = useState<number | null>(null);
  const [ibw, setIbw] = useState<number | null>(null);
  const [whr, setWhr] = useState<number | null>(null);
  const [bmr, setBmr] = useState<number | null>(null);
  const [dailyCalories, setDailyCalories] = useState<number | null>(null);

  useEffect(() => {
    if (!uid) return;
    getUserStats(uid).then((stats) => {
      if (!stats) return;
      if (stats.gender) setGender(stats.gender);
      if (stats.weightUnit) setUnitSystem(stats.weightUnit === 'LBS' ? 'imperial' : 'metric');
      if (stats.weight) setWeight(String(stats.weight));
      if (stats.height) setHeight(String(stats.height));
      if (stats.age) setAge(String(stats.age));
    }).catch(() => {});
  }, [uid]);

  const calculateBMI = () => {
    if (!isValid(weight, height)) return;
    const w = toKg(toNumber(weight), unitSystem);
    const h = toNumber(height) / 100;
    setBmi(parseFloat((w / (h * h)).toFixed(1)));
  };

  const calculateLeanAndIBW = () => {
    if (isValid(weight, bodyFat)) {
      const w = toKg(toNumber(weight), unitSystem);
      const bf = toNumber(bodyFat);
      setLeanMass(parseFloat((w * (1 - bf / 100)).toFixed(1)));
    }
    if (isValid(height)) {
      const h = toNumber(height);
      const baseHeight = gender === 'MALE' ? 152.4 : 149.86;
      const baseWeight = gender === 'MALE' ? 50 : 45.5;
      setIbw(parseFloat((baseWeight + (2.7 * (h - baseHeight)) / 2.54).toFixed(1)));
    }
  };

  const calculateWHR = () => {
    if (!isValid(waist, hip)) return;
    const w = toCm(toNumber(waist), unitSystem);
    const h = toCm(toNumber(hip), unitSystem);
    setWhr(parseFloat((w / h).toFixed(2)));
  };

  const calculateCalories = () => {
    if (!isValid(weight, height, age)) return;
    const w = toKg(toNumber(weight), unitSystem);
    const h = toNumber(height);
    const a = toNumber(age);
    const bmrResult =
      gender === 'MALE'
        ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
        : 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;
    const roundedBmr = Math.round(bmrResult);
    setBmr(roundedBmr);
    const multiplier = ACTIVITY_LEVELS.find((a2) => a2.key === activityLevel)!.multiplier;
    setDailyCalories(Math.round(roundedBmr * multiplier));
  };

  const weightUnitLabel = unitSystem === 'metric' ? 'KG' : 'LBS';
  const lengthUnitLabel = unitSystem === 'metric' ? 'CM' : 'IN';

  // Height is always stored internally in cm, so toggling KG/POUNDS only changes
  // how it's *displayed* (CM vs FT/IN) — the underlying value never changes.
  const handleUnitSystemChange = (next: UnitSystem) => {
    if (next === unitSystem) return;
    setWeight((prev) => convertWeightField(prev, unitSystem, next));
    setWaist((prev) => convertLengthField(prev, unitSystem, next));
    setHip((prev) => convertLengthField(prev, unitSystem, next));
    setUnitSystem(next);
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <IronHeader title="PROGRESS" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.pageHeader}>
          <ScrollFloat textStyle={styles.pageTitle} duration={1200} distance={20} stagger={0.045}>
            PROGRESS
          </ScrollFloat>
          <Text style={styles.pageSub}>TRACK YOUR BODY METRICS & DAILY ENERGY NEEDS</Text>
        </View>

        <View style={styles.wizardRow}>
          <TouchableOpacity
            style={[styles.wizardTab, wizard === 'metrics' && styles.wizardTabActive]}
            onPress={() => setWizard('metrics')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="straighten" size={16} color={wizard === 'metrics' ? colors.onPrimary : colors.onSurfaceVariant} />
            <Text style={[styles.wizardTabText, wizard === 'metrics' && styles.wizardTabTextActive]}>BODY METRICS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.wizardTab, wizard === 'calories' && styles.wizardTabActive]}
            onPress={() => setWizard('calories')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="local-fire-department" size={16} color={wizard === 'calories' ? colors.onPrimary : colors.onSurfaceVariant} />
            <Text style={[styles.wizardTabText, wizard === 'calories' && styles.wizardTabTextActive]}>CALORIE TRACKER</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.unitRow}>
          <Chip label="KG" active={unitSystem === 'metric'} onPress={() => handleUnitSystemChange('metric')} />
          <Chip label="POUNDS" active={unitSystem === 'imperial'} onPress={() => handleUnitSystemChange('imperial')} />
          <View style={styles.unitRowSpacer} />
          <Chip label="MALE" active={gender === 'MALE'} onPress={() => setGender('MALE')} />
          <Chip label="FEMALE" active={gender === 'FEMALE'} onPress={() => setGender('FEMALE')} />
        </View>
        <Text style={styles.unitHint}>
          KG = METRIC (WEIGHT IN KG, HEIGHT IN CM) · POUNDS = IMPERIAL (WEIGHT IN LBS, HEIGHT IN FT/IN)
        </Text>

        {wizard === 'metrics' ? (
          <>
            <Card icon="monitor-weight" title="BMI CALCULATOR">
              <Field label="WEIGHT" value={weight} onChangeText={setWeight} suffix={weightUnitLabel} />
              <HeightInput height={height} onChangeHeight={setHeight} unitSystem={unitSystem} />
              <TouchableOpacity style={styles.calcBtn} onPress={calculateBMI} activeOpacity={0.85}>
                <Text style={styles.calcBtnText}>CALCULATE BMI</Text>
                <MaterialIcons name="arrow-forward" size={16} color={colors.onPrimary} />
              </TouchableOpacity>
              {bmi !== null && (
                <ResultRow value={String(bmi)} label="BODY MASS INDEX" sub={getBMICategory(bmi).text} color={getBMICategory(bmi).color} />
              )}
            </Card>

            <Card icon="accessibility-new" title="LEAN MASS & IDEAL WEIGHT">
              <View style={styles.fieldRow}>
                <Field label="WEIGHT" value={weight} onChangeText={setWeight} suffix={weightUnitLabel} />
                <Field label="BODY FAT" value={bodyFat} onChangeText={setBodyFat} suffix="%" />
              </View>
              <HeightInput height={height} onChangeHeight={setHeight} unitSystem={unitSystem} />
              <TouchableOpacity style={styles.calcBtn} onPress={calculateLeanAndIBW} activeOpacity={0.85}>
                <Text style={styles.calcBtnText}>CALCULATE</Text>
                <MaterialIcons name="arrow-forward" size={16} color={colors.onPrimary} />
              </TouchableOpacity>
              <View style={styles.resultRowSplit}>
                {leanMass !== null && <ResultRow value={`${leanMass} KG`} label="LEAN BODY MASS" />}
                {ibw !== null && <ResultRow value={`${ibw} KG`} label="IDEAL BODY WEIGHT" />}
              </View>
            </Card>

            <Card icon="architecture" title="WAIST-TO-HIP RATIO">
              <View style={styles.fieldRow}>
                <Field label="WAIST" value={waist} onChangeText={setWaist} suffix={lengthUnitLabel} />
                <Field label="HIP" value={hip} onChangeText={setHip} suffix={lengthUnitLabel} />
              </View>
              <TouchableOpacity style={styles.calcBtn} onPress={calculateWHR} activeOpacity={0.85}>
                <Text style={styles.calcBtnText}>CALCULATE WHR</Text>
                <MaterialIcons name="arrow-forward" size={16} color={colors.onPrimary} />
              </TouchableOpacity>
              {whr !== null && (
                <ResultRow value={String(whr)} label="WAIST-TO-HIP RATIO" sub={getWHRCategory(whr, gender).text} color={getWHRCategory(whr, gender).color} />
              )}
            </Card>
          </>
        ) : (
          <Card icon="local-fire-department" title="BMR & DAILY CALORIES">
            <Field label="WEIGHT" value={weight} onChangeText={setWeight} suffix={weightUnitLabel} />
            <HeightInput height={height} onChangeHeight={setHeight} unitSystem={unitSystem} />
            <Field label="AGE" value={age} onChangeText={setAge} suffix="YRS" />

            <Text style={styles.fieldLabel}>ACTIVITY LEVEL</Text>
            <View style={styles.activityWrap}>
              {ACTIVITY_LEVELS.map((lvl) => (
                <Chip key={lvl.key} label={lvl.label} active={activityLevel === lvl.key} onPress={() => setActivityLevel(lvl.key)} />
              ))}
            </View>

            <TouchableOpacity style={styles.calcBtn} onPress={calculateCalories} activeOpacity={0.85}>
              <Text style={styles.calcBtnText}>CALCULATE BMR & CALORIES</Text>
              <MaterialIcons name="arrow-forward" size={16} color={colors.onPrimary} />
            </TouchableOpacity>

            <View style={styles.resultRowSplit}>
              {bmr !== null && <ResultRow value={String(bmr)} label="BMR (CAL/DAY)" />}
              {dailyCalories !== null && (
                <ResultRow value={String(dailyCalories)} label="DAILY CALORIES" sub={ACTIVITY_LEVELS.find((a) => a.key === activityLevel)?.label} color={colors.primary} />
              )}
            </View>
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: spacing.stackLg, gap: spacing.stackMd },
  pageHeader: { gap: 4 },
  pageTitle: { ...typography.displayXl, fontSize: 32, lineHeight: 38, color: colors.primary, textTransform: 'uppercase' },
  pageSub: { ...typography.labelCaps, fontSize: 11, color: colors.onSurfaceVariant },

  wizardRow: { flexDirection: 'row', gap: spacing.stackSm },
  wizardTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.secondaryContainer,
    backgroundColor: colors.surfaceContainerLow,
  },
  wizardTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  wizardTabText: { ...typography.labelCaps, fontSize: 11, color: colors.onSurfaceVariant },
  wizardTabTextActive: { color: colors.onPrimary },

  unitRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  unitRowSpacer: { width: spacing.stackSm },
  chip: { borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.surfaceContainerLow },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.labelCaps, fontSize: 10, color: colors.onSurfaceVariant },
  chipTextActive: { color: colors.onPrimary },
  unitHint: { ...typography.labelCaps, fontSize: 9, lineHeight: 13, color: colors.onSurfaceVariant, opacity: 0.7 },

  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.secondaryContainer,
    borderRadius: radius.md,
    padding: spacing.marginMobile,
    gap: spacing.stackSm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardTitle: { ...typography.headlineMd, fontSize: 15, color: colors.onSurface, textTransform: 'uppercase' },

  fieldRow: { flexDirection: 'row', gap: spacing.stackSm },
  field: { flex: 1, gap: 4 },
  fieldLabel: { ...typography.labelCaps, fontSize: 10, color: colors.onSurfaceVariant },
  fieldInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
  },
  fieldInput: {
    ...typography.statsNum,
    fontSize: 18,
    lineHeight: 22,
    color: colors.onSurface,
    flex: 1,
    paddingVertical: 10,
  },
  fieldSuffix: {
    ...typography.labelCaps,
    fontSize: 10,
    lineHeight: 14,
    color: colors.onSurfaceVariant,
    marginLeft: 6,
  },

  activityWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  calcBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  calcBtnText: { ...typography.labelCaps, color: colors.onPrimary },

  result: { alignItems: 'center', backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.sm, padding: 16, marginTop: 4, flex: 1 },
  resultRowSplit: { flexDirection: 'row', gap: spacing.stackSm },
  resultValue: { ...typography.statsNum, fontSize: 32, color: colors.onSurface },
  resultLabel: { ...typography.labelCaps, fontSize: 9, color: colors.onSurfaceVariant, marginTop: 4 },
  resultSub: { ...typography.labelCaps, fontSize: 10, marginTop: 4 },
});
