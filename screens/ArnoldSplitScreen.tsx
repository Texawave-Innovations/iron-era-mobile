import { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import IronHeader from '../components/IronHeader';
import LoadingScreen from '../components/LoadingScreen';
import ScrollFloat from '../components/ScrollFloat';
import RevealOnScroll, { type RevealHandle } from '../components/RevealOnScroll';
import { darkColors, typography, spacing, radius } from '../theme';
import { useThemeMode } from '../hooks/useThemeMode';
import { ARNOLD_SPLIT, ARNOLD_NOTES, type ArnoldExercise } from '../data/arnoldSplit';

const WINDOW_HEIGHT = Dimensions.get('window').height;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HERO_IMAGE = require('../assets/splitarnold.jpg');

function ExerciseRow({
  ex,
  completed,
  onPress,
  onToggleComplete,
  colors,
  styles,
}: {
  ex: ArnoldExercise;
  completed: boolean;
  onPress: () => void;
  onToggleComplete: () => void;
  colors: ReturnType<typeof useThemeMode>['colors'];
  styles: any;
}) {
  return (
    <TouchableOpacity
      style={[styles.exRow, completed && styles.exRowCompleted]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={styles.checkTouch}
        onPress={onToggleComplete}
        activeOpacity={0.7}
        hitSlop={8}
      >
        <MaterialIcons
          name={completed ? 'check-circle' : 'radio-button-unchecked'}
          size={20}
          color={completed ? colors.primary : colors.outline}
        />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={[styles.exName, completed && styles.exNameCompleted]}>{ex.name}</Text>
        {ex.note ? <Text style={styles.exNote}>{ex.note}</Text> : null}
      </View>
      <View style={styles.exMetrics}>
        <Text style={styles.exSets}>{ex.sets}<Text style={styles.exMetricUnit}> SETS</Text></Text>
        <Text style={styles.exReps}>{ex.reps}<Text style={styles.exMetricUnit}> REPS</Text></Text>
      </View>
      <MaterialIcons name="chevron-right" size={18} color={colors.onSurfaceVariant} />
    </TouchableOpacity>
  );
}

function DayCard({
  day,
  expanded,
  onToggle,
  onPressExercise,
  completedExercises,
  onToggleComplete,
  colors,
  styles,
}: {
  day: (typeof ARNOLD_SPLIT)[number];
  expanded: boolean;
  onToggle: () => void;
  onPressExercise: (ex: ArnoldExercise) => void;
  completedExercises: Set<string>;
  onToggleComplete: (name: string) => void;
  colors: ReturnType<typeof useThemeMode>['colors'];
  styles: any;
}) {
  return (
    <View style={styles.dayCard}>
      <TouchableOpacity style={styles.dayHeader} onPress={onToggle} activeOpacity={0.8}>
        <View style={styles.dayHeaderLeft}>
          <View style={[styles.dayNumBadge, day.isRest && styles.dayNumBadgeRest]}>
            <Text style={[styles.dayNumText, day.isRest && styles.dayNumTextRest]}>{day.dayNum}</Text>
          </View>
          <View>
            <Text style={styles.dayTitle}>{day.title}</Text>
            <Text style={styles.dayFocus}>{day.focus}</Text>
          </View>
        </View>
        <MaterialIcons
          name={expanded ? 'expand-less' : 'expand-more'}
          size={26}
          color={colors.onSurfaceVariant}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.dayBody}>
          <View style={styles.restNoteRow}>
            <MaterialIcons name="hourglass-bottom" size={14} color={colors.onSurfaceVariant} />
            <Text style={styles.restNoteText}>{day.restNote}</Text>
          </View>

          {day.isRest ? (
            <View style={styles.restDayBox}>
              <MaterialIcons name="self-improvement" size={32} color={colors.primary} />
              <Text style={styles.restDayText}>
                Full rest or light active recovery. This is where growth actually happens — muscle repairs during rest.
              </Text>
            </View>
          ) : (
            <>
              {day.superset && (
                <View style={styles.supersetBox}>
                  <MaterialIcons name="swap-vert-circle" size={16} color={colors.primary} />
                  <Text style={styles.supersetText}>{day.superset}</Text>
                </View>
              )}
              {day.exercises.map((ex) => (
                <ExerciseRow
                  key={ex.name}
                  ex={ex}
                  completed={completedExercises.has(ex.name)}
                  onPress={() => onPressExercise(ex)}
                  onToggleComplete={() => onToggleComplete(ex.name)}
                  colors={colors}
                  styles={styles}
                />
              ))}
              <TouchableOpacity style={styles.startBtn} onPress={() => onPressExercise(day.exercises[0])}>
                <Text style={styles.startBtnText}>START DAY {day.dayNum}</Text>
                <MaterialIcons name="arrow-forward" size={16} color={colors.onPrimary} />
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}

export default function ArnoldSplitScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useThemeMode();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const toggleCompleted = (name: string) =>
    setCompletedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  const markCompleted = (name: string) =>
    setCompletedExercises((prev) => new Set(prev).add(name));
  const fade = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const dayOffsets = useRef<Record<string, number>>({}).current;
  const daysWrapY = useRef(0);
  const revealRefs = useRef<Record<string, RevealHandle | null>>({}).current;

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }).start();
      setTimeout(() => checkReveals(0), 300);
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  const toggleDay = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const openDay = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(id);
    setTimeout(() => {
      const y = dayOffsets[id];
      if (y != null) scrollRef.current?.scrollTo({ y: Math.max(daysWrapY.current + y - 16, 0), animated: true });
    }, 260);
  };

  const checkReveals = (scrollY: number) => {
    const revealLine = scrollY + WINDOW_HEIGHT * 0.9;
    ARNOLD_SPLIT.forEach((day) => {
      const y = dayOffsets[day.id];
      if (y != null && revealLine > daysWrapY.current + y) {
        revealRefs[day.id]?.reveal();
      }
    });
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    checkReveals(e.nativeEvent.contentOffset.y);
  };

  return (
    <View style={styles.screen}>
      <IronHeader title="ARNOLD SPLIT" showBack onBackPress={() => navigation.goBack()} />
      {loading ? (
        <LoadingScreen label="LOADING ARNOLD SPLIT…" />
      ) : (
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          style={{ opacity: fade }}
          showsVerticalScrollIndicator={false}
          decelerationRate="normal"
          scrollEventThrottle={16}
          onScroll={handleScroll}
        >
          <ImageBackground
            source={HERO_IMAGE}
            style={styles.hero}
            imageStyle={{ resizeMode: 'cover' }}
            resizeMode="cover"
          >
            <View style={styles.heroOverlay} />
            <LinearGradient colors={['transparent', 'rgba(19,19,19,0.92)']} style={StyleSheet.absoluteFill} />
            <View style={styles.heroContent}>
              <Text style={styles.heroKicker}>ARNOLD SCHWARZENEGGER</Text>
              <ScrollFloat textStyle={styles.heroTitle} duration={1400} distance={20} stagger={0.045}>
                THE ARNOLD SPLIT
              </ScrollFloat>
              <Text style={styles.heroSub}>6 Days On, 1 Day Rest — Golden Era High-Volume Program</Text>
            </View>
          </ImageBackground>

          <View style={styles.structureRow}>
            {ARNOLD_SPLIT.map((day) => {
              const label = day.isRest ? 'REST' : day.title === 'Legs' ? 'LEGS' : day.title.replace('Chest & Back', 'C+B').replace('Shoulders & Arms', 'S+A');
              const isActive = expandedId === day.id;
              return (
                <TouchableOpacity
                  key={day.id}
                  style={[styles.structureChip, day.isRest && styles.structureChipRest, isActive && styles.structureChipActive]}
                  activeOpacity={0.75}
                  onPress={() => openDay(day.id)}
                >
                  <Text
                    style={[
                      styles.structureChipText,
                      day.isRest && styles.structureChipTextRest,
                      isActive && styles.structureChipTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.daysWrap} onLayout={(e) => { daysWrapY.current = e.nativeEvent.layout.y; }}>
            {ARNOLD_SPLIT.map((day, i) => (
              <View
                key={day.id}
                onLayout={(e) => {
                  dayOffsets[day.id] = e.nativeEvent.layout.y;
                  checkReveals(0);
                }}
              >
                <RevealOnScroll
                  ref={(r) => { revealRefs[day.id] = r; }}
                  distance={60}
                  duration={600}
                  delay={i * 40}
                >
                  <DayCard
                    day={day}
                    expanded={expandedId === day.id}
                    onToggle={() => toggleDay(day.id)}
                    completedExercises={completedExercises}
                    onToggleComplete={toggleCompleted}
                    onPressExercise={(ex) =>
                      navigation.navigate('WorkoutExecution', {
                        name: ex.name,
                        sets: ex.sets,
                        reps: ex.reps,
                        restSec: ex.restSec,
                        note: ex.note,
                        kicker: 'ARNOLD SPLIT',
                        dayTitle: `DAY ${day.dayNum} — ${day.title}`,
                        onComplete: () => markCompleted(ex.name),
                      })
                    }
                    colors={colors}
                    styles={styles}
                  />
                </RevealOnScroll>
              </View>
            ))}
          </View>

          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>PROGRAMMING NOTES</Text>
            {ARNOLD_NOTES.map((n) => (
              <View key={n} style={styles.noteRow}>
                <View style={styles.noteDot} />
                <Text style={styles.noteText}>{n}</Text>
              </View>
            ))}
          </View>
        </Animated.ScrollView>
      )}
    </View>
  );
}

const makeStyles = (colors: ReturnType<typeof useThemeMode>['colors']) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.stackLg },

  hero: { width: '100%', height: 260, justifyContent: 'flex-end', margin: spacing.marginMobile, marginBottom: 0, borderWidth: 1, borderColor: colors.secondaryContainer, borderRadius: radius.md, overflow: 'hidden' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  heroContent: { padding: 20, gap: 4 },
  heroKicker: { ...typography.labelCaps, color: darkColors.primary, letterSpacing: 3 },
  heroTitle: { ...typography.displayXl, fontSize: 36, lineHeight: 42, color: darkColors.onSurface, textTransform: 'uppercase' },
  heroSub: { ...typography.bodyMd, color: darkColors.onSurfaceVariant },

  structureRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: spacing.marginMobile, paddingTop: spacing.stackMd },
  structureChip: { borderWidth: 1, borderColor: colors.secondaryContainer, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.surfaceContainerLow },
  structureChipRest: { borderColor: colors.primary, backgroundColor: 'rgba(233,193,118,0.08)' },
  structureChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  structureChipText: { ...typography.labelCaps, fontSize: 10, color: colors.onSurfaceVariant },
  structureChipTextRest: { color: colors.primary },
  structureChipTextActive: { color: colors.onPrimary },

  daysWrap: { padding: spacing.marginMobile, gap: spacing.stackSm },
  dayCard: { backgroundColor: colors.surfaceContainerLow, borderWidth: 1, borderColor: colors.secondaryContainer, borderRadius: radius.md, overflow: 'hidden' },
  dayHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  dayHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dayNumBadge: { width: 40, height: 40, borderRadius: radius.sm, backgroundColor: colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center' },
  dayNumBadgeRest: { backgroundColor: 'rgba(233,193,118,0.12)' },
  dayNumText: { ...typography.statsNum, fontSize: 18, color: colors.primary },
  dayNumTextRest: { color: colors.primary },
  dayTitle: { ...typography.headlineMd, fontSize: 18, color: colors.onSurface, textTransform: 'uppercase' },
  dayFocus: { ...typography.bodyMd, fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 },
  dayBody: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: colors.secondaryContainer },
  restNoteRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 12, paddingBottom: 4 },
  restNoteText: { ...typography.labelCaps, fontSize: 10, color: colors.onSurfaceVariant },
  supersetBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: 'rgba(233,193,118,0.08)', borderRadius: radius.sm, padding: 10, marginVertical: 8 },
  supersetText: { ...typography.bodyMd, fontSize: 12, color: colors.onSurfaceVariant, flex: 1, lineHeight: 18 },
  restDayBox: { alignItems: 'center', gap: 10, paddingVertical: 24 },
  restDayText: { ...typography.bodyMd, color: colors.onSurfaceVariant, textAlign: 'center', paddingHorizontal: 12, lineHeight: 20 },

  exRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.surfaceContainerHigh, gap: 8 },
  exRowCompleted: { opacity: 0.65 },
  checkTouch: { paddingRight: 2 },
  exName: { ...typography.headlineMd, fontSize: 14, color: colors.onSurface, textTransform: 'uppercase' },
  exNameCompleted: { textDecorationLine: 'line-through', color: colors.onSurfaceVariant },
  exNote: { ...typography.labelCaps, fontSize: 9, color: colors.primary, marginTop: 2 },
  exMetrics: { alignItems: 'flex-end', gap: 2 },
  exSets: { ...typography.statsNum, fontSize: 15, color: colors.primary },
  exReps: { ...typography.statsNum, fontSize: 15, color: colors.onSurface },
  exMetricUnit: { ...typography.labelCaps, fontSize: 8, color: colors.onSurfaceVariant },

  startBtn: { marginTop: 14, backgroundColor: colors.primary, borderRadius: radius.sm, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  startBtnText: { ...typography.labelCaps, color: colors.onPrimary },

  notesBox: { marginHorizontal: spacing.marginMobile, padding: 16, backgroundColor: colors.surfaceContainerLow, borderWidth: 1, borderColor: colors.secondaryContainer, borderRadius: radius.md, gap: 10 },
  notesTitle: { ...typography.labelCaps, color: colors.primary, letterSpacing: 2 },
  noteRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  noteDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.onSurfaceVariant, marginTop: 7 },
  noteText: { ...typography.bodyMd, fontSize: 13, color: colors.onSurfaceVariant, flex: 1, lineHeight: 19 },
});
