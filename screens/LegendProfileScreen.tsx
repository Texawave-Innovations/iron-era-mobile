import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import IronHeader from '../components/IronHeader';
import ScrollFloat from '../components/ScrollFloat';
import { colors, typography, spacing, radius } from '../theme';

const DEFAULT_PROFILE = {
  headerTitle: 'DORIAN YATES',
  image: { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHkHHZECikW-r_RpzcsECocGWTYkFDP5dE2xFrp6MmHtHMYBAY0TeTGqxjwhHbJFs6TrSePDBy2ymUj7JThEQzoZ2SE_Uk72Jr-nJrY5QC4Q8QCR5I5iW-wqY6NETTUb8_bIeiijpKgdygoHkZM7ytu109SoiQVqN9-R_5oHjdsLnZmYkIi_18-BQnEZtXbk4_cdPRcaa3OtBNNnCqS97FrPHJamkmxaf4u8hhLQY4eBHQWGC4UuWM' },
  tags: ['6X MR. OLYMPIA',],
  heroTitle: 'DORIAN\nYATES',
  trainBtnText: 'TRAIN LIKE DORIAN',
  eraTitle: 'The Blood and Guts Era',
  paragraphs: [
    'Dorian Yates redefined the standards of professional bodybuilding in the 1990s. Emerging from the gritty gyms of Birmingham, England, he brought a level of mass and conditioning that the sport had never seen. He earned the moniker "The Shadow" for his tendency to unexpectedly appear at major contests, decimate the competition, and retreat into obscurity to train.',
    'His legacy extends beyond his six Sandow trophies; it lies in his complete departure from traditional high-volume training. Yates adopted and refined High-Intensity Training (HIT), proving that brief, agonizingly intense workouts were superior for muscle hypertrophy.',
  ],
  philosophy: [
    { icon: 'bolt', title: 'High Intensity', desc: 'One all-out working set to absolute failure.' },
    { icon: 'trending-down', title: 'Lower Volume', desc: 'Maximal recovery through minimal volume.' },
    { icon: 'psychology', title: 'Controlled Execution', desc: 'Strict form, focusing on the negative portion of the rep.' },
  ],
  stats: [
    { label: 'HEIGHT', value: "5'10\"" },
    { label: 'COMP WEIGHT', value: '265 LBS' },
    { label: 'OFF-SEASON WEIGHT', value: '300 LBS' },
    { label: 'OLYMPIA WINS', value: '6', accent: true },
  ],
  ironPlusDesc: "Access Dorian's complete Blood and Guts training logs, exercise mechanics, and nutritional protocols.",
};

const PROFILES: Record<string, typeof DEFAULT_PROFILE> = {
  arnold: {
    headerTitle: 'ARNOLD ',
    image: require('../assets/new-img.webp'),
    tags: ['7X MR. OLYMPIA'],
    heroTitle: 'Austrian\nOak',
    trainBtnText: 'TRAIN LIKE ARNOLD',
    eraTitle: 'The Golden Era',
    paragraphs: [
      'Born July 30, 1947, in Thal, Austria, Arnold Schwarzenegger discovered bodybuilding as a teenager and moved to the United States in 1968 to pursue the sport at Gold\'s Gym in Venice, California. Nicknamed "The Austrian Oak," he became the dominant figure of bodybuilding\'s golden era, winning the Mr. Olympia title seven times between 1970 and 1980.',
      'Schwarzenegger trained with exceptionally high volume and frequency, often working each muscle group from multiple angles across long sessions with fellow legends like Franco Columbu. He championed the "shocking the muscle" principle, constantly varying exercises, rep ranges, and intensity techniques such as supersets, drop sets, and forced reps to prevent the body from adapting and to force continual growth.',
    ],
    philosophy: [
      { icon: 'repeat', title: 'High Volume', desc: 'Multiple exercises per muscle group, hitting every angle.' },
      { icon: 'bolt', title: 'Shock the Muscle', desc: 'Constantly varying exercises and rep ranges to force growth.' },
      { icon: 'groups', title: 'Instinctive Training', desc: 'Listening to the body and adjusting the plan session to session.' },
    ],
    stats: [
      { label: 'HEIGHT', value: "6'2\"" },
      { label: 'COMP WEIGHT', value: '235 LBS' },
      { label: 'OFF-SEASON WEIGHT', value: '260 LBS' },
      { label: 'OLYMPIA WINS', value: '7', accent: true },
    ],
    ironPlusDesc: "Access Arnold's complete Golden Era training logs, exercise mechanics, and nutritional protocols.",
  },
  zane: {
    headerTitle: 'FRANK ZANE',
    image: require('../assets/zane-img.webp'),
    tags: ['3X MR. OLYMPIA'],
    heroTitle: 'FRANK\nZANE',
    trainBtnText: 'TRAIN LIKE ZANE',
    eraTitle: 'The Aesthetic Ideal',
    paragraphs: [
      'Born June 28, 1942, in Kingston, Pennsylvania, Frank Zane won the Mr. Olympia title three consecutive years (1977-1979), proving that a smaller, more proportionate physique could beat out much larger rivals through symmetry, balance, and razor-sharp conditioning.',
      'Nicknamed "The Chemist" for his analytical, almost scientific approach to physique-building, Zane favored moderate volume with strict form and posing practice, emphasizing muscle control, a tapered waist, and the illusion of width through proportion rather than sheer mass.',
    ],
    philosophy: [
      { icon: 'balance', title: 'Symmetry First', desc: 'Train for balance and proportion over raw size.' },
      { icon: 'straighten', title: 'Precision Form', desc: 'Strict, controlled reps to sculpt each muscle deliberately.' },
      { icon: 'visibility', title: 'Posing Practice', desc: 'Daily posing to build muscle control and presentation.' },
    ],
    stats: [
      { label: 'HEIGHT', value: "5'9\"" },
      { label: 'COMP WEIGHT', value: '185 LBS' },
      { label: 'OFF-SEASON WEIGHT', value: '195 LBS' },
      { label: 'OLYMPIA WINS', value: '3', accent: true },
    ],
    ironPlusDesc: "Access Frank's complete aesthetic training logs, exercise mechanics, and nutritional protocols.",
  },
  sergio: {
    headerTitle: 'SERGIO OLIVA',
    image: require('../assets/olivia-img.webp'),
    tags: ['3X MR. OLYMPIA'],
    heroTitle: 'SERGIO\nOLIVA',
    trainBtnText: 'TRAIN LIKE SERGIO',
    eraTitle: 'The Myth',
    paragraphs: [
      'Born July 4, 1941, in Havana, Cuba, Sergio Oliva won the Mr. Olympia title three times (1967-1969) and is remembered as one of the most genetically gifted bodybuilders ever to compete, famous for his 20-inch arms and a freakishly small waist that made his physique appear almost impossible.',
      '"The Myth" trained with heavy, basic compound movements and minimal rest between sets, favoring raw intensity and isolation work over exotic techniques. His combination of natural mass and conditioning pushed even Arnold Schwarzenegger to train harder to compete with him.',
    ],
    philosophy: [
      { icon: 'fitness-center', title: 'Heavy Compounds', desc: 'Basic, heavy lifts to build a foundation of raw mass.' },
      { icon: 'timer', title: 'Minimal Rest', desc: 'Short rest periods to keep intensity and conditioning high.' },
      { icon: 'center-focus-strong', title: 'Targeted Isolation', desc: 'Isolation work to carve detail onto a massive base.' },
    ],
    stats: [
      { label: 'HEIGHT', value: "5'10\"" },
      { label: 'COMP WEIGHT', value: '225 LBS' },
      { label: 'OFF-SEASON WEIGHT', value: '240 LBS' },
      { label: 'OLYMPIA WINS', value: '3', accent: true },
    ],
    ironPlusDesc: "Access Sergio's complete training logs, exercise mechanics, and nutritional protocols.",
  },
  columbu: {
    headerTitle: 'FRANCO COLUMBU',
    image: require('../assets/franco-img.webp'),
    tags: ['2X MR. OLYMPIA'],
    heroTitle: 'FRANCO\nCOLUMBU',
    trainBtnText: 'TRAIN LIKE FRANCO',
    eraTitle: 'The Sardinian Strongman',
    paragraphs: [
      'Born August 7, 1941, in Ollolai, Sardinia, Italy, Franco Columbu was a former boxer and powerlifter who won the Mr. Olympia title twice (1976, 1981). A close training partner of Arnold Schwarzenegger, he brought raw powerlifting strength into the bodybuilding world at a relatively short 5\'5" frame.',
      'Columbu combined heavy strength work, including competitive powerlifting numbers, with bodybuilding hypertrophy training, proving that dense muscle and functional strength could produce a stage-ready physique. He was known for extreme discipline and conditioning, including his famously low body fat at competitions.',
    ],
    philosophy: [
      { icon: 'fitness-center', title: 'Strength Base', desc: 'Powerlifting-style heavy lifts to build dense muscle.' },
      { icon: 'local-fire-department', title: 'Extreme Conditioning', desc: 'Relentless discipline to strip fat before competition.' },
      { icon: 'bolt', title: 'Explosive Power', desc: 'Fast, powerful reps carried over from powerlifting training.' },
    ],
    stats: [
      { label: 'HEIGHT', value: "5'5\"" },
      { label: 'COMP WEIGHT', value: '185 LBS' },
      { label: 'OFF-SEASON WEIGHT', value: '200 LBS' },
      { label: 'OLYMPIA WINS', value: '2', accent: true },
    ],
    ironPlusDesc: "Access Franco's complete strongman training logs, exercise mechanics, and nutritional protocols.",
  },
};

export default function LegendProfileScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const id: string | undefined = route.params?.id;
  const profile = (id && PROFILES[id]) || DEFAULT_PROFILE;

  return (
    <View style={styles.screen}>
      <IronHeader title={profile.headerTitle} showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            source={typeof profile.image === 'string' ? { uri: profile.image } : profile.image}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            contentPosition="top center"
          />
          <LinearGradient colors={['transparent', 'rgba(19,19,19,0.7)', colors.surface]} style={StyleSheet.absoluteFill} />
          <View style={styles.heroContent}>
            <View style={styles.tagRow}>
              {profile.tags.map((t) => (
                <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
              ))}
            </View>
            <ScrollFloat textStyle={styles.heroTitle} duration={1400} distance={22} stagger={0.045}>
              {profile.heroTitle}
            </ScrollFloat>
            <TouchableOpacity style={styles.trainBtn} activeOpacity={0.85}>
              <Text style={styles.trainBtnText}>{profile.trainBtnText}</Text>
              <MaterialIcons name="arrow-forward" size={18} color={colors.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsRow}>
          <Text style={[styles.tab, styles.tabActive]}>BIO</Text>
          <Text style={styles.tab}>PHILOSOPHY</Text>
          <View style={styles.tabLocked}>
            <Text style={styles.tab}>METHODS</Text>
            <MaterialIcons name="lock" size={12} color={colors.primary} />
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.eraTitle}>{profile.eraTitle}</Text>
          {profile.paragraphs.map((p, i) => (
            <Text key={i} style={styles.paragraph}>{p}</Text>
          ))}

          <View style={styles.philosophyGrid}>
            {profile.philosophy.map((p) => (
              <View key={p.title} style={styles.philosophyCard}>
                <MaterialIcons name={p.icon as any} size={28} color={colors.primary} />
                <View>
                  <Text style={styles.philosophyTitle}>{p.title}</Text>
                  <Text style={styles.philosophyDesc}>{p.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.statsCard}>
            {profile.stats.map((s, i) => (
              <View key={s.label} style={[styles.statRow, i < profile.stats.length - 1 && styles.statRowBorder]}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <Text style={[styles.statValue, s.accent && { color: colors.primary }]}>{s.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.ironPlus}>
            <MaterialIcons name="lock" size={32} color={colors.primary} />
            <Text style={styles.ironPlusTitle}>Unlock the System</Text>
            <Text style={styles.ironPlusDesc}>{profile.ironPlusDesc}</Text>
            <TouchableOpacity style={styles.ironPlusBtn}>
              <Text style={styles.ironPlusBtnText}>UPGRADE TO IRON+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { paddingBottom: spacing.stackLg },
  hero: { width: '100%', height: 380, justifyContent: 'flex-end', borderBottomWidth: 1, borderBottomColor: colors.outlineVariant, overflow: 'hidden' },
  heroContent: { padding: spacing.marginMobile, paddingBottom: 12, gap: 4 },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  tag: { borderWidth: 1, borderColor: colors.outline, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: 'rgba(19,19,19,0.7)' },
  tagText: { ...typography.labelCaps, fontSize: 10, color: colors.onSurfaceVariant },
  heroTitle: { ...typography.displayXl, fontSize: 44, lineHeight: 48, color: colors.onSurface, textTransform: 'uppercase', marginBottom: 8 },
  trainBtn: { backgroundColor: colors.primary, borderRadius: radius.sm, paddingVertical: 12, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, alignSelf: 'flex-start' },
  trainBtnText: { ...typography.headlineMd, fontSize: 15, color: colors.onPrimary, textTransform: 'uppercase' },
  tabsRow: { flexDirection: 'row', gap: 24, paddingHorizontal: spacing.marginMobile, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant, paddingBottom: 8, marginTop: 6 },
  tab: { ...typography.labelCaps, color: colors.onSurfaceVariant },
  tabActive: { color: colors.primary },
  tabLocked: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  body: { paddingHorizontal: spacing.marginMobile, paddingTop: 10, paddingBottom: spacing.stackLg, gap: 12 },
  eraTitle: { ...typography.headlineMd, color: colors.primary, textTransform: 'uppercase' },
  paragraph: { ...typography.bodyLg, fontSize: 15, lineHeight: 22, color: colors.onSurfaceVariant },
  philosophyGrid: { gap: 10, marginTop: 4 },
  philosophyCard: { backgroundColor: colors.surfaceContainerHigh, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.md, padding: spacing.marginMobile, gap: 12, minHeight: 110, justifyContent: 'space-between' },
  philosophyTitle: { ...typography.headlineMd, fontSize: 18, color: colors.onSurface, textTransform: 'uppercase' },
  philosophyDesc: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: 4 },
  statsCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.md, padding: spacing.marginMobile },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  statRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
  statLabel: { ...typography.labelCaps, color: colors.onSurfaceVariant },
  statValue: { ...typography.statsNum, color: colors.onSurface },
  ironPlus: { backgroundColor: colors.surfaceContainer, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, padding: spacing.marginMobile, alignItems: 'center', gap: 12 },
  ironPlusTitle: { ...typography.headlineMd, color: colors.onSurface, textTransform: 'uppercase' },
  ironPlusDesc: { ...typography.bodyMd, color: colors.onSurfaceVariant, textAlign: 'center' },
  ironPlusBtn: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.sm, paddingVertical: 10, width: '100%', alignItems: 'center', marginTop: 4 },
  ironPlusBtnText: { ...typography.labelCaps, color: colors.primary },
});

