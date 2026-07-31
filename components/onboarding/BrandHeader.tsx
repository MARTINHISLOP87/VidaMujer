import { Colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export function BrandHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Sumak Kawsay</Text>
      </View>
      <View style={styles.icon}>
        <Ionicons name="heart" size={32} color="#FFF4F6" />
      </View>
      <Text style={styles.title}>Vida Mujer</Text>
      <Text style={styles.subtitle}>
        Acompañamiento Integral y Sabiduría para la Salud de la Mujer
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 25,
    backgroundColor: Colors.rose,
  },
  badge: {
    position: "absolute",
    right: 14,
    top: 14,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.20)",
  },
  badgeText: { color: Colors.white, fontSize: 10, letterSpacing: 0.6 },
  icon: { marginBottom: 8 },
  title: { color: Colors.white, fontSize: 25, fontWeight: "700" },
  subtitle: {
    color: "#FFF5F6",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
    lineHeight: 17,
  },
});
