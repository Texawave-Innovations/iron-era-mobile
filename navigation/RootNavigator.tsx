import { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, Text, TouchableOpacity, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { darkColors, typography, radius } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import LegendsScreen from '../screens/LegendsScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import LegendProfileScreen from '../screens/LegendProfileScreen';
import WorkoutSplitScreen from '../screens/WorkoutSplitScreen';
import ArnoldSplitScreen from '../screens/ArnoldSplitScreen';
import MentzerSplitScreen from '../screens/MentzerSplitScreen';
import PlatzSplitScreen from '../screens/PlatzSplitScreen';
import LevroneSplitScreen from '../screens/LevroneSplitScreen';
import CircuitSplitScreen from '../screens/CircuitSplitScreen';
import WorkoutExecutionScreen from '../screens/WorkoutExecutionScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProgressScreen from '../screens/ProgressScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  Home: 'home',
  Legends: 'military-tech',
  Workouts: 'fitness-center',
  Progress: 'monitor',
};

function TabSlot({ route, isActive, onPress, label, scale }: any) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isActive ? { selected: true } : {}}
      onPress={onPress}
      activeOpacity={0.8}
      style={navStyles.tabSlot}
    >
      <Animated.View style={[navStyles.tabSlotInner, isActive ? { transform: [{ scale }] } : null]}>
        <MaterialIcons
          name={TAB_ICONS[route.name]}
          color={isActive ? darkColors.charcoal : darkColors.secondary}
          size={20}
        />
        <Text
          style={isActive ? navStyles.labelActive : navStyles.labelInactive}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function FloatingTabBar({ state, descriptors, navigation }: any) {
  const routeCount = state.routes.length;
  const [barWidth, setBarWidth] = useState(0);
  const slotWidth = barWidth / routeCount || 0;

  const pillX = useRef(new Animated.Value(0)).current;
  const pillScale = useRef(new Animated.Value(1)).current;
  const dragStartX = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    if (!barWidth || dragging.current) return;
    Animated.spring(pillX, { toValue: state.index * slotWidth, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
  }, [state.index, barWidth]);

  const navigateToIndex = (index: number) => {
    const route = state.routes[index];
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (index !== state.index && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt, gesture) =>
        Math.abs(gesture.dx) > 6 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5,
      onPanResponderGrant: () => {
        dragging.current = true;
        dragStartX.current = state.index * slotWidth;
        Animated.spring(pillScale, { toValue: 1.06, useNativeDriver: true, speed: 20, bounciness: 10 }).start();
      },
      onPanResponderMove: (_evt, gesture) => {
        if (!slotWidth) return;
        const raw = dragStartX.current + gesture.dx;
        const clamped = Math.max(0, Math.min(raw, slotWidth * (routeCount - 1)));
        pillX.setValue(clamped);
      },
      onPanResponderRelease: (_evt, gesture) => {
        dragging.current = false;
        Animated.spring(pillScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }).start();
        if (!slotWidth) return;
        const raw = dragStartX.current + gesture.dx;
        const clamped = Math.max(0, Math.min(raw, slotWidth * (routeCount - 1)));
        const nearestIndex = Math.round(clamped / slotWidth);
        Animated.spring(pillX, { toValue: nearestIndex * slotWidth, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
        navigateToIndex(nearestIndex);
      },
      onPanResponderTerminate: () => {
        dragging.current = false;
        Animated.spring(pillScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }).start();
        Animated.spring(pillX, { toValue: state.index * slotWidth, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
      },
    })
  ).current;

  return (
    <View style={navStyles.barWrapper} pointerEvents="box-none">
      <View
        style={navStyles.bar}
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        {barWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              navStyles.pill,
              {
                width: slotWidth,
                transform: [{ translateX: pillX }, { scale: pillScale }],
              },
            ]}
          />
        )}
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isActive = state.index === index;
          const label = (options.tabBarLabel ?? options.title ?? route.name).toString().toUpperCase();

          return (
            <TabSlot
              key={route.key}
              route={route}
              isActive={isActive}
              onPress={() => navigateToIndex(index)}
              label={label}
              scale={pillScale}
            />
          );
        })}
      </View>
    </View>
  );
}

const navStyles = {
  barWrapper: {
    position: 'absolute' as const,
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center' as const,
  },
  bar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    width: '92%' as const,
    maxWidth: 400,
    height: 80,
    paddingVertical: 6,
    paddingHorizontal: 0,
    borderRadius: radius.pill,
    backgroundColor: darkColors.charcoal,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden' as const,
  },
  pill: {
    position: 'absolute' as const,
    left: 0,
    top: 6,
    bottom: 6,
    borderRadius: radius.pill,
    backgroundColor: darkColors.primary,
  },
  tabSlot: {
    flex: 1,
    height: '100%' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  tabSlotInner: {
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 3,
  },
  labelActive: { ...typography.labelCaps, fontSize: 8.5, letterSpacing: 0.6, color: darkColors.charcoal, textAlign: 'center' as const, width: '100%' as const },
  labelInactive: { ...typography.labelCaps, fontSize: 8.5, letterSpacing: 0.6, color: darkColors.secondary, textAlign: 'center' as const, width: '100%' as const },
};

function Tabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Legends" component={LegendsScreen} />
      <Tab.Screen name="Workouts" component={WorkoutsScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="LegendProfile" component={LegendProfileScreen} />
      <Stack.Screen name="WorkoutSplit" component={WorkoutSplitScreen} />
      <Stack.Screen name="ArnoldSplit" component={ArnoldSplitScreen} />
      <Stack.Screen name="MentzerSplit" component={MentzerSplitScreen} />
      <Stack.Screen name="PlatzSplit" component={PlatzSplitScreen} />
      <Stack.Screen name="LevroneSplit" component={LevroneSplitScreen} />
      <Stack.Screen name="CircuitSplit" component={CircuitSplitScreen} />
      <Stack.Screen name="WorkoutExecution" component={WorkoutExecutionScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
