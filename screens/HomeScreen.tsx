import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import IronHeader from '../components/IronHeader';
import ScrollFloat from '../components/ScrollFloat';
import { colors, typography, spacing, radius } from '../theme';
import { PPL_SPLIT } from '../data/pplSplit';
import { getTodaysLesson } from '../data/ironLessons';

// JS getDay(): 0=Sun..6=Sat. PPL split runs Mon=Day1 ... Sun=Day7(rest).
function getTodaysSplitDay() {
  const jsDay = new Date().getDay();
  const dayIndex = jsDay === 0 ? 6 : jsDay - 1;
  return PPL_SPLIT[dayIndex];
}

const LEGENDS = [
  {
    id: 'oak',
    label: 'High Volume',
    name: 'Arnold split',
    image: require('../assets/arnold.webp'),
    route: 'ArnoldSplit',
    params: { id: 'oak-volume' },
  },
  {
    id: 'shadow',
    label: 'High Intensity',
    name: 'Heavy Duty',
    image: require('../assets/mike mentzer.webp'),
    route: 'MentzerSplit',
    params: { id: 'blood-guts-back' },
  },
  {
    id: 'Tom platz',
    label: 'High Volume',
    name: 'Platz leg training',
    image: require('../assets/tom-platz.gif'),
    route: 'PlatzSplit',
    params: { id: 'Tom platz' },
  },
  {
    id: 'kevin',
    label: 'High intense',
    name: 'levrone method',
    image: require('../assets/kevin-levroni.gif'),
    route: 'LevroneSplit',
    params: { id: 'kevin-levrone' },
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const todaysDay = getTodaysSplitDay();
  const todaysLesson = getTodaysLesson();

  return (
    <View style={styles.screen}>
      <IronHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Image
            source={require('../assets/hero-page.jpg')}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            contentPosition="center"
          />
          <LinearGradient
            colors={['transparent', 'rgba(19,19,19,0.25)', 'rgba(19,19,19,0.85)', colors.surface]}
            locations={[0, 0.45, 0.75, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <ScrollFloat textStyle={styles.heroTitle} duration={1400} distance={22} stagger={0.04}>
              {"TRAIN HARD.\nBUILD LEGACY."}
            </ScrollFloat>
            <View style={styles.featuredCard}>
              <View style={styles.featuredTop}>
                <View style={styles.badge}><Text style={styles.badgeText}>Today's Focus</Text></View>
                <MaterialIcons name="fitness-center" size={20} color={colors.outline} />
              </View>
              <Text style={styles.featuredTitle}>
                {todaysDay.isRest ? 'REST DAY' : todaysDay.title.toUpperCase()}
              </Text>
              <Text style={styles.featuredSub}>
                {todaysDay.isRest
                  ? todaysDay.subtitle
                  : `${todaysDay.subtitle} • ${todaysDay.exercises.length} Exercises`}
              </Text>
              <TouchableOpacity
                style={[styles.startBtn, todaysDay.isRest && styles.startBtnDisabled]}
                disabled={todaysDay.isRest}
                onPress={() => navigation.navigate('WorkoutSplit', { id: 'push-pull-legs', openDayId: todaysDay.id })}
              >
                <Text style={styles.startBtnText}>{todaysDay.isRest ? 'REST & RECOVER' : 'START WORKOUT'}</Text>
                {!todaysDay.isRest && <MaterialIcons name="play-arrow" size={20} color={colors.onPrimary} />}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.section, { marginTop: spacing.stackSm }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>TRAIN LIKE A LEGEND</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.gutter, paddingHorizontal: spacing.marginMobile }}>
            {LEGENDS.map((legend) => (
              <TouchableOpacity
                key={legend.id}
                style={styles.legendCard}
                activeOpacity={0.85}
                onPress={() => navigation.navigate(legend.route, legend.params)}
              >
                <Image source={legend.image} style={[StyleSheet.absoluteFill, { opacity: 0.75 }]} contentFit="cover" />
                <LinearGradient colors={['transparent', 'rgba(14,14,14,0.85)']} style={StyleSheet.absoluteFill} />
                <View style={styles.legendCardContent}>
                  <Text style={styles.legendLabel}>{legend.label}</Text>
                  <Text style={styles.legendName}>{legend.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.viewAllCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Legends')}
            >
              <MaterialIcons name="arrow-forward" size={22} color={colors.primary} />
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.marginMobile }]}>
          <Text style={styles.sectionTitle}>TODAY'S IRON LESSON</Text>
          <View style={styles.lessonCard}>
            <View style={styles.badge}><Text style={styles.badgeText}>{todaysLesson.tag}</Text></View>
            <Text style={[styles.featuredTitle, { marginTop: spacing.stackSm }]}>{todaysLesson.title}</Text>
            <Text style={styles.lessonBody}>{todaysLesson.body}</Text>
          </View>
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.marginMobile }]}>
          <Text style={styles.sectionTitle}>YOUR PROGRESS</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Current Streak</Text>
              <Text style={[styles.statNum, { color: colors.primary }]}>12</Text>
              <Text style={styles.statLabel}>Days</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Workouts</Text>
              <Text style={styles.statNum}>48</Text>
              <Text style={styles.statLabel}>This Year</Text>
            </View>
            <View style={[styles.statBlock, { flexBasis: '100%' }]}>
              <Text style={styles.statLabel}>Recent PR</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                <Text style={[styles.statNum, { color: colors.primary }]}>225</Text>
                <Text style={styles.statLabel}>LBS</Text>
              </View>
              <Text style={styles.statLabel}>Bench Press</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surfaceContainerLowest },
  content: { paddingBottom: spacing.stackLg },
  hero: { width: '100%', height: 520, justifyContent: 'flex-end', overflow: 'hidden' },
  heroContent: { padding: spacing.marginMobile, gap: spacing.stackSm },
  heroTitle: { ...typography.displayXl, fontSize: 34, lineHeight: 38, color: colors.primary, textTransform: 'uppercase' },
  featuredCard: {
    marginTop: spacing.stackSm,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    padding: spacing.gutter,
  },
  featuredTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.stackSm },
  badge: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' },
  badgeText: { ...typography.labelCaps, color: colors.primary },
  featuredTitle: { ...typography.headlineMd, color: colors.onSurface, textTransform: 'uppercase', marginBottom: 4 },
  featuredSub: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackMd },
  startBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  startBtnText: { ...typography.headlineMd, fontSize: 18, color: colors.onPrimary, textTransform: 'uppercase' },
  startBtnDisabled: { opacity: 0.6 },
  section: { marginTop: spacing.stackLg, gap: spacing.stackSm },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.marginMobile,
  },
  sectionTitle: { ...typography.headlineMd, color: colors.onSurface, textTransform: 'uppercase' },
  viewAll: { ...typography.labelCaps, color: colors.primary },
  legendCard: { width: 220, height: 280, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.md, justifyContent: 'flex-end', overflow: 'hidden' },
  viewAllCard: {
    width: 120,
    height: 280,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainer,
  },
  legendCardContent: { padding: spacing.gutter },
  legendLabel: { ...typography.labelCaps, color: colors.primary, marginBottom: 4 },
  legendName: { ...typography.headlineMd, color: colors.onSurface, textTransform: 'uppercase' },
  lessonCard: { backgroundColor: colors.surfaceContainer, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.md, padding: spacing.stackMd },
  lessonBody: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, backgroundColor: colors.outlineVariant, borderRadius: radius.md, overflow: 'hidden' },
  statBlock: {
    flexBasis: '49.5%',
    backgroundColor: colors.surfaceContainerLowest,
    paddingVertical: spacing.gutter,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: { ...typography.labelCaps, color: colors.onSurfaceVariant },
  statNum: { ...typography.statsNum, color: colors.onSurface },
});
