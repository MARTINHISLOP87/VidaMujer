import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '@/theme';

export function ScreenLoader() {
  return <View style={styles.container}><ActivityIndicator size="large" color={Colors.rose} /></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background } });
