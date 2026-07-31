import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { LanguageCode, WomanStage } from '@/types/profile';
import { Colors } from '@/theme';

const descriptions: Record<WomanStage, Record<LanguageCode, string>> = {
  menstruation: { es: 'Para adolescentes y adultas en periodo fértil. Calendario de flujo lunar, fertilidad y autocuidado de cólicos.', mi: 'Kati Laka dukiara, mairin pain laka nani sa. Kati siska, mairin biliki mairin pain siska hilp daukanka.' },
  pregnancy: { es: 'Acompañamiento prenatal semana a semana. Cálculo de fecha de parto, tamaño de la wawa y pautas de seguridad familiar.', mi: 'Bliksa laka, luhpia siska sapa simana karkara. Luhpia yuribia tukan bara yapti pain laka tawan dukiara.' },
  menopause: { es: 'Para adultas mayores transitando al cese fértil. Control de bochornos, salud de huesos y consejos para vivir en plenitud y sabiduría.', mi: 'Mairin almuk mairin kurak pyua ra dukiara sa. Lapta kani kaisa, dusa bara kupia pain karkara dukiara sa.' },
};
export function StageDescription({ stage, language }: { stage: WomanStage; language: LanguageCode }) { return <View style={styles.box}><View style={styles.titleRow}><Ionicons name="sparkles" size={15} color={Colors.rose} /><Text style={styles.title}>Orientación de la etapa:</Text></View><Text style={styles.body}>{descriptions[stage][language]}</Text></View>; }
const styles = StyleSheet.create({ box: { backgroundColor: '#FAF8F7', borderWidth: 1, borderColor: '#EEE9E7', borderRadius: 13, padding: 14 }, titleRow: { flexDirection: 'row', gap: 5, alignItems: 'center', marginBottom: 5 }, title: { color: Colors.text, fontWeight: '600', fontSize: 12 }, body: { color: '#57534E', fontSize: 12, lineHeight: 18 } });
