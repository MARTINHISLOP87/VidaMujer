import { Colors } from "@/theme";
import { LanguageCode } from "@/types/profile"; // Importación del tipo personalizado para el idioma
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // Íconos vectoriales nativos para Expo
import { LinearGradient } from "expo-linear-gradient"; // Componente de gradiente para Expo
import React, { useMemo } from "react"; // Hooks principales de React
import { ScrollView, StyleSheet, Text, View } from "react-native"; // Componentes nativos de interfaz de React Native
import AppHeader from "../onboarding/AppHeader";
// Interfaz que define los parámetros de entrada del componente
interface PregnancyTrackerProps {
  lastPeriodDate: string; // Fecha de la última regla (FUM/LMP)
  language: LanguageCode; // Idioma de la interfaz
  username?: string;
}

export default function PregnancyTracker({
  lastPeriodDate,
  language,
  username = "Hermana",
}: PregnancyTrackerProps) {
  // Memorización del cálculo de métricas gestacionales para optimizar el rendimiento
  const metrics = useMemo(() => {
    // Si no hay fecha configurada, retorna nulo para renderizar la pantalla vacía
    if (!lastPeriodDate) return null;

    const lmp = new Date(lastPeriodDate); // Conversión a objeto Date de la fecha de última regla
    const today = new Date(); // Fecha actual del sistema

    // Cálculo de la Fecha Probable de Parto (FPP / EDD): 280 días / 40 semanas
    const edd = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);

    // Diferencia en milisegundos convertida a días totales de gestación
    const diffTime = today.getTime() - lmp.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Desglose en semanas completas y días restantes
    let weeks = Math.floor(diffDays / 7);
    let remainingDays = diffDays % 7;

    // Ajustes de límites para evitar valores fuera de rango
    if (weeks < 0) weeks = 0;
    if (weeks > 42) weeks = 42;
    if (remainingDays < 0) remainingDays = 0;

    return {
      weeks, // Número de semanas cumplidas
      days: remainingDays, // Días adicionales transcurridos
      dueDate: edd.toISOString().split("T")[0], // Cadena en formato YYYY-MM-DD
      totalDays: diffDays, // Días acumulados totales
      trimester: weeks <= 12 ? 1 : weeks <= 26 ? 2 : 3, // Determinación del trimestre actual (1, 2 o 3)
    };
  }, [lastPeriodDate]); // Se recalculan las métricas solo si cambia la fecha recibida

  // Función que mapea la semana de gestación con frutos autóctonos andinos
  const getBabySizeInfo = (week: number) => {
    if (week <= 4) {
      return {
        name: "Semilla de Chía", // Nombre común
        height: "~2 mm", // Tamaño aproximado
        weight: "<1 g", // Peso aproximado
        nativeName: "Chía muju (Quechua)", // Denominación originaria
        desc: "Tu wawa es un brote de vida apenas perceptible pero creciendo en división celular acelerada.", // Descripción evolutiva
      };
    } else if (week <= 8) {
      return {
        name: "Capulí / Aguaymanto",
        height: "~1.5 cm",
        weight: "~1 g",
        nativeName: "Capulí ruru",
        desc: "El corazón de tu wawa ya late fuertemente. Se están definiendo sus ojitos y extremidades.",
      };
    } else if (week <= 12) {
      return {
        name: "Tuna Andina",
        height: "~5.5 cm",
        weight: "~15 g",
        nativeName: "Tuna ruru",
        desc: "¡Ya tiene deditos y rostro formado! Puede abrir y cerrar sus manitas bajo la calidez del útero.",
      };
    } else if (week <= 16) {
      return {
        name: "Chirimoya mediana",
        height: "~12 cm",
        weight: "~100 g",
        nativeName: "Chirimoya",
        desc: "Sus músculos se fortalecen y empieza a succionar el dedito. Puedes empezar a notar pequeños burbujeos.",
      };
    } else if (week <= 20) {
      return {
        name: "Papa Andina mediana",
        height: "~16 cm",
        weight: "~300 g",
        nativeName: "Papa mama",
        desc: "Ya escucha los latidos de tu corazón, tu voz materna y música suave. ¡Háblale con amor!",
      };
    } else if (week <= 24) {
      return {
        name: "Choclo Tierno dulce",
        height: "~30 cm",
        weight: "~600 g",
        nativeName: "Choclo t'uri",
        desc: "Se forman sus pestañas y cejas. Sus pulmones continúan preparándose para respirar el aire de la comunidad.",
      };
    } else if (week <= 28) {
      return {
        name: "Melón dulce",
        height: "~37 cm",
        weight: "~1.1 kg",
        nativeName: "Melloco o Melón",
        desc: "La wawa puede abrir sus ojos e identificar la luz exterior brillante sobre tu barriga.",
      };
    } else if (week <= 32) {
      return {
        name: "Piña pequeña andina",
        height: "~42 cm",
        weight: "~1.7 kg",
        nativeName: "Achupalla (Piña)",
        desc: "Sus huesos se endurecen excepto el cráneo que permanece moldeable para el canal del parto.",
      };
    } else if (week <= 36) {
      return {
        name: "Papaya mediana",
        height: "~47 cm",
        weight: "~2.6 kg",
        nativeName: "Papayucha",
        desc: "Casi no le queda espacio para dar vueltas completas pero se estira activamente. Su piel está lisa.",
      };
    } else {
      return {
        name: "Cálida Sandía madura",
        height: "~51 cm",
        weight: "~3.3 kg",
        nativeName: "Sandía kawsay",
        desc: "Genuina madurez. Está posicionado boca abajo listo para asomarse al mundo y sentir el calor de tus brazos.",
      };
    }
  };

  // Renderizado condicional si no existen datos configurados de la fecha de última regla
  if (!metrics) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No se ha configurado la fecha del último ciclo. Vuelve a configuración
          para añadir tu fecha.
        </Text>
      </View>
    );
  }
  // Extracción de datos de desarrollo según las semanas actuales calculadas
  const babySize = getBabySizeInfo(metrics.weeks);

  // Diccionario con recomendaciones médicas según el trimestre gestacional
  const trimesterAdvice: Record<number, string> = {
    1: "Primer Trimestre: Presta atención al ácido fólico natural y hierro. Es común tener náuseas; toma infusión ligerísima de muña por las mañanas.",
    2: "Segundo Trimestre: Disfruta la plenitud energética. Come alimentos de colores (remolacha, zanahoria, quinua). Ya puedes percibir sus pataditas.",
    3: "Tercer Trimestre: Preparándonos para el parto. Organiza junto con tu ayllu (familia/vecinos) la maleta, el abrigo tradicional y la partera o centro médico.",
  };

  // Cálculo numérico de días faltantes hasta la fecha probable de parto
  const daysRemaining = Math.ceil(
    (new Date(metrics.dueDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <AppHeader
        userName={username}
        language={language}
        subtitle="Embarazo"
        onMoonPress={() => console.log("luna")}
        onSettingsPress={() => console.log("ajustes")}
        onLanguagePress={() => console.log("idioma")}
      />

      {/* 1. SECCIÓN DE TARJETAS SUPERIORES (TIEMPO DE GESTACIÓN Y FECHA DE PARTO) */}
      <View style={styles.topCardsGrid}>
        {/* Tarjeta con Gradiente del Tiempo de Gestación */}
        <LinearGradient
          colors={[Colors.roseDark, Colors.rose]} // Gradiente anaranjado
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gestationCard}
        >
          {/* Badge flotante con el número de trimestre */}
          <View style={styles.trimesterBadge}>
            <Text style={styles.trimesterBadgeText}>
              {metrics.trimester}° TRIMESTRE
            </Text>
          </View>

          <Text style={styles.gestationTitle}>Tiempo de Gestación actual</Text>

          {/* Contador en semanas y días transcurridos */}
          <View style={styles.weeksRow}>
            <Text style={styles.weeksNumber}>{metrics.weeks}</Text>
            <Text style={styles.weeksLabel}>semanas</Text>
            <Text style={styles.daysNumber}>+{metrics.days}</Text>
            <Text style={styles.daysLabel}>días</Text>
          </View>

          {/* Caja con la recomendación médica según el trimestre */}
          <View style={styles.adviceBox}>
            <Text style={styles.adviceText}>
              {trimesterAdvice[metrics.trimester]}
            </Text>
          </View>
        </LinearGradient>

        {/* Tarjeta con la Fecha Probable de Parto */}
        <View style={styles.dueDateCard}>
          <View style={styles.dueDateHeader}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#f97316"
            />
            <Text style={styles.dueDateTitle}>Fecha de Nacimiento</Text>
          </View>

          <View style={styles.dueDateBody}>
            <Text style={styles.dueDateFormatted}>
              {new Date(metrics.dueDate).toLocaleDateString(
                language === "es" ? "es-ES" : "es",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                },
              )}
            </Text>
            <Text style={styles.dueDateSubtitle}>
              Estimada según los 280 días gestacionales
            </Text>
          </View>

          {/* Alerta inferior con la cuenta regresiva en días */}
          <View style={styles.countdownPill}>
            <Text style={styles.countdownText}>
              ¡Faltan {daysRemaining} días!
            </Text>
          </View>
        </View>
      </View>

      {/* 2. SECCIÓN DE CRECIMIENTO DE LA WAWA (TAMAÑO Y HITOS EN DESARROLLO) */}
      <View style={styles.babyCard}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="happy-outline" size={20} color="#f97316" />
          <Text style={styles.cardTitleText}>
            ¿Cómo va el crecimiento de tu wawa hoy?
          </Text>
        </View>

        <View style={styles.babyContentGrid}>
          {/* Bloque visual de fruto de comparación */}
          <View style={styles.fruitVisualBox}>
            <Text style={styles.fruitEmoji}>🍇</Text>
            <Text style={styles.fruitName}>{babySize.name}</Text>
            {babySize.nativeName && (
              <View style={styles.nativeBadge}>
                <Text style={styles.nativeBadgeText}>
                  {babySize.nativeName}
                </Text>
              </View>
            )}
            <View style={styles.metricsMeasureRow}>
              <Text style={styles.measureText}>Alt: {babySize.height}</Text>
              <Text style={styles.measureSeparator}>•</Text>
              <Text style={styles.measureText}>Peso: {babySize.weight}</Text>
            </View>
          </View>

          {/* Bloque descriptivo con hitos gestacionales */}
          <View style={styles.babyDescriptionBox}>
            <View style={styles.milestoneHeader}>
              <Ionicons name="sparkles" size={14} color="#fb923c" />
              <Text style={styles.milestoneTitle}>
                Logros gestacionales destacados (Semana {metrics.weeks}):
              </Text>
            </View>

            <View style={styles.milestoneDescBox}>
              <Text style={styles.milestoneDescText}>{babySize.desc}</Text>
            </View>

            {/* Consejo bilingüe de apego paterno / materno */}
            <View style={styles.bilingualAdviceBox}>
              <Text style={styles.bilingualLabel}>
                Consejo bilingüe de apego / Wawa munanapallay:
              </Text>
              <Text style={styles.bilingualQuote}>
                Sapa tuta kanchay wasapi mamitapa ruranta llamiy, rimakuy. La
                wawa absorbe tus vibraciones y tu amor incondicional desde el
                vientre.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. SECCIÓN DE ALERTA DE PELIGRO EN EL EMBARAZO */}
      <View style={styles.alertCard}>
        <View style={styles.alertHeaderRow}>
          <MaterialCommunityIcons
            name="shield-alert"
            size={24}
            color="#dc2626"
          />
          <View style={styles.alertHeaderCol}>
            <Text style={styles.alertMainTitle}>
              SEÑALES DE ALERTA DE PELIGRO EN EL EMBARAZO
            </Text>
            <Text style={styles.alertMainSubtitle}>
              Si tú o algún miembro de tu ayllu detectan cualquiera de estos
              síntomas, acude DE INMEDIATO al puesto médico de salud más
              cercano.
            </Text>
          </View>
        </View>

        {/* Rejilla con los 4 síntomas de riesgo crítico */}
        <View style={styles.symptomsGrid}>
          <View style={styles.symptomBox}>
            <Text style={styles.symptomEmoji}>🩸</Text>
            <Text style={styles.symptomTitle}>Pérdida de sangre</Text>
            <Text style={styles.symptomDesc}>
              Sangrado vaginal en cualquier cantidad.
            </Text>
          </View>

          <View style={styles.symptomBox}>
            <Text style={styles.symptomEmoji}>🤢</Text>
            <Text style={styles.symptomTitle}>Dolor de cabeza severo</Text>
            <Text style={styles.symptomDesc}>
              Zumbido de oídos o lucecitas brillantes.
            </Text>
          </View>

          <View style={styles.symptomBox}>
            <Text style={styles.symptomEmoji}>🔥</Text>
            <Text style={styles.symptomTitle}>Fiebre e infección</Text>
            <Text style={styles.symptomDesc}>
              Escalofríos intensos o flujo fétido.
            </Text>
          </View>

          <View style={styles.symptomBox}>
            <Text style={styles.symptomEmoji}>🦶</Text>
            <Text style={styles.symptomTitle}>Manos o pies hinchados</Text>
            <Text style={styles.symptomDesc}>Retención extrema repentina.</Text>
          </View>
        </View>

        {/* Nota comunitaria sobre emergencia */}
        <View style={styles.emergencyNoteBox}>
          <Text style={styles.emergencyNoteTitle}>
            ⚠️ Nota importante para la familia:
          </Text>
          <Text style={styles.emergencyNoteText}>
            No esperes a que amanezca ni a que el dolor pase solo. Tener un
            vehículo o ayuda organizada y un plan comunal de emergencia salva
            vidas.
          </Text>
        </View>
      </View>

      {/* 4. SECCIÓN DE ACOMPAÑAMIENTO FAMILIAR ACTIVO (AYLLU YANAPAKUY) */}
      <View style={styles.familyCard}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="home-outline" size={18} color="#f97316" />
          <Text style={styles.familyTitleText}>
            Acompañamiento Familiar Activo (Ayllu Yanapakuy)
          </Text>
        </View>

        <View style={styles.familyTasksGrid}>
          <View style={styles.familyTaskBox}>
            <Text style={styles.taskTitle}>Tareas del Hogar:</Text>
            <Text style={styles.taskDesc}>
              Asumir por completo la recolección de leña, acarreo de agua pesada
              o labores del campo intensas. El cuerpo gestante requiere
              disminuir esfuerzo físico.
            </Text>
          </View>

          <View style={styles.familyTaskBox}>
            <Text style={styles.taskTitle}>Soporte Emocional:</Text>
            <Text style={styles.taskDesc}>
              Acompañarla activamente en cada control del puesto de salud.
              Conversar con paciencia, abrazarla y evitar roces familiares
              estresantes.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// DEFINICIÓN DE ESTILOS EXACTOS BASADOS EN EL DISEÑO ORIGINAL
