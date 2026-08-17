import { View, Text, StyleSheet } from 'react-native';
import IronHeader from '../components/IronHeader';
import ScrollFloat from '../components/ScrollFloat';
import { colors, typography } from '../theme';

export default function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={styles.screen}>
      <IronHeader />
      <View style={styles.center}>
        <ScrollFloat textStyle={styles.text} duration={1400} distance={20} stagger={0.045}>
          {title.toUpperCase()}
        </ScrollFloat>
        <Text style={styles.sub}>COMING SOON</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  text: { ...typography.headlineLg, color: colors.onSurface },
  sub: { ...typography.labelCaps, color: colors.onSurfaceVariant },
});
