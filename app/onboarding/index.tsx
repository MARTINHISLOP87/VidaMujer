import { Colors, Spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#FFF0F3", "#FFF8F4"]} style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.heart}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              resizeMode="stretch"
            />
          </View>

          <Text style={styles.brand}>Vida Mujer</Text>
          <Text style={styles.tagline}>
            Tu acompañamiento integral para vivir cada etapa con bienestar y
            sabiduría.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bienvenida</Text>
          <Text style={styles.cardText}>
            Personalizaremos tu experiencia con algunos datos sencillos y
            privados.
          </Text>
          <Pressable
            onPress={() => router.push("/onboarding/register")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Comenzar</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          </Pressable>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF0F3" },
  container: { flex: 1, justifyContent: "space-between", padding: Spacing.lg },
  hero: { flex: 1, alignItems: "center", justifyContent: "center" },
  logo: { width: 100, height: 100, marginBottom: 2 },
  heart: {
    width: 130,
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 65,
    backgroundColor: Colors.surface,
    shadowColor: Colors.rose,
    shadowOpacity: 0.15,
    shadowRadius: 22,
    elevation: 5,
    marginBottom: 24,
  },
  brand: { fontSize: 32, color: Colors.roseDark, fontWeight: "800" },
  tagline: {
    color: Colors.muted,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 12,
    maxWidth: 310,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.lg,
    shadowColor: "#6A4A4A",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  cardTitle: { fontSize: 21, fontWeight: "700", color: Colors.text },
  cardText: {
    color: Colors.muted,
    lineHeight: 20,
    marginTop: 7,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.rose,
    borderRadius: 13,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
});
