import { Colors } from "@/theme";
import { MenopauseChecklist } from "@/types/menopause"; // Importación de tipos globales
import { LanguageCode } from "@/types/profile";
import { Feather, Ionicons } from "@expo/vector-icons"; // Íconos vectoriales de Expo
import { LinearGradient } from "expo-linear-gradient"; // Componente para gradientes en Expo
import { Sun } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import AppHeader from "../onboarding/AppHeader";
// Interfaz de propiedades recibidas por el componente
interface MenopauseFlowProps {
  checklist: MenopauseChecklist;
  onUpdateChecklist: (checklist: MenopauseChecklist) => void;
  language: LanguageCode;
  username?: string;
}

export default function MenopauseFlow({
  checklist,
  onUpdateChecklist,
  username = "Hermana",
  language,
}: MenopauseFlowProps) {
  // Estado para controlar la activación de la guía de respiración
  const [breathingActive, setBreathingActive] = useState(false);
  // Temporizador en segundos (inicia en 60s)
  const [breathTimer, setBreathTimer] = useState(60);
  // Fase actual del ciclo de respiración consciente
  const [breathPhase, setBreathPhase] = useState<"Inhala" | "Retén" | "Exhala">(
    "Inhala",
  );
  // Registrar el nivel de intensidad del último bochorno seleccionado
  const [lastBochornoIntensity, setLastBochornoIntensity] = useState<
    "bajo" | "medio" | "alto" | null
  >(null);

  // Efecto secundario para controlar el temporizador y el cambio cíclico de fase de respiración
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | undefined;
    if (breathingActive && breathTimer > 0) {
      timerId = setTimeout(() => {
        setBreathTimer((prev) => prev - 1);

        // Cambiar la fase de respiración cada 4 segundos de manera cíclica (12s por ciclo total)
        const sec = 60 - breathTimer;
        const mod = sec % 12;
        if (mod < 4) {
          setBreathPhase("Inhala");
        } else if (mod < 8) {
          setBreathPhase("Retén");
        } else {
          setBreathPhase("Exhala");
        }
      }, 1000);
    } else if (breathTimer === 0) {
      // Finalización automática al llegar a 0
      setBreathingActive(false);
      setBreathTimer(60);
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [breathingActive, breathTimer]);

  // Alterna el estado de un ítem en la lista de verificación
  const handleToggleCheck = (key: keyof MenopauseChecklist) => {
    const updated = {
      ...checklist,
      [key]: !checklist[key],
    };
    onUpdateChecklist(updated);
  };

  // Registra la intensidad del bochorno e inicia automáticamente el ejercicio de enfriamiento
  const handleBochornoLog = (intensity: "bajo" | "medio" | "alto") => {
    setLastBochornoIntensity(intensity);
    setBreathingActive(true);
    setBreathTimer(60);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <AppHeader
        userName={username}
        language={language}
        subtitle="Menopausia"
        onMoonPress={() => console.log("luna")}
        onSettingsPress={() => console.log("ajustes")}
        onLanguagePress={() => console.log("idioma")}
      />
      {/* 1. PANEL BOCHORNÓMETRO EMOCIONAL (REGISTRO DE CALOR CORPORAL) */}
      <LinearGradient
        colors={["#f59e0b", "#ea580c"]} // Gradiente ámbar a naranja
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bochornoCard}
      >
        {/* Fondo del ícono de la sol */}
        <View style={styles.sunnyBackground}>
          <Sun color={Colors.white} size={96} strokeWidth={1} />
        </View>
        <View style={styles.cardHeader}>
          <View style={styles.rowCentered}>
            <Ionicons name="compass-outline" size={20} color="#fef3c7" />
            <Text style={styles.bochornoTitle}>El Bochornómetro Emocional</Text>
          </View>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>Calor Corporal</Text>
          </View>
        </View>

        <Text style={styles.bochornoDescription}>
          ¿Sientes una ola de calor repentina subiendo a tu rostro? Elíge la
          intensidad para registrarla y activaremos de inmediato una guía de
          enfriamiento respiratorio:
        </Text>

        {/* Botones de selección de intensidad */}
        <View style={styles.bochornoButtonsGrid}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleBochornoLog("bajo")}
            style={styles.btnBochornoBajo}
          >
            <Text style={styles.btnBochornoText}>🔥 Leve / Bajo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleBochornoLog("medio")}
            style={styles.btnBochornoMedio}
          >
            <Text style={[styles.btnBochornoText, { color: "#fef3c7" }]}>
              🔥🔥 Moderado
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleBochornoLog("alto")}
            style={styles.btnBochornoAlto}
          >
            <Text style={styles.btnBochornoText}>💥💥 Fuerte / Alto</Text>
          </TouchableOpacity>
        </View>

        {/* Notificación de acción guardada */}
        {lastBochornoIntensity && (
          <View style={styles.feedbackBanner}>
            <Text style={styles.feedbackText}>
              <Text style={{ fontWeight: "bold" }}>Acción guardada:</Text>{" "}
              Bochorno registrado de intensidad{" "}
              <Text style={styles.feedbackHighlight}>
                {lastBochornoIntensity.toUpperCase()}
              </Text>
              . Iniciando el ejercicio de respiración consciente abajo para
              refrescar tu cuerpo físico y calmar los vasos sanguíneos
              epiteliales.
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* 2. GUÍA RESPIRATORIA INTERACTIVA DE ENFRIAMIENTO (AISPRA) */}
      <View style={styles.whiteCard}>
        <View style={styles.cardHeader}>
          <View style={styles.rowCentered}>
            <Feather name="wind" size={20} color="#14b8a6" />
            <Text style={styles.sectionTitle}>
              Guía Respiratoria de Enfriamiento (Aispra)
            </Text>
          </View>

          {breathingActive && (
            <View style={styles.timerBadge}>
              <Text style={styles.timerBadgeText}>
                {breathTimer} seg restantes
              </Text>
            </View>
          )}
        </View>

        {breathingActive ? (
          <View style={styles.breathingActiveContainer}>
            {/* Círculo animado de respiración con escalado visual dinámico */}
            <View
              style={[
                styles.breathingCircle,
                breathPhase === "Inhala" && styles.circleInhale,
                breathPhase === "Retén" && styles.circleHold,
                breathPhase === "Exhala" && styles.circleExhale,
              ]}
            >
              <Feather name="wind" size={32} color="#0d9488" />
              <Text style={styles.breathPhaseText}>{breathPhase}</Text>
            </View>

            <Text style={styles.breathInstructionText}>
              {breathPhase === "Inhala" &&
                "Inhala aire fresco profundamente expandiendo tu abdomen..."}
              {breathPhase === "Retén" &&
                "Mantén el aire fresco circulando en tu cuerpo con absoluta tranquilidad y quietud..."}
              {breathPhase === "Exhala" &&
                "Sopla el calor acumulado lentamente, como si enfriaras una sopa caliente..."}
            </Text>

            <TouchableOpacity
              onPress={() => setBreathingActive(false)}
              style={styles.stopButton}
            >
              <Text style={styles.stopButtonText}>Detener ejercicio</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.breathingInactiveContainer}>
            <Text style={styles.breathingInactiveText}>
              ¿Listo para dar un respiro inteligente? Una sesión corta de
              respiración rítmica ayuda a estabilizar la temperatura del
              hipotálamo.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setBreathingActive(true);
                setBreathTimer(60);
              }}
              style={styles.btnStartBreathing}
            >
              <Text style={styles.btnStartBreathingText}>Iniciar (60s)</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 3. LISTA DE VERIFICACIÓN DE AUTOCUIDADO MADURO */}
      <View style={styles.whiteCard}>
        <View style={styles.checklistHeaderGroup}>
          <View style={styles.rowCentered}>
            <Ionicons name="heart-outline" size={18} color="#ef4444" />
            <Text style={styles.checklistCategoryTitle}>
              MIS CHEQUEOS DE AUTOCUIDADO MADURO (MAIRIN ALMUK PAIN LAKA)
            </Text>
          </View>
          <Text style={styles.checklistCategorySubtitle}>
            Tareas preventivas clave recomendadas clínicamente para mantener
            huesos fuertes y un corazón saludable en esta maravillosa etapa.
          </Text>
        </View>

        <View style={styles.checklistItemsContainer}>
          {/* Ítem 1: Calcio */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleToggleCheck("calciumIntake")}
            style={styles.checkItemButton}
          >
            <View style={styles.checkItemContent}>
              <Text style={styles.checkItemTitle}>
                Receta de Calcio Natural
              </Text>
              <Text style={styles.checkItemDescription}>
                Consumir quinua, ajonjolí, maca, charqui o lácteos descremados a
                diario para blindar tus huesos.
              </Text>
            </View>
            <View
              style={[
                styles.checkbox,
                checklist.calciumIntake && styles.checkboxActive,
              ]}
            >
              {checklist.calciumIntake && (
                <Feather name="check" size={14} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>

          {/* Ítem 2: Ejercicio */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleToggleCheck("exerciseActive")}
            style={styles.checkItemButton}
          >
            <View style={styles.checkItemContent}>
              <Text style={styles.checkItemTitle}>
                Ejercicio de Fuerza y Paso Ligero
              </Text>
              <Text style={styles.checkItemDescription}>
                Cargar pequeñas pesas o realizar caminatas cuesta arriba para
                obligar al hueso a ganar densidad.
              </Text>
            </View>
            <View
              style={[
                styles.checkbox,
                checklist.exerciseActive && styles.checkboxActive,
              ]}
            >
              {checklist.exerciseActive && (
                <Feather name="check" size={14} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>

          {/* Ítem 3: Mamografía */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleToggleCheck("mammogramDone")}
            style={styles.checkItemButton}
          >
            <View style={styles.checkItemContent}>
              <Text style={styles.checkItemTitle}>
                Mamografía Anual Preventiva
              </Text>
              <Text style={styles.checkItemDescription}>
                Visita anual al consultorio ginecológico para ecografía mamaria
                o mamografía de control.
              </Text>
            </View>
            <View
              style={[
                styles.checkbox,
                checklist.mammogramDone && styles.checkboxActive,
              ]}
            >
              {checklist.mammogramDone && (
                <Feather name="check" size={14} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>

          {/* Ítem 4: Kegel */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleToggleCheck("pelvicFloorTrainting")}
            style={styles.checkItemButton}
          >
            <View style={styles.checkItemContent}>
              <Text style={styles.checkItemTitle}>
                Ejercicios de Kegel diarios
              </Text>
              <Text style={styles.checkItemDescription}>
                Contraer el esfínter urinario voluntariamente para fortalecer el
                soporte uterino.
              </Text>
            </View>
            <View
              style={[
                styles.checkbox,
                checklist.pelvicFloorTrainting && styles.checkboxActive,
              ]}
            >
              {checklist.pelvicFloorTrainting && (
                <Feather name="check" size={14} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>

          {/* Ítem 5: Corazón / Presión */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleToggleCheck("heartCheck")}
            style={styles.checkItemButton}
          >
            <View style={styles.checkItemContent}>
              <Text style={styles.checkItemTitle}>
                Chequeo de Presión e Hipertensión
              </Text>
              <Text style={styles.checkItemDescription}>
                Visitar el puesto de salud rutinariamente para medir tu presión
                arterial a fin de prevenir fallas.
              </Text>
            </View>
            <View
              style={[
                styles.checkbox,
                checklist.heartCheck && styles.checkboxActive,
              ]}
            >
              {checklist.heartCheck && (
                <Feather name="check" size={14} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. TARJETA DE SABIDURÍA ANCESTRAL / CITA */}
      <View style={styles.wisdomCard}>
        <Ionicons name="sparkles-outline" size={20} color="#fb923c" />
        <Text style={styles.wisdomText}>
          En la menopausia, la mujer deja de gastar su energía vital (llamada
          Yasi de fecundidad) hacia afuera y la retiene por fin para sí misma,
          convirtiéndose en sabia transmisora de historias, partera y guía del
          hogar.
        </Text>
      </View>
    </ScrollView>
  );
}

// ESTILOS EXPRESADOS EXACTAMENTE PARA MANTENER EL DISEÑO ORIGINAL
const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingBottom: 16,
    gap: 20,
    backgroundColor: "#FAF9F6", // Fondo neutro suave
  },
  rowCentered: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // Card Bochornómetro
  bochornoCard: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bochornoTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  sunnyBackground: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 32,
    opacity: 0.1,
    transform: [{ scale: 1.5 }, { rotate: "12deg" }],
  },
  badgePill: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgePillText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  bochornoDescription: {
    color: "#FEF3C7",
    fontSize: 12,
    lineHeight: 18,
  },
  bochornoButtonsGrid: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  btnBochornoBajo: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  btnBochornoMedio: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  btnBochornoAlto: {
    flex: 1,
    backgroundColor: "#ef4444",
    borderWidth: 1,
    borderColor: "#f87171",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  btnBochornoText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  feedbackBanner: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: 12,
    borderRadius: 12,
  },
  feedbackText: {
    color: "#FFFFFF",
    fontSize: 11,
    lineHeight: 16,
  },
  feedbackHighlight: {
    fontWeight: "800",
    color: "#FEF3C7",
    textDecorationLine: "underline",
  },
  // Card Blanca Genérica
  whiteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    gap: 16,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C1917",
  },
  timerBadge: {
    backgroundColor: "#CCFBF1",
    borderWidth: 1,
    borderColor: "#99F6E4",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  timerBadgeText: {
    color: "#0F766E",
    fontSize: 11,
    fontWeight: "700",
  },
  // Guía de respiración
  breathingActiveContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDFA",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CCFBF1",
    gap: 16,
  },
  breathingCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#99F6E4",
    alignItems: "center",
    justifyContent: "center",
  },
  circleInhale: {
    transform: [{ scale: 1.1 }],
    backgroundColor: "#5EEAD4",
  },
  circleHold: {
    transform: [{ scale: 1.0 }],
    backgroundColor: "#FDE68A", // Tono ámbar ligero en retención
  },
  circleExhale: {
    transform: [{ scale: 0.9 }],
    backgroundColor: "#CCFBF1",
  },
  breathPhaseText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1C1917",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  breathInstructionText: {
    fontSize: 12,
    color: "#57534E",
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 18,
  },
  stopButton: {
    marginTop: 4,
  },
  stopButtonText: {
    fontSize: 11,
    color: "#A8A29E",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  breathingInactiveContainer: {
    backgroundColor: "#FAF9F6",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E7E5E4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  breathingInactiveText: {
    flex: 1,
    fontSize: 11,
    color: "#57534E",
    lineHeight: 16,
  },
  btnStartBreathing: {
    backgroundColor: "#14b8a6",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnStartBreathingText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  // Checklist
  checklistHeaderGroup: {
    gap: 4,
  },
  checklistCategoryTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#57534E",
    letterSpacing: 0.5,
  },
  checklistCategorySubtitle: {
    fontSize: 10,
    color: "#78716C",
    lineHeight: 14,
  },
  checklistItemsContainer: {
    gap: 10,
  },
  checkItemButton: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E7E5E4",
    backgroundColor: "#FAF9F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  checkItemContent: {
    flex: 1,
  },
  checkItemTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#292524",
  },
  checkItemDescription: {
    fontSize: 10,
    color: "#78716C",
    marginTop: 2,
    lineHeight: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D6D3D1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#f43f5e",
    borderColor: "#f43f5e",
  },
  // Wisdom Quote Card
  wisdomCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FFEDD5",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  wisdomText: {
    flex: 1,
    fontSize: 11,
    fontStyle: "italic",
    color: "#9A3412",
    lineHeight: 16,
  },
});
