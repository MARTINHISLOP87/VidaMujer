import { Colors } from "@/theme";
import { LanguageCode, WomanStage } from "@/types/profile";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

const stages: {
  key: WomanStage;
  title: string;
  subtitle: string;
  miskito: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  background: string;
}[] = [
  {
    key: "menstruation",
    title: "Ciclo Menstrual",
    subtitle: "Control lunar, cólicos, días fértiles",
    miskito: "Kati Laka",
    icon: "moon",
    color: Colors.rose,
    background: Colors.roseLight,
  },
  {
    key: "pregnancy",
    title: "Embarazo / Gestación",
    subtitle: "Semana a semana, tamaño del bebe, señales de alerta",
    miskito: "Bliksa Laka",
    icon: "heart",
    color: Colors.orange,
    background: Colors.orangeLight,
  },
  {
    key: "menopause",
    title: "Menopausia",
    subtitle: "Bochornos, salud cardíaca y huesos",
    miskito: "Mairin Almuk",
    icon: "compass",
    color: Colors.amber,
    background: Colors.amberLight,
  },
];

export function StageSelector({
  value,
  language,
  onChange,
}: {
  value: WomanStage;
  language: LanguageCode;
  onChange: (stage: WomanStage) => void;
}) {
  return (
    <View>
      <Text style={styles.label}>
        Cuidado personalizado según tu etapa actual:
      </Text>
      <View style={styles.list}>
        {stages.map((stage) => (
          <Pressable
            key={stage.key}
            onPress={() => onChange(stage.key)}
            style={[
              styles.card,
              value === stage.key && {
                borderColor: stage.color,
                backgroundColor: stage.background,
              },
            ]}
          >
            <View style={[styles.icon, { backgroundColor: stage.background }]}>
              <Ionicons name={stage.icon} size={21} color={stage.color} />
            </View>
            <View style={styles.content}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{stage.title}</Text>
                {language === "mi" && (
                  <Text style={styles.chip}>{stage.miskito}</Text>
                )}
              </View>
              <Text style={styles.subtitle}>{stage.subtitle}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 10,
  },
  list: { gap: 10 },
  card: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#F5F1EF",
    alignItems: "center",
    backgroundColor: Colors.roseLight,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  content: { flex: 1 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  title: { fontWeight: "700", color: Colors.text, fontSize: 14 },
  chip: {
    color: Colors.muted,
    backgroundColor: "#F3F0EE",
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
    fontSize: 10,
  },
  subtitle: { marginTop: 3, fontSize: 12, color: Colors.muted, lineHeight: 16 },
});
