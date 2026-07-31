import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AppProvider } from '@/contexts/AppContext';

export default function RootLayout() {
  return <AppProvider><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, animation: 'fade' }} /></AppProvider>;
}
