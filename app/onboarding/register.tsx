import { LanguageSelector } from "@/components/onboarding/LanguageSelector";
import { StageDescription } from "@/components/onboarding/StageDescription";
import { StageSelector } from "@/components/onboarding/StageSelector";

import { useApp } from "@/contexts/AppContext";

import { registerUser } from "@/app/onboarding/RegisterUser";

import { Colors, Spacing } from "@/theme";
import { LanguageCode, WomanStage } from "@/types/profile";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

import AndeanBanner from "@/components/onboarding/AndeanBanner";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function RegisterScreen() {
  const { completeOnboarding } = useApp();
  const [name, setName] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("es");
  const [stage, setStage] = useState<WomanStage>("menstruation");
  const [cycleLength, setCycleLength] = useState(28);
  const [lmpDate, setLmpDate] = useState("");
  const [saving, setSaving] = useState(false);

  const finish = async () => {
    // Validamos la FUR solamente
    // cuando la etapa seleccionada es embarazo.
    if (stage === "pregnancy" && !/^\d{4}-\d{2}-\d{2}$/.test(lmpDate)) {
      // Informamos a la usuaria que debe introducir la fecha.
      Alert.alert(
        "Fecha requerida",
        "Escribe tu FUR con el formato AAAA-MM-DD.",
      );

      // Detenemos el proceso.
      return;
    }

    // Activamos el estado visual de guardado.
    setSaving(true);

    try {
      // Registramos realmente la usuaria en SQLite.
      const databaseUser = await registerUser({
        // Guardamos el nombre escrito.
        name: name.trim() || "Hermana / Warmisunchis",

        // Guardamos el código del idioma.
        language,

        // Guardamos la etapa.
        stage,

        // Guardamos la duración del ciclo
        // solamente cuando corresponde.
        cycleLength: stage === "menstruation" ? cycleLength : undefined,
      });

      // Creamos la fecha de actualización
      // para mantener el modelo actual del contexto.
      const now = new Date().toISOString();

      // Actualizamos el estado global de la aplicación.
      await completeOnboarding({
        // IMPORTANTE:
        // Ahora utilizamos el ID real generado por SQLite.
        id: String(databaseUser.userId),

        // Nombre almacenado realmente.
        name: databaseUser.displayName,

        // Idioma seleccionado.
        language: databaseUser.languageCode as LanguageCode,

        // Etapa seleccionada.
        stage: databaseUser.stageCode as WomanStage,

        // Duración del ciclo.
        cycleLength: stage === "menstruation" ? cycleLength : undefined,

        // FUR cuando corresponde.
        lmpDate: stage === "pregnancy" ? lmpDate : undefined,

        // Marcamos el onboarding como completado.
        onboarded: true,

        // Fecha de creación.
        createdAt: now,

        // Fecha de actualización.
        updatedAt: now,
      });

      // Navegamos al dashboard.
      router.replace("/(tabs)/symptoms");
    } catch (error) {
      // Mostramos en consola el error técnico.
      console.error("Error al guardar la usuaria en SQLite:", error);

      // Informamos a la usuaria.
      Alert.alert(
        "No se pudo guardar",
        "Ocurrió un problema al guardar tu registro. Intenta nuevamente.",
      );
    } finally {
      // Quitamos el estado de guardado
      // independientemente de si hubo éxito o error.
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          <View style={styles.card}>
            <AndeanBanner />
            <View style={styles.content}>
              <View>
                <Text style={styles.label}>
                  ¿Cuál es tu nombre? o ¿Cómo te gustaría que te llamemos?
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Ej: María, Juana, Sisa..."
                  placeholderTextColor="#A8A29E"
                  style={styles.input}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
              <LanguageSelector value={language} onChange={setLanguage} />
              <StageSelector
                value={stage}
                language={language}
                onChange={setStage}
              />
              <StageDescription stage={stage} language={language} />
              {stage === "pregnancy" && (
                <View style={[styles.extra, styles.pregnancy]}>
                  <Text style={[styles.extraLabel, { color: "#A95026" }]}>
                    ¿Cuándo fue el inicio de tu última menstruación (FUR)?
                  </Text>
                  <TextInput
                    value={lmpDate}
                    onChangeText={setLmpDate}
                    placeholder="AAAA-MM-DD"
                    placeholderTextColor="#A8A29E"
                    style={styles.input}
                    keyboardType="numbers-and-punctuation"
                    maxLength={10}
                  />
                  <Text style={styles.help}>
                    Esto nos ayuda a calcular las semanas de gestación y la
                    fecha probable de parto.
                  </Text>
                </View>
              )}
              {stage === "menstruation" && (
                <View style={[styles.extra, styles.menstruation]}>
                  <Text style={[styles.extraLabel, { color: Colors.roseDark }]}>
                    ¿Cuántos días dura habitualmente tu ciclo completo?
                  </Text>
                  <View style={styles.counterRow}>
                    <Pressable
                      onPress={() =>
                        setCycleLength(Math.max(21, cycleLength - 1))
                      }
                      style={styles.counterButton}
                    >
                      <Ionicons
                        name="remove"
                        size={20}
                        color={Colors.roseDark}
                      />
                    </Pressable>
                    <Text style={styles.counter}>{cycleLength} días</Text>
                    <Pressable
                      onPress={() =>
                        setCycleLength(Math.min(40, cycleLength + 1))
                      }
                      style={styles.counterButton}
                    >
                      <Ionicons name="add" size={20} color={Colors.roseDark} />
                    </Pressable>
                  </View>
                  <Text style={styles.help}>
                    Por defecto son 28 días, de un período menstrual al
                    siguiente.
                  </Text>
                </View>
              )}
              <Pressable
                disabled={saving}
                onPress={finish}
                style={({ pressed }) => [
                  styles.finish,
                  pressed && styles.pressed,
                  saving && styles.disabled,
                ]}
              >
                <Text style={styles.finishText}>
                  {saving ? "Guardando..." : "Iniciar acompañamiento"}
                </Text>
                <Ionicons name="sparkles" size={18} color={Colors.white} />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF3F4" },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: 16, justifyContent: "center" },
  card: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    backgroundColor: Colors.white,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#6B3F47",
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 5,
  },
  content: { padding: Spacing.lg, gap: 21 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 9,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E6E0DD",
    color: Colors.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    backgroundColor: Colors.white,
  },
  extra: { borderRadius: 13, padding: 14, gap: 10, borderWidth: 1 },
  pregnancy: { backgroundColor: "#FFF8F2", borderColor: "#FBE2D1" },
  menstruation: { backgroundColor: "#FFF8FA", borderColor: "#F9DFE7" },
  extraLabel: { fontSize: 13, fontWeight: "700", lineHeight: 18 },
  help: { color: Colors.muted, fontSize: 11, lineHeight: 16 },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.roseLight,
    alignItems: "center",
    justifyContent: "center",
  },
  counter: {
    fontSize: 17,
    color: Colors.roseDark,
    fontWeight: "700",
    minWidth: 70,
    textAlign: "center",
  },
  finish: {
    backgroundColor: Colors.rose,
    paddingVertical: 15,
    borderRadius: 13,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: Colors.rose,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 2,
  },
  finishText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
    textTransform: "none",
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.55 },
});
