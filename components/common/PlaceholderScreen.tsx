import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/theme';
export function PlaceholderScreen({ title, text }: { title: string; text: string }) { return <SafeAreaView style={styles.safe}><View style={styles.container}><Text style={styles.title}>{title}</Text><Text style={styles.text}>{text}</Text></View></SafeAreaView>; }
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: Colors.background }, container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' }, title: { fontSize: 26, color: Colors.text, fontWeight: '800' }, text: { color: Colors.muted, textAlign: 'center', marginTop: 10, lineHeight: 21 } });
