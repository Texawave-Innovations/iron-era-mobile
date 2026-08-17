import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, TextInput, Animated, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import IronHeader from '../components/IronHeader';
import ScrollFloat from '../components/ScrollFloat';
import { colors, typography, spacing, radius } from '../theme';

type Level = 'beginner' | 'intermediate' | 'custom' | 'legend';

const LEVELS: { id: Level; label: string }[] = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'custom', label: 'Custom' },
  { id: 'legend', label: 'Legend' },
];

const WORKOUTS = [
  {
    id: 'full-body-circuit',
    level: 'beginner' as Level,
    athlete: 'Foundations',
    tag: 'Weight Loss · Circuit',
    title: 'Full Body Circuit',
    exercises: 8,
    sets: 24,
    duration: '40m',
    premium: false,
    image: 'https://images.pexels.com/photos/866027/pexels-photo-866027.jpeg',
  },
  {
    id: 'push-pull-legs',
    level: 'intermediate' as Level,
    athlete: 'Bro split',
    tag: 'Push-Pull-Legs',
    title: 'Intermidiate',
    exercises: 5,
    sets: 15,
    duration: '45m',
    premium: false,
    image: 'https://images.pexels.com/photos/14599070/pexels-photo-14599070.jpeg',
  },
  {
    id: 'oak-volume',
    level: 'legend' as Level,
    athlete: 'Arnold',
    tag: 'recommended',
    title: "The Oak's Volume Assault",
    exercises: 10,
    sets: 34,
    duration: '85m',
    premium: false,
    image: require('../assets/splitarnold.jpg'),
    imageHeight: 210,
  },
  {
    id: 'blood-guts-back',
    level: 'legend' as Level,
    athlete: 'Mentzer',
    tag: 'mentzer(hit)',
    title: 'Heavy Duty Training',
    exercises: 14,
    sets: 14,
    duration: '30m',
    premium: false,
    image: require('../assets/splitmike.jpg'),
    imageHeight: 210,
  },
  {
    id: 'Tom platz',
    level: 'legend' as Level,
    athlete: 'Tom platz',
    tag: 'Legs & Calves',
    title: 'High intense Leg Day',
    exercises: 10,
    sets: 40,
    duration: '75m',
    premium: true,
    image: require('../assets/tom-platz-workout.png'),
    imageHeight: 210,
  },
  {
    id: 'kevin-levrone',
    level: 'legend' as Level,
    athlete: 'kevin-levrone',
    tag: 'Back & Rear Delts',
    title: 'The Levrone Protocol',
    exercises: 5,
    sets: 15,
    duration: '45m',
    premium: false,
    image: require('../assets/splitkevinlev.webp'),
    imageHeight: 210,
  },
];

const BASE_OPTIONS = WORKOUTS.map((w) => ({
  id: w.id,
  title: w.title,
  exercises: w.exercises,
  sets: w.sets,
  duration: parseInt(w.duration, 10) || 0,
}));

function AnimatedFireIcon() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.2] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  return (
    <Animated.View style={{ transform: [{ scale }], opacity }}>
      <MaterialIcons name="local-fire-department" size={13} color="#ff8a3d" />
    </Animated.View>
  );
}

type CustomSplit = { id: string; name: string; baseIds: string[] };

