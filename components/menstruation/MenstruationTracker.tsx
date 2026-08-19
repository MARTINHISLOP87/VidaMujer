import {
  getPeriods,
  registerPeriod,
} from "@/app/menstruacion/MenstruationSevice";
import { useApp } from "@/contexts/AppContext";

import React, { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import {
  BookOpen,
  Calendar,
  Cloud,
  Droplet,
  Info,
  Leaf,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react-native";
import { Colors } from "../../theme";
import { FlowIntensity, MenstruationPeriod } from "../../types/cycle";
import { calculatePrediction } from "../../utils/cycleCalculator";
import AppHeader from "../onboarding/AppHeader";
import CustomCalendar from "../onboarding/CustomCalendar";
export default function MenstruationTracker() {
  const { profile } = useApp();

  // Historial real cargado desde SQLite.
  const [periods, setPeriods] = useState<MenstruationPeriod[]>([]);
  // Estado de carga inicial.
  const [loading, setLoading] = useState(true);

  const loadPeriods = async () => {
    // Si todavía no existe perfil,
    // no podemos consultar SQLite.
    if (!profile?.id) {
      setLoading(false);
      return;
    }

    try {
      // El ID del perfil ahora corresponde
      // al ID real de SQLite.
      const userId = Number(profile.id);

      // Consultamos el historial persistente.
      const records = await getPeriods(userId);

      // Actualizamos la interfaz.
      setPeriods(records);
    } catch (error) {
      console.error("Error cargando períodos:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPeriods();
  }, [profile?.id]);

  // Inicializamos con la fecha de hoy limpia de horas UTC en formato local YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState<string>(getTodayString());
  const [duration, setDuration] = useState("5");
  const [flow, setFlow] = useState<FlowIntensity>("Medio");

  // CORRECCIÓN: La predicción ahora recalcula en tiempo real al cambiar la fecha del calendario
  // cuando se ejecuta anaddperiod periods y cambia y este bloque vuelbe a calcula
  const prediction = useMemo(() => {
    // Creamos un periodo provisional basado en lo que el usuario ha seleccionado en pantalla
    const finalDuration = duration === "" ? 5 : Number(duration);

    // Parseo seguro evitando desfases de huso horario
    const start = new Date(`${date}T00:00:00`);
    const end = new Date(start);
    end.setDate(start.getDate() + finalDuration - 1);

    const yearEnd = end.getFullYear();
    const monthEnd = String(end.getMonth() + 1).padStart(2, "0");
    const dayEnd = String(end.getDate()).padStart(2, "0");

    const temporaryPeriod: MenstruationPeriod = {
      id: "temp",
      startDate: date,
      endDate: `${yearEnd}-${monthEnd}-${dayEnd}`,
      cycleLength: 28,
      flowIntensity: flow,
    };

    // Combinamos el historial real con este cambio temporal para simular el futuro en la tarjeta
    return calculatePrediction([...periods, temporaryPeriod]);
  }, [periods, date, duration, flow]);

  const handleDurationChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    const num = Number(numericText);

    if (num > 15) {
      setDuration("15");
    } else if (numericText === "0") {
      setDuration("1");
    } else {
      setDuration(numericText);
    }
  };

  async function savePeriod() {
    // Verificamos que exista usuario.
    if (!profile?.id) {
      Alert.alert("Error", "No existe una usuaria registrada.");

      return;
    }

    try {
      // Convertimos el ID almacenado
      // en AppContext al ID numérico de SQLite.
      const userId = Number(profile.id);

      // Calculamos la duración.
      const finalDuration = duration === "" ? 5 : Number(duration);

      // Construimos la fecha inicial.
      const start = new Date(`${date}T00:00:00`);

      // Calculamos la fecha final.
      const end = new Date(start);

      end.setDate(start.getDate() + finalDuration - 1);

      // Formateamos la fecha final.
      const formattedEndDate = `${end.getFullYear()}-${String(
        end.getMonth() + 1,
      ).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`;

      // Guardamos directamente en SQLite.
      await registerPeriod({
        userId,
        startDate: date,
        endDate: formattedEndDate,
        durationDays: finalDuration,
        cycleLength: profile.cycleLength ?? 28,
        flowIntensity: flow,
      });

      // Volvemos a consultar SQLite.
      // Esto garantiza que la UI
      // muestre exactamente lo persistido.
      await loadPeriods();

      // Mostramos confirmación.
      Alert.alert(
        "¡Registro Exitoso!",
        "El período menstrual ha sido guardado correctamente.",
      );

      // Limpiamos el formulario.
      setDate(getTodayString());
      setDuration("5");
      setFlow("Medio");
    } catch (error) {
      console.error("Error guardando período:", error);

      Alert.alert("Error", "No se pudo guardar el período menstrual.");
    }
  }

  // Información de las fases del ciclo menstrual
  const phasesInfo = [
    {
      id: "menstrual",
      title: "Fase Menstrual\n(Días 1-5)",
      desc: "Niveles bajos de estrógeno y progesterona. El útero se desprende. Prioriza bebidas calientes, infusiones y descanso.",
      spirit: "Introspección y purificación",
      Icon: Droplet,
      color: "#f43f5e", // Rosa/Rojo
      bgColor: "#ffe4e6",
    },
    {
      id: "folicular",
      title: "Fase Folicular\n(Días 6-11)",
      desc: "Sube el estrógeno. Tu energía física y fuerza muscular aumentan. Excelente momento para actividad física y creatividad.",
      spirit: "Renacimiento e inicio",
      Icon: Leaf,
      color: "#10b981", // Verde
      bgColor: "#d1fae5",
    },
    {
      id: "ovulatoria",
      title: "Fase Ovulatoria\n(Días 12-16)",
      desc: "Nivel máximo de estrógenos. Te sientes más elocuente, sociable y enérgica. Días muy propicios para la concepción.",
      spirit: "Plenitud y conexión",
      Icon: Sun,
      color: "#f59e0b", // Ámbar/Amarillo
      bgColor: "#fef3c7",
    },
    {
      id: "lutea",
      title: "Fase Lútea\n(Días 17-28)",
      desc: "Sube la progesterona. El cuerpo puede retener líquidos. Consume poca sal, medita y ten paciencia contigo misma.",
      spirit: "Calma y sensibilidad",
      Icon: Cloud,
      color: "#6366f1", // Índigo/Morado
      bgColor: "#e0e7ff",
    },
  ];
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppHeader
        userName={profile?.name ?? "Usuario"}
        language={profile?.language ?? "es"}
        subtitle="Menstruacion"
        onMoonPress={() => console.log("luna")}
        onSettingsPress={() => console.log("ajustes")}
        onLanguagePress={() => console.log("idioma")}
      />
      {prediction && (
        <LinearGradient
          colors={["#f43f5e", "#e11d48", "#db2777"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.predictionCardContainer}
        >
          {/* Fondo del ícono de la Luna */}
          <View style={styles.moonBackground}>
            <Moon color="#ffffff" size={96} strokeWidth={1} />
          </View>

          <View style={styles.predictionContent}>
            {/* Encabezado */}
            <View style={styles.predictionHeader}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Predicción Lunar Activa</Text>
              </View>
              <View style={styles.infoContainer}>
                <Info color="#ffe4e6" size={14} />
                <Text style={styles.infoText}>
                  {/* Reemplaza el '28' por la variable de tu ciclo promedio si la tienes */}
                  Ciclo Promedio: 28 días
                </Text>
              </View>
            </View>

            {/* Grid de información */}
            <View style={styles.grid}>
              {/* Columna Izquierda */}
              <View style={styles.colLeft}>
                <Text style={styles.labelText}>Siguiente Menstruación</Text>
                <Text style={[styles.dateText, styles.fontMono]}>
                  {prediction.nextDate}
                </Text>
              </View>

              {/* Columna Derecha */}
              <View style={styles.colRight}>
                <Text style={styles.labelText}>Días restantes</Text>
                {prediction.daysLeft > 0 ? (
                  <Text style={[styles.daysLeftText, styles.fontMono]}>
                    {prediction.daysLeft}
                  </Text>
                ) : prediction.overdueBy > 0 ? (
                  <View style={styles.overdueBadge}>
                    <Text style={styles.overdueText}>
                      {prediction.overdueBy} días de retraso
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.todayText}>¡Hoy! 🩸</Text>
                )}
              </View>
            </View>

            {/* Banner de ventana fértil */}
            <View style={styles.fertileBanner}>
              <Sparkles color="#fde68a" size={16} style={styles.sparkleIcon} />
              <View style={styles.fertileTextWrapper}>
                <Text style={styles.fertileTitle}>Próxima ventana fértil:</Text>
                <Text style={[styles.fertileDates, styles.fontMono]}>
                  {prediction.fertileStart} - {prediction.fertileEnd}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      )}

      <Text style={styles.label}>
        Fecha de inicio (Selecciona en el calendario)
      </Text>

      <CustomCalendar selectedDate={date} onDateChange={setDate} />

      <View style={styles.card}>
        <Text style={styles.label}>Duración (días)</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={handleDurationChange}
          keyboardType="number-pad"
          placeholder="5"
          maxLength={2}
        />

        <Text style={styles.label}>Intensidad del flujo</Text>
        <View style={styles.row}>
          {(["Bajo", "Medio", "Alto"] as FlowIntensity[]).map((item) => (
            <Pressable
              key={item}
              onPress={() => setFlow(item)}
              style={[styles.option, flow === item && styles.selected]}
            >
              <Text style={flow === item ? styles.selectedText : null}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.button} onPress={savePeriod}>
          <Text style={styles.buttonText}> + Registrar período</Text>
        </Pressable>
      </View>

      {/* tarjeta de historial de registros */}
      {/* 3. HISTORIAL DE REGISTROS */}
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <View style={styles.historyIconContainer}>
            <Calendar color={Colors.roseDark} size={20} />
          </View>
          <Text style={styles.historyTitle}>
            Periodos Registrados Anteriormente
          </Text>
        </View>

        {periods.length > 0 ? (
          <View style={{ gap: 0 }}>
            {periods.map((record, index) => {
              // Calculamos los días dinámicamente para el historial
              const start = new Date(`${record.startDate}T00:00:00`);
              const end = new Date(`${record.endDate}T00:00:00`);
              const diffTime = Math.abs(end.getTime() - start.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

              return (
                <View
                  key={record.id}
                  style={[
                    styles.recordItem,
                    index === periods.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <View style={styles.recordDateBlock}>
                    <Text style={styles.recordMonth}>CICLO</Text>
                    <Text style={styles.recordDurationHighlight}>
                      {diffDays} días
                    </Text>
                  </View>
                  <View style={styles.recordDetails}>
                    <Text style={styles.recordDatesText}>
                      {record.startDate} al {record.endDate}
                    </Text>
                    <Text style={styles.recordSubText}>
                      Flujo: {record.flowIntensity}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Aún no has registrado ningún ciclo.
            </Text>
          </View>
        )}
      </View>

      {/* Espacio final para scroll seguro */}
      <View style={{ height: 40 }} />

      {/* 4. SECCIÓN EDUCATIVA: Fases del Ciclo */}
      <View style={styles.phasesSection}>
        <View style={styles.phasesHeader}>
          <BookOpen color="#475569" size={20} />
          <Text style={styles.phasesMainTitle}>Conoce tu Ciclo</Text>
        </View>

        {/*contenedores de forma vertical con flex wrap */}
        <View style={styles.phasesGridContainer}>
          {phasesInfo.map((phase) => {
            const IconComponent = phase.Icon;
            return (
              <View key={phase.id} style={styles.phaseCardGrid}>
                <View
                  style={[
                    styles.phaseIconBadge,
                    { backgroundColor: phase.bgColor },
                  ]}
                >
                  <IconComponent color={phase.color} size={24} />
                </View>

                <Text style={styles.phaseTitle}>{phase.title}</Text>
                <Text style={styles.phaseDesc}>{phase.desc}</Text>

                <View
                  style={[styles.spiritBadge, { borderColor: phase.color }]}
                >
                  <Text style={[styles.spiritText, { color: phase.color }]}>
                    ✨ {phase.spirit}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingBottom: 16,
    gap: 20,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.rose,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderRadius: 5,
    elevation: 8,
    shadowColor: Colors.rose,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.white,
  },
  cardheader: {
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
  card: {
    backgroundColor: "#FCE7F3",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FBCFE8",
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#9D174D",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#D63384",
  },
  textDetails: {
    fontSize: 14,
    color: "#4D0424",
    marginTop: 2,
  },
  label: {
    fontWeight: "600",
    marginTop: 5,
    marginLeft: 16,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  option: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  selected: {
    backgroundColor: "#F9A8D4",
  },
  selectedText: {
    fontWeight: "600",
    color: "#000",
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.rose,
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  predictionCardContainer: {
    borderRadius: 16,
    padding: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative",
    marginVertical: 0, // Margen para separarlo de otros elementos en tu pantalla
  },
  moonBackground: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 32,
    opacity: 0.1,
    transform: [{ scale: 1.5 }, { rotate: "12deg" }],
  },
  predictionContent: {
    position: "relative",
    gap: 16,
  },
  predictionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#ffe4e6",
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colLeft: {
    flex: 1,
    justifyContent: "center",
  },
  colRight: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  labelText: {
    fontSize: 11,
    color: "#ffe4e6",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  daysLeftText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#fde68a",
  },
  overdueBadge: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  overdueText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1c1917",
  },
  todayText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  fertileBanner: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  sparkleIcon: {
    marginTop: 2,
  },
  fertileTextWrapper: {
    flex: 1,
  },
  fertileTitle: {
    fontWeight: "600",
    color: "#ffffff",
    fontSize: 12,
  },
  fertileDates: {
    fontSize: 11,
    color: "#ffffff",
    marginTop: 2,
  },
  fontMono: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  historyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    // Sombra sutil para la tarjeta blanca
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  historyIconContainer: {
    backgroundColor: "#ffe4e6", // Fondo rosado claro
    padding: 8,
    borderRadius: 10,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937", // Gris oscuro
  },
  recordsList: {
    gap: 0,
  },
  recordItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6", // Línea separadora gris muy clara
    gap: 16,
  },
  lastRecordItem: {
    borderBottomWidth: 0, // El último elemento no necesita línea
  },
  recordDateBlock: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 70,
  },
  recordMonth: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748b",
    letterSpacing: 0.5,
  },
  recordDurationHighlight: {
    fontSize: 14,
    fontWeight: "900",
    color: "#e11d48",
    marginTop: 2,
  },
  recordDetails: {
    flex: 1,
  },
  recordDatesText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 4,
  },
  recordSubText: {
    fontSize: 13,
    color: "#94a3b8",
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyStateText: {
    color: "#94a3b8",
    fontSize: 14,
    fontStyle: "italic",
  },
  // Estilos de la Sección Educativa (Fases)

  phasesScrollContainer: {
    paddingVertical: 5,
    gap: 16,
    paddingRight: 20, // Espacio al final del scroll
  },
  phaseCard: {
    width: 250,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
    justifyContent: "space-between",
  },

  phaseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    lineHeight: 22,
  },
  phaseDesc: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 16,
  },
  spiritBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  spiritText: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  // --- Estilos de la Sección Educativa (Fases en 2 Columnas) ---
  phasesSection: {
    marginTop: 0,
    marginBottom: 20,
  },
  phasesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  phasesMainTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#334155",
    marginLeft: 16,
  },
  phasesGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // gap: 12, (Si usas una versión reciente de React Native, puedes usar gap. Si no, usamos marginBottom en las tarjetas)
  },
  phaseCardGrid: {
    width: "48%", // Esto es clave: Ocupa casi la mitad, dejando un 4% de espacio en medio
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14, // Reducimos un poco el padding interno para ganar espacio
    marginBottom: 16, // Espacio hacia abajo entre filas
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
    justifyContent: "space-between",
  },
  phaseIconBadge: {
    width: 40, // Ícono un poco más pequeño
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  phaseTitleGrid: {
    fontSize: 14, // Letra ligeramente más pequeña para las 2 columnas
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 6,
    lineHeight: 18,
  },
  phaseDescGrid: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 16,
    marginBottom: 12,
  },
  spiritBadgeGrid: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 4, // Menos padding horizontal para evitar que se desborde
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  spiritTextGrid: {
    fontSize: 9, // Letra pequeña para que entre en la insignia
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
});
