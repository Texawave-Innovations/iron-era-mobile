import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import IronHeader from '../components/IronHeader';
import ScrollFloat from '../components/ScrollFloat';
import { colors, typography, spacing, radius } from '../theme';
import { getExerciseImage } from '../data/exerciseImages';
import { useWeightUnitPreference } from '../hooks/useWeightUnitPreference';

type ExecutionParams = {
  name?: string;
  sets?: string;
  reps?: string;
  restSec?: number;
  note?: string;
  dayTitle?: string;
  kicker?: string;
  onComplete?: () => void;
};

function parseSetCount(sets?: string) {
  if (!sets) return 3;
  const match = sets.match(/\d+/);
  return match ? Math.max(1, Math.min(8, parseInt(match[0], 10))) : 3;
}

function formatTime(totalSec: number) {
  const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function WorkoutExecutionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params: ExecutionParams = route.params ?? {};
  const { weightUnit } = useWeightUnitPreference();

  const exerciseName = params.name ?? 'EXERCISE';
  const kicker = params.kicker ?? params.dayTitle ?? 'WORKOUT';
  const restDefault = params.restSec ?? 90;
  const setCount = parseSetCount(params.sets);

  const [logged, setLogged] = useState<Record<number, { weight: string; reps: string }>>({});
  const [activeSet, setActiveSet] = useState(1);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState(params.reps ?? '');

  const [restSeconds, setRestSeconds] = useState(restDefault);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const toggleRestTimer = () => {
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRunning(false);
      return;
    }
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setRestSeconds((s) => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const resetRestTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setRestSeconds(restDefault);
  };

  const logSet = () => {
    setLogged((prev) => ({ ...prev, [activeSet]: { weight, reps } }));
    if (activeSet < setCount) {
      setActiveSet(activeSet + 1);
      setWeight('');
      setReps(params.reps ?? '');
    }
    resetRestTimer();
    toggleRestTimer();
  };

  return (
    <View style={styles.screen}>
      <IronHeader title="IRON ERA" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <ImageBackground
          source={{ uri: getExerciseImage(exerciseName) }}
          style={styles.hero}
          imageStyle={{ opacity: 0.5, resizeMode: 'cover' }}
          resizeMode="cover"
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>{kicker.toUpperCase()}</Text>
            <ScrollFloat textStyle={styles.heroTitle} duration={1400} distance={20} stagger={0.045}>
              {exerciseName.toUpperCase()}
            </ScrollFloat>
          </View>
        </ImageBackground>

        <View style={styles.comparison}>
          <View style={styles.compTarget}>
            <Text style={styles.compLabel}>TARGET</Text>
            <Text style={styles.compValue} numberOfLines={1} adjustsFontSizeToFit>
              {params.sets ?? '-'} <Text style={styles.compUnit}>SETS</Text> × {params.reps ?? '-'} <Text style={styles.compUnit}>REPS</Text>
            </Text>
          </View>
          <View style={styles.compDivider} />
          <View style={styles.compNoteWrap}>
            <Text style={[styles.compLabel, { color: colors.primary }]}>NOTE</Text>
            <Text style={styles.compNote} numberOfLines={2}>{params.note ?? 'Focus on strict form and full range of motion.'}</Text>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={[styles.listHeaderText, { flex: 2, textAlign: 'center' }]}>SET</Text>
          <Text style={[styles.listHeaderText, { flex: 4, textAlign: 'center' }]}>WEIGHT ({weightUnit})</Text>
          <Text style={[styles.listHeaderText, { flex: 4, textAlign: 'center' }]}>REPS</Text>
          <View style={{ flex: 2, alignItems: 'center' }}>
            <MaterialIcons name="done" size={16} color={colors.onSurfaceVariant} />
          </View>
        </View>

        {Array.from({ length: setCount }).map((_, i) => {
          const setNum = i + 1;
          const done = logged[setNum];
          const isActive = setNum === activeSet && !done;

          if (done) {
            return (
              <View key={setNum} style={styles.setRow}>
                <Text style={[styles.setNum, { flex: 2, textAlign: 'center' }]}>{setNum}</Text>
                <Text style={[styles.setValue, { flex: 4, color: colors.primary }]}>{done.weight || '-'}</Text>
                <Text style={[styles.setValue, { flex: 4, color: colors.primary }]}>{done.reps || '-'}</Text>
                <View style={{ flex: 2, alignItems: 'center' }}>
                  <View style={styles.checkFilled}>
                    <MaterialIcons name="check" size={16} color={colors.onPrimary} />
                  </View>
                </View>
              </View>
            );
          }

          if (isActive) {
            return (
              <View key={setNum} style={styles.activeRow}>
                <Text style={[styles.setNum, { flex: 2, textAlign: 'center', color: colors.primary }]}>{setNum}</Text>
                <View style={{ flex: 4, alignItems: 'center' }}>
                  <View style={styles.inputWrap}>
                    <TextInput
                      style={styles.input}
                      keyboardType="number-pad"
                      keyboardAppearance="dark"
                      value={weight}
                      onChangeText={setWeight}
                      placeholder="0"
                      placeholderTextColor={colors.surfaceContainerHighest}
                    />
                    {!weight && <Text style={styles.inputPlaceholderUnit}>{weightUnit}</Text>}
                  </View>
                </View>
                <View style={{ flex: 4, alignItems: 'center' }}>
                  <TextInput
                    style={[styles.input, { color: colors.primary }]}
                    keyboardType="number-pad"
                    keyboardAppearance="dark"
                    value={reps}
                    onChangeText={setReps}
                    placeholder="0"
                    placeholderTextColor={colors.surfaceContainerHighest}
                  />
                </View>
                <View style={{ flex: 2 }} />
                <TouchableOpacity style={styles.logBtn} onPress={logSet}>
                  <Text style={styles.logBtnText}>LOG SET</Text>
                  <MaterialIcons name="arrow-forward" size={16} color={colors.onPrimary} />
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <View key={setNum} style={[styles.setRow, styles.setRowDim]}>
              <Text style={[styles.setNum, { flex: 2, textAlign: 'center' }]}>{setNum}</Text>
              <Text style={[styles.setValue, { flex: 4 }]}>-</Text>
              <Text style={[styles.setValue, { flex: 4 }]}>-</Text>
              <View style={{ flex: 2 }} />
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.restRow}>
          <TouchableOpacity style={styles.restLeft} onPress={toggleRestTimer} activeOpacity={0.75}>
            <MaterialIcons name={running ? 'pause' : 'play-arrow'} size={20} color={colors.primary} />
            <Text style={styles.restLabel}>REST</Text>
          </TouchableOpacity>
          <Text style={styles.restTime}>{formatTime(restSeconds)}</Text>
          <View style={styles.restControls}>
            <TouchableOpacity style={styles.restBtn} onPress={() => setRestSeconds((s) => Math.max(0, s - 15))}>
              <MaterialIcons name="remove" size={16} color={colors.onSurface} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.restBtn} onPress={() => setRestSeconds((s) => s + 15)}>
              <MaterialIcons name="add" size={16} color={colors.onSurface} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.completeBtn}
          onPress={() => {
            params.onComplete?.();
            navigation.goBack();
          }}
        >
          <Text style={styles.completeBtnText}>COMPLETE EXERCISE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { paddingBottom: 180 },
  hero: { height: 260, justifyContent: 'flex-end', borderBottomWidth: 1, borderBottomColor: colors.outlineVariant, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.surfaceContainerLowest },
  heroContent: { padding: spacing.marginMobile, paddingBottom: spacing.stackSm },
  heroLabel: { ...typography.labelCaps, color: colors.primary, letterSpacing: 3, marginBottom: 4 },
  heroTitle: { ...typography.displayXl, fontSize: 40, lineHeight: 46, color: colors.onSurface, textTransform: 'uppercase' },
  comparison: {
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.stackSm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compTarget: { flex: 1, justifyContent: 'center' },
  compLabel: { ...typography.labelCaps, color: colors.onSurfaceVariant },
  compValue: { ...typography.statsNum, fontSize: 17, color: colors.onSurface },
  compUnit: { ...typography.bodyMd, fontSize: 11, color: colors.onSurfaceVariant },
  compNoteWrap: { alignItems: 'flex-end', justifyContent: 'center', flex: 1 },
  compNote: { ...typography.bodyMd, fontSize: 11, color: colors.onSurfaceVariant, textAlign: 'right' },
  compDivider: { width: 1, alignSelf: 'stretch', backgroundColor: colors.outlineVariant, marginHorizontal: spacing.stackMd },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.stackSm,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    backgroundColor: 'rgba(42,42,42,0.3)',
  },
  listHeaderText: { ...typography.labelCaps, color: colors.onSurfaceVariant, textAlign: 'center' },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.stackMd,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  setRowDim: { backgroundColor: 'rgba(14,14,14,0.5)', opacity: 0.6 },
  setNum: { ...typography.statsNum, fontSize: 16, color: colors.onSurfaceVariant, textAlign: 'center' },
  setValue: { ...typography.statsNum, fontSize: 16, color: colors.onSurfaceVariant, textAlign: 'center' },
  checkFilled: { width: 32, height: 32, borderRadius: radius.sm, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.stackLg,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    backgroundColor: 'rgba(42,42,42,0.2)',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    flexWrap: 'wrap',
    gap: spacing.stackSm,
  },
  inputWrap: { position: 'relative', justifyContent: 'center' },
  inputPlaceholderUnit: {
    position: 'absolute',
    right: 10,
    bottom: 9,
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.surfaceContainerHighest,
  },
  input: {
    width: 90,
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    borderRadius: radius.sm,
    textAlign: 'center',
    ...typography.displayXl,
    fontSize: 26,
    lineHeight: 32,
    color: colors.onSurface,
    paddingVertical: 6,
  },
  logBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    justifyContent: 'center',
    marginTop: spacing.stackSm,
  },
  logBtnText: { ...typography.labelCaps, color: colors.onPrimary },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  restRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: 12,
    backgroundColor: colors.surfaceContainerHighest,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  restLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  restLabel: { ...typography.labelCaps, color: colors.onSurfaceVariant, letterSpacing: 2 },
  restTime: { ...typography.headlineLgMobile, fontSize: 28, color: colors.primary, letterSpacing: 2 },
  restControls: { flexDirection: 'row', gap: 8 },
  restBtn: { width: 36, height: 36, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  completeBtn: { margin: spacing.marginMobile, backgroundColor: colors.surfaceContainerHigh, borderWidth: 1, borderColor: colors.outline, borderRadius: radius.sm, paddingVertical: 16, alignItems: 'center' },
  completeBtnText: { ...typography.headlineMd, color: colors.onSurface, textTransform: 'uppercase' },
});