export default function WorkoutsScreen() {
  const navigation = useNavigation<any>();
  const [level, setLevel] = useState<Level>('beginner');
  const [customSplits, setCustomSplits] = useState<CustomSplit[]>([]);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [selectedBaseIds, setSelectedBaseIds] = useState<string[]>([]);

  const filteredWorkouts = WORKOUTS.filter((w) => w.level === level);

  const toggleBase = (id: string) => {
    setSelectedBaseIds((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  };

  const resetBuilder = () => {
    setCustomName('');
    setSelectedBaseIds([]);
    setBuilderOpen(false);
  };

  const handleCreateCustom = () => {
    if (!customName.trim() || selectedBaseIds.length === 0) return;
    setCustomSplits((prev) => [...prev, { id: `${Date.now()}`, name: customName.trim(), baseIds: [...selectedBaseIds] }]);
    resetBuilder();
  };

  const removeCustomSplit = (id: string) => {
    setCustomSplits((prev) => prev.filter((c) => c.id !== id));
  };

  const openWorkout = (id: string) => {
    if (id === 'full-body-circuit') {
      navigation.navigate('CircuitSplit', { id });
    } else if (id === 'oak-volume') {
      navigation.navigate('ArnoldSplit', { id });
    } else if (id === 'blood-guts-back') {
      navigation.navigate('MentzerSplit', { id });
    } else if (id === 'Tom platz') {
      navigation.navigate('PlatzSplit', { id });
    } else if (id === 'kevin-levrone') {
      navigation.navigate('LevroneSplit', { id });
    } else {
      navigation.navigate('WorkoutSplit', { id });
    }
  };

  return (
    <View style={styles.screen}>
      <IronHeader title="IRON ERA" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} decelerationRate="normal">
        <View style={styles.pageHeader}>
          <ScrollFloat textStyle={styles.pageTitle} duration={1400} distance={20} stagger={0.045}>
            Old School Workouts
          </ScrollFloat>
          <Text style={styles.pageSub}>
            No trackers, no shortcuts-just the same brutal volume the legends grinded through to build
            physiques that are still the standard today. Pick a split, load the bar, and put in the work.
          </Text>
        </View>

        <View style={styles.wizardRow}>
          {LEVELS.map((l) => {
            const isActive = level === l.id;
            return (
              <TouchableOpacity
                key={l.id}
                style={styles.wizardItem}
                activeOpacity={0.6}
                onPress={() => setLevel(l.id)}
              >
                <View style={styles.wizardLabelRow}>
                  <Text
                    style={[styles.wizardText, isActive && styles.wizardTextActive]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                  >
                    {l.label}
                  </Text>
                  {l.id === 'legend' && <AnimatedFireIcon />}
                </View>
                <View style={[styles.wizardUnderline, isActive && styles.wizardUnderlineActive]} />
              </TouchableOpacity>
            );
          })}
        </View>

        {level === 'custom' ? (
          <View style={styles.customSection}>
            {builderOpen ? (
              <View style={styles.builderCard}>
                <View style={styles.builderHeaderRow}>
                  <Text style={styles.label}>NAME YOUR SPLIT</Text>
                  <TouchableOpacity onPress={resetBuilder} hitSlop={8}>
                    <MaterialIcons name="close" size={18} color={colors.onSurfaceVariant} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.builderInput}
                  value={customName}
                  onChangeText={setCustomName}
                  placeholder="e.g. My Push Day Mix"
                  placeholderTextColor={colors.onSurfaceVariant}
                  keyboardAppearance="dark"
                />

                <Text style={[styles.label, styles.builderSectionLabel]}>BASE ON EXISTING SPLITS</Text>
                <View style={styles.chipRow}>
                  {BASE_OPTIONS.map((b) => {
                    const active = selectedBaseIds.includes(b.id);
                    return (
                      <TouchableOpacity
                        key={b.id}
                        style={[styles.baseChip, active && styles.baseChipActive]}
                        activeOpacity={0.8}
                        onPress={() => toggleBase(b.id)}
                      >
                        <Text style={[styles.baseChipText, active && styles.baseChipTextActive]}>{b.title}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  style={[styles.startBtn, (!customName.trim() || selectedBaseIds.length === 0) && styles.startBtnDisabled]}
                  activeOpacity={0.85}
                  disabled={!customName.trim() || selectedBaseIds.length === 0}
                  onPress={handleCreateCustom}
                >
                  <Text style={styles.startBtnText}>Create Split</Text>
                  <MaterialIcons name="check" size={18} color={colors.onPrimary} />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {customSplits.length === 0 ? (
                  <View style={styles.emptyState}>
                    <MaterialIcons name="construction" size={28} color={colors.onSurfaceVariant} />
                    <Text style={styles.emptyTitle}>Build Your Own</Text>
                    <Text style={styles.emptyBody}>Combine days from existing splits into a program that's yours.</Text>
                    <TouchableOpacity style={styles.newSplitBtn} activeOpacity={0.85} onPress={() => setBuilderOpen(true)}>
                      <MaterialIcons name="add" size={18} color={colors.primary}/>
                      <Text style={styles.newSplitBtnText}>Create Custom Split </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.grid}>
                    {customSplits.map((c) => {
                      const bases = BASE_OPTIONS.filter((b) => c.baseIds.includes(b.id));
                      const totalExercises = bases.reduce((sum, b) => sum + b.exercises, 0);
                      const totalSets = bases.reduce((sum, b) => sum + b.sets, 0);
                      const totalDuration = bases.reduce((sum, b) => sum + b.duration, 0);
                      return (
                        <View key={c.id} style={styles.card}>
                          <View style={styles.customCardHeader}>
                            <MaterialIcons name="build" size={20} color={colors.primary} />
                            <Text style={styles.customCardHeaderText}>CUSTOM SPLIT</Text>
                            <TouchableOpacity onPress={() => removeCustomSplit(c.id)} hitSlop={8}>
                              <MaterialIcons name="delete-outline" size={18} color={colors.onSurfaceVariant} />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.cardBottom}>
                            <Text style={styles.cardTitle}>{c.name}</Text>
                            <View style={styles.chipRow}>
                              {bases.map((b) => (
                                <View key={b.id} style={styles.baseChipStatic}>
                                  <Text style={styles.baseChipStaticText}>{b.title}</Text>
                                </View>
                              ))}
                            </View>
                            <View style={styles.statsRow}>
                              <View style={styles.statCol}>
                                <Text style={styles.statLabel}>Exercises</Text>
                                <Text style={styles.statNum}>{totalExercises}</Text>
                              </View>
                              <View style={[styles.statCol, styles.statColBorder]}>
                                <Text style={styles.statLabel}>Total Sets</Text>
                                <Text style={styles.statNum}>{totalSets}</Text>
                              </View>
                              <View style={[styles.statCol, styles.statColBorder]}>
                                <Text style={styles.statLabel}>Duration</Text>
                                <Text style={styles.statNum}>{totalDuration}m</Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              style={styles.startBtn}
                              activeOpacity={0.85}
                              onPress={() => Alert.alert(c.name, 'Custom split execution is coming soon.')}
                            >
                              <Text style={styles.startBtnText}>View Split</Text>
                              <MaterialIcons name="arrow-forward" size={18} color={colors.onPrimary} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                    <TouchableOpacity style={styles.newSplitBtn} activeOpacity={0.85} onPress={() => setBuilderOpen(true)}>
                      <MaterialIcons name="add" size={18} color={colors.primary} />
                      <Text style={styles.newSplitBtnText}>Create Another Split</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        ) : filteredWorkouts.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="fitness-center" size={28} color={colors.onSurfaceVariant} />
            <Text style={styles.emptyTitle}>No Splits Yet</Text>
            <Text style={styles.emptyBody}>More {LEVELS.find((l) => l.id === level)?.label.toLowerCase()} programs are on the way.</Text>
          </View>
        ) : (
        <View style={styles.grid}>
          {filteredWorkouts.map((w) => (
            <TouchableOpacity
              key={w.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => openWorkout(w.id)}
            >
              <ImageBackground
                source={typeof w.image === 'string' ? { uri: w.image } : w.image}
                style={[styles.cardImage, w.imageHeight ? { height: w.imageHeight } : null]}
                imageStyle={{ opacity: 0.4, resizeMode: 'cover' }}
                resizeMode="cover"
              >
                <View style={styles.cardTop}>
                  <View style={{ gap: 4 }}>
                    <View style={styles.pill}><Text style={styles.pillTextPrimary}>{w.athlete}</Text></View>
                    <View style={styles.pill}><Text style={styles.pillText}>{w.tag}</Text></View>
                  </View>
                  <View style={[styles.statusPill, w.premium ? styles.premiumPill : styles.freePill]}>
                    {w.premium && <MaterialIcons name="star" size={12} color={colors.onPrimary} />}
                    <Text style={w.premium ? styles.premiumText : styles.freeText}>{w.premium ? 'Premium' : 'Free'}</Text>
                  </View>
                </View>
              </ImageBackground>
              <View style={styles.cardBottom}>
                <Text style={styles.cardTitle}>{w.title}</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statCol}>
                    <Text style={styles.statLabel}>Exercises</Text>
                    <Text style={styles.statNum}>{w.exercises}</Text>
                  </View>
                  <View style={[styles.statCol, styles.statColBorder]}>
                    <Text style={styles.statLabel}>Total Sets</Text>
                    <Text style={styles.statNum}>{w.sets}</Text>
                  </View>
                  <View style={[styles.statCol, styles.statColBorder]}>
                    <Text style={styles.statLabel}>Duration</Text>
                    <Text style={styles.statNum}>{w.duration}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.startBtn} activeOpacity={0.85} onPress={() => openWorkout(w.id)}>
                  <Text style={styles.startBtnText}>Start Workout</Text>
                  <MaterialIcons name="arrow-forward" size={18} color={colors.onPrimary} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.stackLg },
  pageHeader: { padding: spacing.marginMobile, gap: spacing.stackSm, backgroundColor: colors.surfaceDim, borderBottomWidth: 1, borderBottomColor: colors.surfaceContainerHigh },
  pageTitle: { ...typography.displayXl, fontSize: 40, lineHeight: 48, paddingTop: 6, color: colors.onSurface, textTransform: 'uppercase' },
  pageSub: { ...typography.bodyLg, fontSize: 16, color: colors.onSurfaceVariant },
  wizardRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.marginMobile,
    backgroundColor: colors.surfaceDim,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
  },
  wizardItem: { flex: 1, alignItems: 'center', paddingVertical: 16, paddingHorizontal: 2, gap: 8 },
  wizardLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, maxWidth: '100%' },
  wizardText: { ...typography.headlineMd, fontSize: 11, letterSpacing: 0.4, color: colors.onSurfaceVariant, textTransform: 'uppercase' },
  wizardTextActive: { color: colors.primary, fontSize: 12 },
  wizardUnderline: { height: 2, width: '55%', borderRadius: 1, backgroundColor: 'transparent' },
  wizardUnderlineActive: { backgroundColor: colors.primary },
  emptyState: { alignItems: 'center', gap: spacing.stackSm, paddingVertical: spacing.stackLg, paddingHorizontal: spacing.marginMobile },
  emptyTitle: { ...typography.headlineMd, fontSize: 18, color: colors.onSurface, textTransform: 'uppercase' },
  emptyBody: { ...typography.bodyMd, fontSize: 13, color: colors.onSurfaceVariant, textAlign: 'center' },
  grid: { padding: spacing.marginMobile, gap: spacing.stackMd },
  card: { backgroundColor: colors.surfaceContainerLow, borderWidth: 1, borderColor: colors.surfaceContainerHighest, borderRadius: radius.md, overflow: 'hidden' },
  cardImage: { height: 140, padding: spacing.gutter },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pill: { borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.sm, backgroundColor: 'rgba(19,19,19,0.8)', paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' },
  pillText: { ...typography.labelCaps, fontSize: 10, color: colors.onSurface },
  pillTextPrimary: { ...typography.labelCaps, fontSize: 10, color: colors.primary },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 4 },
  premiumPill: { backgroundColor: colors.primary },
  freePill: { backgroundColor: colors.surfaceContainerHighest, borderWidth: 1, borderColor: colors.outlineVariant },
  premiumText: { ...typography.labelCaps, fontSize: 10, color: colors.onPrimary },
  freeText: { ...typography.labelCaps, fontSize: 10, color: colors.onSurface },
  cardBottom: { padding: spacing.gutter, gap: spacing.stackSm },
  cardTitle: { ...typography.headlineLgMobile, fontSize: 24, lineHeight: 30, color: colors.onSurface, textTransform: 'uppercase' },
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.surfaceContainerHigh, paddingVertical: 12 },
  statCol: { flex: 1, gap: 2 },
  statColBorder: { borderLeftWidth: 1, borderLeftColor: colors.surfaceContainerHigh, paddingLeft: 8 },
  statLabel: { ...typography.labelCaps, fontSize: 10, color: colors.onSurfaceVariant },
  statNum: { ...typography.statsNum, fontSize: 22, color: colors.onSurface },
  startBtn: { backgroundColor: colors.primary, borderRadius: radius.sm, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  startBtnDisabled: { opacity: 0.45 },
  startBtnText: { ...typography.headlineMd, fontSize: 15, color: colors.onPrimary, textTransform: 'uppercase' },

  customSection: { paddingTop: spacing.stackSm },
  label: { ...typography.labelCaps, fontSize: 11, color: colors.primary },
  builderCard: {
    margin: spacing.marginMobile,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    padding: spacing.gutter,
    gap: spacing.stackSm,
  },
  builderHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  builderSectionLabel: { marginTop: spacing.stackSm },
  builderInput: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 12,
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  baseChip: { borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.surfaceContainerLowest },
  baseChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  baseChipText: { ...typography.labelCaps, fontSize: 10, color: colors.onSurfaceVariant },
  baseChipTextActive: { color: colors.onPrimary },
  baseChipStatic: { borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6 },
  baseChipStaticText: { ...typography.labelCaps, fontSize: 9, color: colors.onSurfaceVariant },
  newSplitBtn: {
    marginTop: spacing.stackSm,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  newSplitBtnText: { ...typography.headlineMd, fontSize: 14, lineHeight: 18, color: colors.primary, textTransform: 'uppercase' },
  customCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.gutter,
    paddingVertical: 12,
    backgroundColor: colors.surfaceContainerHigh,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  customCardHeaderText: { ...typography.labelCaps, fontSize: 11, color: colors.primary, flex: 1 },
});
