// components/shared/AppHeader.tsx
import { Colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

type LanguageCode = "es" | "mi" | "ma";

const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  es: "ESPAÑOL",
  mi: "MISKITO",
  ma: "MAYAGNA",
};

type Props = {
  /** Nombre de la usuaria */
  userName: string;
  /** Código de idioma */
  language: LanguageCode;
  /** Subtítulo debajo del header (ej: "Ciclo Menstrual y Autocuidado") */
  subtitle: string;
  /** Acción al presionar ícono luna (izquierda) */
  onMoonPress?: () => void;

  /** Acción al presionar ícono configuración (derecha) */
  onSettingsPress?: () => void;
  /** Acción al presionar selector de idioma */
  onLanguagePress?: () => void;
};

export default function AppHeader({
  userName,
  language,
  subtitle,
  onMoonPress,
  onSettingsPress,
  onLanguagePress,
}: Props) {
  return (
    <View style={styles.wrapper}>
      {/* ── Área degradada ── */}
      <LinearGradient
        colors={[Colors.rose, Colors.rose, Colors.amber]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        {/* Fila superior: luna a la izquierda, iconos a la derecha */}
        <View style={styles.topRow}>
          <Pressable
            onPress={onMoonPress}
            style={styles.iconButton}
            android_ripple={{
              color: "rgba(255,255,255,0.15)",
              borderless: true,
            }}
          >
            <Ionicons name="moon" size={22} color={Colors.white} />
          </Pressable>
          <View style={styles.rightIcons}>
            {/* Nombre de la app y usuaria */}
            <Text style={styles.userName}>{userName.toLowerCase()}</Text>
            <Pressable
              onPress={onSettingsPress}
              style={styles.iconButtonSmall}
              android_ripple={{
                color: "rgba(255,255,255,0.15)",
                borderless: true,
              }}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={Colors.white}
              />
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      {/* ── Área crema inferior ── */}
      <View style={styles.bottomBar}>
        <Pressable
          onPress={onLanguagePress}
          style={styles.langButton}
          android_ripple={{ color: "rgba(120,80,60,0.08)", borderless: true }}
        >
          <Ionicons name="globe-outline" size={16} color="#7C5C3D" />
          <Text style={styles.langText}>{LANGUAGE_LABELS[language]}</Text>
        </Pressable>

        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    overflow: "hidden",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    backgroundColor: "#FFFBEE",
  },
  gradient: {
    paddingTop: 35,
    paddingHorizontal: 18,
    paddingBottom: 5,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  rightIcons: {
    flexDirection: "row",
    gap: 6,
  },
  iconButtonSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.white,
    letterSpacing: 2.5,
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.white,
    lineHeight: 30,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#FFFBEE",
  },
  langButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  langText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7C5C3D",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    fontStyle: "italic",
    fontWeight: "500",
    color: "#7C5C3D",
  },
});
