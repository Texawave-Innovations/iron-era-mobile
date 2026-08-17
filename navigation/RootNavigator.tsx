import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme';

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
import ProfileScreen from '../screens/ProfileScreen';
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

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSecondaryContainer,
        tabBarStyle: {
          backgroundColor: colors.surfaceContainerLowest,
          borderTopColor: colors.outlineVariant,
          borderTopWidth: 1,
          height: 76,
          paddingTop: 8,
          paddingBottom: 12,
        },
        tabBarLabelStyle: { fontFamily: 'Oswald_600SemiBold', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name={TAB_ICONS[route.name]} color={color} size={size ?? 22} />
        ),
      })}
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
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
