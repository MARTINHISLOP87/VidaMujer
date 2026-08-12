// Importamos nuestro botón de prueba SQLite.
import DatabaseTestButton from "@/storage/database/DatabaseTestButton";

// Importamos los colores y espacios globales.
import { Colors, Spacing } from "@/theme";

// Importamos los iconos de Expo.
import { Ionicons } from "@expo/vector-icons";

// Importamos LinearGradient.
import { LinearGradient } from "expo-linear-gradient";

// Importamos el router de Expo Router.
import { router } from "expo-router";

// Importamos componentes de React Native.
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Pantalla inicial de VidaMujer.
export default function WelcomeScreen() {
  // Renderizamos la pantalla.
  return (
    <SafeAreaView style={styles.safe}>
      {/* Fondo degradado de la pantalla. */}
      <LinearGradient colors={["#FFF0F3", "#FFF8F4"]} style={styles.container}>
        {/* Sección superior. */}
        <View style={styles.hero}>
          {/* Logo de VidaMujer. */}
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="stretch"
          />

          {/* Nombre de la aplicación. */}
          <Text style={styles.brand}>Vida Mujer</Text>

          {/* Descripción de la aplicación. */}
          <Text style={styles.tagline}>
            Tu acompañamiento integral para vivir cada etapa con bienestar y
            sabiduría.
          </Text>
        </View>

        {/* Tarjeta inferior. */}
        <View style={styles.card}>
          {/* Título. */}
          <Text style={styles.cardTitle}>Bienvenida</Text>

          {/* Descripción. */}
          <Text style={styles.cardText}>
            Personalizaremos tu experiencia con algunos datos sencillos y
            privados.
          </Text>

          {/* Botón temporal para probar SQLite. */}
          <DatabaseTestButton />

          {/* Botón para comenzar el registro. */}
          <Pressable
            onPress={() => router.push("/onboarding/register")}
            style={styles.button}
          >
            {/* Texto del botón. */}
            <Text style={styles.buttonText}>Comenzar</Text>

            {/* Icono de flecha. */}
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          </Pressable>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Definimos los estilos de la pantalla.
const styles = StyleSheet.create({
  // Área segura.
  safe: {
    flex: 1,
    backgroundColor: "#FFF0F3",
  },

  // Contenedor principal.
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: Spacing.lg,
  },

  // Sección superior.
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // Logo.
  logo: {
    width: 100,
    height: 100,
    marginBottom: 2,
  },

  // Nombre de la aplicación.
  brand: {
    fontSize: 32,
    color: Colors.roseDark,
    fontWeight: "800",
  },

  // Texto descriptivo.
  tagline: {
    color: Colors.muted,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 12,
    maxWidth: 310,
  },

  // Tarjeta inferior.
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.lg,
    shadowColor: "#6A4A4A",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },

  // Título de la tarjeta.
  cardTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: Colors.text,
  },

  // Descripción de la tarjeta.
  cardText: {
    color: Colors.muted,
    lineHeight: 20,
    marginTop: 7,
    marginBottom: 20,
  },

  // Botón comenzar.
  button: {
    backgroundColor: Colors.rose,
    borderRadius: 13,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  // Texto del botón.
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
