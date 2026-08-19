import { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ScrollFloat from './ScrollFloat';
import { typography, spacing, radius } from '../theme';
import { useThemeMode } from '../hooks/useThemeMode';

type Props = {
  title?: string;
  onMenuPress?: () => void;
  showBack?: boolean;
  onBackPress?: () => void;
};

const MENU_ITEMS = [
  { key: 'Settings', label: 'Settings', icon: 'settings' as const },
];

export default function IronHeader({ title = 'GYMCOM', onMenuPress, showBack, onBackPress }: Props) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [menuOpen, setMenuOpen] = useState(false);
  const { colors } = useThemeMode();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
      return;
    }
    setMenuOpen(true);
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top, height: 56 + insets.top }]}>
      <TouchableOpacity onPress={showBack ? onBackPress : handleMenuPress} hitSlop={10}>
        <MaterialIcons name={showBack ? 'arrow-back' : 'menu'} size={24} color={colors.primary} />
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <TouchableOpacity hitSlop={10}>
      </TouchableOpacity>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.menuOverlay} onPress={() => setMenuOpen(false)}>
          <View style={[styles.menuCard, { top: insets.top + 56 }]}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate(item.key);
                }}
              >
                <MaterialIcons name={item.icon} size={18} color={colors.primary} />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const makeStyles = (colors: ReturnType<typeof useThemeMode>['colors']) => StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.marginMobile,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    ...typography.headlineLgMobile,
    fontSize: 22,
    lineHeight: 26,
    color: colors.primary,
    textAlign: 'center',
  },
  iron: {
    ...typography.labelCaps,
    color: colors.primary,
  },
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  menuCard: {
    position: 'absolute',
    left: spacing.marginMobile,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.sm,
    paddingVertical: 6,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  menuItemText: { ...typography.labelCaps, fontSize: 13, color: colors.onSurface },
});

