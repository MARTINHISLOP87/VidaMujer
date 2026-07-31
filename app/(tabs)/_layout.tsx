import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Colors } from '@/theme';

export default function TabLayout() { return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: Colors.rose, tabBarInactiveTintColor: '#9A918D', tabBarStyle: { height: 64, paddingTop: 7 }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' } }}>
  <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }} />
  <Tabs.Screen name="seguimiento" options={{ title: 'Seguimiento', tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} /> }} />
  <Tabs.Screen name="ia" options={{ title: 'IA', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses" color={color} size={size} /> }} />
  <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} /> }} />
</Tabs>; }