const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingBottom: 16,
    gap: 20,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    padding: 0,
    paddingBottom: 16,
    gap: 20,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E7E5E4",
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 12,
    color: "#78716C",
    textAlign: "center",
  },
  topCardsGrid: {
    gap: 12,
  },
  gestationCard: {
    borderRadius: 20,
    padding: 18,
    position: "relative",
  },
  trimesterBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  trimesterBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  gestationTitle: {
    fontSize: 12,
    color: "#FFEDD5",
    fontWeight: "600",
    marginBottom: 4,
  },
  weeksRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginBottom: 8,
  },
  weeksNumber: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  weeksLabel: {
    fontSize: 16,
    color: "#FFEDD5",
    fontWeight: "600",
    marginRight: 6,
  },
  daysNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FEF08A",
  },
  daysLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFEDD5",
  },
  adviceBox: {
    backgroundColor: "rgba(0, 0, 0, 0.12)",
    padding: 10,
    borderRadius: 10,
  },
  adviceText: {
    fontSize: 11,
    color: "#FFF7ED",
    fontStyle: "italic",
    lineHeight: 16,
  },
  dueDateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFEDD5",
    justifyContent: "space-between",
    gap: 12,
  },
  dueDateHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dueDateTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7C2D12",
  },
  dueDateBody: {
    gap: 2,
  },
  dueDateFormatted: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1C1917",
    textTransform: "capitalize",
  },
  dueDateSubtitle: {
    fontSize: 10,
    color: "#A8A29E",
  },
  countdownPill: {
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FFEDD5",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  countdownText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#C2410C",
  },
  babyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFE4E6",
    gap: 14,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitleText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1C1917",
  },
  babyContentGrid: {
    gap: 12,
  },
  fruitVisualBox: {
    backgroundColor: "#FFF7ED",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFEDD5",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  fruitEmoji: {
    fontSize: 36,
  },
  fruitName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#EA580C",
    textAlign: "center",
  },
  nativeBadge: {
    backgroundColor: "#FFEDD5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  nativeBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#C2410C",
    textTransform: "uppercase",
  },
  metricsMeasureRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    marginTop: 2,
  },
  measureText: {
    fontSize: 10,
    color: "#78716C",
    fontWeight: "600",
  },
  measureSeparator: {
    color: "#D6D3D1",
  },
  babyDescriptionBox: {
    gap: 8,
  },
  milestoneHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  milestoneTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#44403C",
  },
  milestoneDescBox: {
    backgroundColor: "#FAF9F6",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F5F5F4",
  },
  milestoneDescText: {
    fontSize: 11,
    color: "#57534E",
    lineHeight: 16,
  },
  bilingualAdviceBox: {
    borderLeftWidth: 2,
    borderLeftColor: "#FDBA74",
    paddingLeft: 10,
    gap: 2,
  },
  bilingualLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#44403C",
  },
  bilingualQuote: {
    fontSize: 10,
    color: "#78716C",
    fontStyle: "italic",
    lineHeight: 15,
  },
  alertCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: "#FECACA",
    gap: 14,
  },
  alertHeaderRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  alertHeaderCol: {
    flex: 1,
    gap: 2,
  },
  alertMainTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#B91C1C",
    letterSpacing: 0.5,
  },
  alertMainSubtitle: {
    fontSize: 10,
    color: "#DC2626",
    lineHeight: 14,
  },
  symptomsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  symptomBox: {
    width: "48%", // Distribución en 2 columnas para móviles
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    alignItems: "center",
    gap: 4,
  },
  symptomEmoji: {
    fontSize: 22,
  },
  symptomTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7F1D1D",
    textAlign: "center",
  },
  symptomDesc: {
    fontSize: 9,
    color: "#78716C",
    textAlign: "center",
    lineHeight: 12,
  },
  emergencyNoteBox: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 10,
    borderRadius: 10,
    gap: 2,
  },
  emergencyNoteTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#7F1D1D",
  },
  emergencyNoteText: {
    fontSize: 10,
    color: "#991B1B",
    lineHeight: 14,
  },
  familyCard: {
    backgroundColor: "#FAF9F6",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E7E5E4",
    gap: 12,
  },
  familyTitleText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#44403C",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  familyTasksGrid: {
    gap: 10,
  },
  familyTaskBox: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E7E5E4",
    gap: 4,
  },
  taskTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#292524",
  },
  taskDesc: {
    fontSize: 11,
    color: "#57534E",
    lineHeight: 16,
  },
});
