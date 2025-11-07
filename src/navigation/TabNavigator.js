import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AlarmScreen from '../screens/AlarmScreen';
import ClockScreen from '../screens/ClockScreen';
import StopwatchScreen from '../screens/StopwatchScreen';
import TimerScreen from '../screens/TimerScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Reloj') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Cronómetro') {
            iconName = focused ? 'stopwatch' : 'stopwatch-outline';
          } else if (route.name === 'Alarma') {
            iconName = focused ? 'alarm' : 'alarm-outline';
          } else if (route.name === 'Temporizador') {
            iconName = focused ? 'timer' : 'timer-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#1C1C1E',
        },
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#1C1C1E',
          borderTopColor: '#2C2C2E',
        },
      })}
    >
      <Tab.Screen name="Reloj" component={ClockScreen} />
      <Tab.Screen name="Cronómetro" component={StopwatchScreen} />
      <Tab.Screen name="Alarma" component={AlarmScreen} />
      <Tab.Screen name="Temporizador" component={TimerScreen} />
    </Tab.Navigator>
  );
}