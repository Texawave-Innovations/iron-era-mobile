import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import IronHeader from '../components/IronHeader';
import ScrollFloat from '../components/ScrollFloat';
import { darkColors, typography, spacing, radius } from '../theme';
import { useThemeMode } from '../hooks/useThemeMode';

// const ERAS = ['ALL ERAS', "60s - PIONEERS", "70s - GOLDEN AGE", "80s - MASS MONSTERS", "90s - UNCHARTED"];

const LEGENDS = [
  {
    id: 'arnold',
    tags: ['HIGH VOLUME', '70s'],
    name: 'Arnold\nSchwarzenegger',
    desc: 'The Austrian Oak. Master of volume, intense mental focus, and ruthless supersets.',
    image: require('../assets/new-img.webp'),
  },
  {
    id: 'zane',
    tags: ['SYMMETRY FOCUS', '70s'],
    name: 'Frank\nZane',
    desc: 'The Chemist. Precision training, immaculate proportions, and the legendary vacuum.',
    image: require('../assets/zane-img.webp'),
  },
  {
    id: 'sergio',
    tags: ['HEAVY ISOLATION', '60s'],
    name: 'Sergio\nOliva',
    desc: 'The Myth. Genetic superiority combined with relentless heavy lifting and minimal rest.',
    image: require('../assets/olivia-img.webp'),
  },
  {
    id: 'columbu',
    tags: ['POWERBUILDING', '70s'],
    name: 'Franco\nColumbu',
    desc: 'The Sardinian Strongman. Blending raw powerlifting strength with bodybuilding aesthetics.',
    image: require('../assets/franco-img.webp'),
  },
];

export default function LegendsScreen() {
  const { colors } = useThemeMode();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const navigation = useNavigation<any>();

  return (
    <View style={styles.screen}>
      <IronHeader title="GYMCOM" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <ScrollFloat textStyle={styles.pageTitle} duration={1400} distance={22} stagger={0.045}>
            THE LEGENDS.
          </ScrollFloat>
          <Text style={styles.pageSub}>STUDY THE MEN WHO BUILT THE GOLDEN ERA.</Text>
        </View>

        {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {ERAS.map((era, i) => (
            <View key={era} style={[styles.filterChip, i === 0 && styles.filterChipActive]}>
              <Text style={[styles.filterText, i === 0 && styles.filterTextActive]}>{era}</Text>
            </View> */}
        {/*))}
        </ScrollView> */}

        <View style={styles.grid}>
          {LEGENDS.map((legend) => (
            <TouchableOpacity
              key={legend.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('LegendProfile', { id: legend.id })}
            >
              <ImageBackground
                source={typeof legend.image === 'string' ? { uri: legend.image } : legend.image}
                style={StyleSheet.absoluteFill}
                imageStyle={{ resizeMode: 'cover' }}
                resizeMode="cover"
              />
              <LinearGradient colors={['transparent', 'rgba(19,19,19,0.75)', 'rgba(19,19,19,0.95)']} style={StyleSheet.absoluteFill} />
              <View style={styles.cardContent}>
                <View style={styles.tagRow}>
                  {legend.tags.map((t) => (
                    <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
                  ))}
                </View>
                <Text style={styles.cardName}>{legend.name}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{legend.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const makeStyles = (colors: ReturnType<typeof useThemeMode>['colors']) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.stackLg },
  pageHeader: {
    padding: spacing.marginMobile,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHighest,
    gap: spacing.stackSm,
  },
  pageTitle: { ...typography.displayXl, fontSize: 44, lineHeight: 50, paddingTop: 6, color: colors.onSurface, textTransform: 'uppercase' },
  pageSub: { ...typography.bodyLg, color: colors.onSurfaceVariant },
  filterRow: { gap: spacing.gutter, paddingHorizontal: spacing.marginMobile, paddingVertical: spacing.stackMd },
  filterChip: { paddingHorizontal: 20, paddingVertical: 8, borderWidth: 1, borderColor: colors.surfaceContainerHighest, backgroundColor: colors.surfaceContainerLow, borderRadius: radius.pill },
  filterChipActive: { borderColor: colors.primary, backgroundColor: 'rgba(233,193,118,0.1)' },
  filterText: { ...typography.labelCaps, color: colors.onSurfaceVariant },
  filterTextActive: { color: colors.primary },
  grid: { paddingHorizontal: spacing.marginMobile, gap: spacing.stackMd },
  card: { aspectRatio: 3 / 4, backgroundColor: colors.surfaceContainer, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.md, justifyContent: 'flex-end', overflow: 'hidden' },
  cardContent: { padding: spacing.stackMd },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.stackSm },
  tag: { borderWidth: 1, borderColor: darkColors.outlineVariant, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: 'rgba(28,27,27,0.8)' },
  tagText: { ...typography.labelCaps, color: darkColors.onSurfaceVariant },
  cardName: { ...typography.headlineLgMobile, fontSize: 26, lineHeight: 32, color: darkColors.onSurface, textTransform: 'uppercase', marginBottom: 8 },
  cardDesc: { ...typography.bodyMd, color: darkColors.onSurfaceVariant },
});
