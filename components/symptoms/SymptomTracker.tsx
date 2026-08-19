import AppHeader from "@/components/onboarding/AppHeader";
import { Colors } from "@/theme";
import {
  LanguageCode,
  SymptomLog,
  SymptomSeverity,
  WomanStage,
} from "@/types/profile";
import { TRADITIONAL_PLANTS } from "@/types/Traditional_Plants";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SymptomTrackerProps {
  logs: SymptomLog[];
  onSaveLog: (log: SymptomLog) => void;
  onDeleteLog: (id: string) => void;
  language: LanguageCode;
  stage: WomanStage;
  username?: string;
}

const SEVERITY_OPTIONS: { label: string; value: SymptomSeverity }[] = [
  { label: "Ninguno", value: "none" },
  { label: "Leve", value: "mild" },
  { label: "Moderado", value: "moderate" },
  { label: "Fuerte", value: "severe" },
];

const MOODS = [
  {
    id: "calm",
    label: "Tranquila",
    icon: "🌸",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    text: "#047857",
  },
  {
    id: "happy",
    label: "Alegre",
    icon: "☀️",
    bg: "#fffbeb",
    border: "#fde68a",
    text: "#b45309",
  },
  {
    id: "tired",
    label: "Cansada",
    icon: "☁️",
    bg: "#eff6ff",
    border: "#bfdbfe",
    text: "#1d4ed8",
  },
  {
    id: "pain",
    label: "Con Dolores",
    icon: "⚡",
    bg: "#fff1f2",
    border: "#fecdd3",
    text: "#be123c",
  },
  {
    id: "anxious",
    label: "Sensible",
    icon: "🍃",
    bg: "#faf5ff",
    border: "#e9d5ff",
    text: "#6b21a8",
  },
];

const TRANSLATIONS: Record<string, Record<string, string>> = {
  title: {
    es: "Diario de Síntomas",
    mi: "Mairin wina siska dukiara",
  },
  logBtn: {
    es: "Guardar en mi Diario",
    mi: "Prikah pain laka ba ra",
  },
  notesLabel: {
    es: "Mis pensamientos y notas hoy",
    mi: "Kupia pira pain siska",
  },
  traditionalRemedy: {
    es: "Plantas de Ayuda Recomendadas",
    mi: "Sika dusa nani hilp munbia",
  },
  clinicalDisclaimer: {
    es: "Aviso: Las hierbas apoyan el alivio, pero si el síntoma persiste con dolor severo, sangrado o fiebre alta, acude de inmediato a tu centro médico.",
    mi: "Aviso: Sika dusa nani ba hilp munisa, siki pain laka pain dakiara, usuyat dawan saura ba, qulliri dusa ra utqaypach wasi ra sarañawa.",
  },
};

export default function SymptomTracker({
  logs,
  onSaveLog,
  onDeleteLog,
  language,
  stage,
  username = "Hermana",
}: SymptomTrackerProps) {
  const [selectedMood, setSelectedMood] = useState("calm");
  const [cramps, setCramps] = useState<SymptomSeverity>("none");
  const [hotFlashes, setHotFlashes] = useState<SymptomSeverity>("none");
  const [headache, setHeadache] = useState<SymptomSeverity>("none");
  const [fatigue, setFatigue] = useState<SymptomSeverity>("none");
  const [notes, setNotes] = useState("");
  const [selectedRemedies, setSelectedRemedies] = useState<string[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Helper para traducción con fallback seguro
  const getText = (key: keyof typeof TRANSLATIONS): string => {
    const translationMap = TRANSLATIONS[key];
    if (!translationMap) return "";
    const localized = translationMap[language];
    return localized && localized.trim() !== ""
      ? localized
      : translationMap["es"];
  };

  // Manejo seguro del temporizador del Toast
  useEffect(() => {
    if (!showSuccessToast) return;
    const timer = setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [showSuccessToast]);

  // Sugerencia automatizada de plantas sin duplicados
  const suggestedPlants = useMemo(() => {
    const rawSuggestions = [];

    if (stage === "menstruation" || cramps !== "none" || headache !== "none") {
      const manzanilla = TRADITIONAL_PLANTS.find((p) =>
        p.name.includes("Manzanilla"),
      );
      const oregano = TRADITIONAL_PLANTS.find((p) =>
        p.name.includes("Orégano"),
      );
      if (manzanilla) rawSuggestions.push(manzanilla);
      if (oregano) rawSuggestions.push(oregano);
    }
    if (stage === "menopause" || hotFlashes !== "none" || fatigue !== "none") {
      const maca = TRADITIONAL_PLANTS.find((p) => p.name.includes("Maca"));
      if (maca) rawSuggestions.push(maca);
    }
    if (stage === "pregnancy" || fatigue !== "none") {
      const muna = TRADITIONAL_PLANTS.find((p) => p.name.includes("Muña"));
      if (muna) rawSuggestions.push(muna);
    }

    // Filtrar elementos indefinidos y eliminar duplicados por nombre
    const uniqueMap = new Map();
    rawSuggestions.forEach((plant) => {
      if (plant && !uniqueMap.has(plant.name)) {
        uniqueMap.set(plant.name, plant);
      }
    });

    return Array.from(uniqueMap.values());
  }, [stage, cramps, headache, hotFlashes, fatigue]);

  // Inversión memorizada del historial
  const reversedLogs = useMemo(() => [...logs].reverse(), [logs]);

  const handleToggleRemedy = (plantName: string) => {
    setSelectedRemedies((prev) =>
      prev.includes(plantName)
        ? prev.filter((r) => r !== plantName)
        : [...prev, plantName],
    );
  };

  const handleSave = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const newLog: SymptomLog = {
      id: "log_" + Date.now(),
      date: todayStr,
      mood: selectedMood,
      physicalSymptoms: {
        cramps: cramps !== "none" ? cramps : undefined,
        hotFlashes: hotFlashes !== "none" ? hotFlashes : undefined,
        headache: headache !== "none" ? headache : undefined,
        fatigue: fatigue !== "none" ? fatigue : undefined,
      },
      notes: notes.trim(),
      traditionalRemediesUsed: selectedRemedies,
    };

    onSaveLog(newLog);
    setNotes("");
    setCramps("none");
    setHotFlashes("none");
    setHeadache("none");
    setFatigue("none");
    setSelectedRemedies([]);
    setShowSuccessToast(true);
  };

  const renderSeveritySelector = (
    value: SymptomSeverity,
    onChange: (val: SymptomSeverity) => void,
  ) => (
    <View style={styles.severityContainer}>
      {SEVERITY_OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[
              styles.severityChip,
              isSelected && styles.severityChipSelected,
            ]}
          >
            <Text
              style={[
                styles.severityChipText,
                isSelected && styles.severityChipTextSelected,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <AppHeader
        userName={username}
        language={language}
        subtitle={getText("title")}
        onMoonPress={() => console.log("luna")}
        onSettingsPress={() => console.log("ajustes")}
        onLanguagePress={() => console.log("idioma")}
      />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <View style={styles.iconBadge}>
              <Ionicons
                name="flower-outline"
                size={20}
                color={Colors.roseDark}
              />
            </View>
            <Text style={styles.cardTitle}>{getText("title")}</Text>
          </View>
          <View style={styles.datePill}>
            <Ionicons name="calendar-outline" size={12} color={Colors.muted} />
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
              })}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            ¿Cómo te sientes espiritualmente y en ánimo hoy?
          </Text>
          <View style={styles.moodGrid}>
            {MOODS.map((m) => {
              const isSelected = selectedMood === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setSelectedMood(m.id)}
                  activeOpacity={0.8}
                  style={[
                    styles.moodBtn,
                    isSelected
                      ? {
                          backgroundColor: m.bg,
                          borderColor: m.border,
                          borderWidth: 1.5,
                          transform: [{ scale: 1.03 }],
                        }
                      : styles.moodBtnInactive,
                  ]}
                >
                  <Text style={styles.moodIcon}>{m.icon}</Text>
                  <Text
                    style={[
                      styles.moodLabel,
                      isSelected && { color: m.text, fontWeight: "700" },
                    ]}
                    numberOfLines={1}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Sintomatología física actual:</Text>

          <View style={styles.symptomBox}>
            <View style={styles.symptomTextCol}>
              <Text style={styles.symptomTitle}>
                Cólicos / Dolores de Vientre
              </Text>
              <Text style={styles.symptomSubtitle}>
                ¿Sientes contracciones en el útero?
              </Text>
            </View>
            {renderSeveritySelector(cramps, setCramps)}
          </View>

          <View style={styles.symptomBox}>
            <View style={styles.symptomTextCol}>
              <Text style={styles.symptomTitle}>
                Calor repentino / Bochornos
              </Text>
              <Text style={styles.symptomSubtitle}>
                Olas de calor molestas en el rostro
              </Text>
            </View>
            {renderSeveritySelector(hotFlashes, setHotFlashes)}
          </View>

          <View style={styles.symptomBox}>
            <View style={styles.symptomTextCol}>
              <Text style={styles.symptomTitle}>
                Dolor de Cabeza / Uma nanay
              </Text>
              <Text style={styles.symptomSubtitle}>
                Presión o pulsión craneal
              </Text>
            </View>
            {renderSeveritySelector(headache, setHeadache)}
          </View>

          <View style={styles.symptomBox}>
            <View style={styles.symptomTextCol}>
              <Text style={styles.symptomTitle}>
                Desgano / Cansancio corporal
              </Text>
              <Text style={styles.symptomSubtitle}>
                Poca fuerza o deseo de dormir mucho
              </Text>
            </View>
            {renderSeveritySelector(fatigue, setFatigue)}
          </View>
        </View>

        {suggestedPlants.length > 0 && (
          <View style={styles.remediesContainer}>
            <View style={styles.remediesHeader}>
              <Ionicons name="leaf-outline" size={16} color={Colors.verde} />
              <Text style={styles.remediesTitle}>
                {getText("traditionalRemedy")}
              </Text>
            </View>
            <View style={styles.remediesList}>
              {suggestedPlants.map((plant) => {
                const isChecked = selectedRemedies.includes(plant.name);
                return (
                  <TouchableOpacity
                    key={plant.name}
                    activeOpacity={0.7}
                    onPress={() => handleToggleRemedy(plant.name)}
                    style={styles.plantCard}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isChecked && styles.checkboxActive,
                      ]}
                    >
                      {isChecked && (
                        <Ionicons
                          name="checkmark"
                          size={12}
                          color={Colors.white}
                        />
                      )}
                    </View>
                    <View style={styles.plantInfo}>
                      <Text style={styles.plantName}>
                        {plant.name}{" "}
                        <Text style={styles.plantUsage}>({plant.usage})</Text>
                      </Text>
                      <Text style={styles.plantPrep}>{plant.preparation}</Text>
                      {language !== "es" && plant.languages?.[language] ? (
                        <Text style={styles.plantLang}>
                          {plant.languages[language]}
                        </Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{getText("notesLabel")}</Text>
          <TextInput
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
            placeholder="Escribe cómo va tu día, molestias, sentimientos o infusiones que hayas tomado..."
            placeholderTextColor={Colors.muted}
            style={styles.textArea}
          />
        </View>

        <View style={styles.disclaimerBox}>
          <Ionicons
            name="warning-outline"
            size={18}
            color={Colors.roseDark}
            style={{ marginTop: 2 }}
          />
          <Text style={styles.disclaimerText}>
            {getText("clinicalDisclaimer")}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSave}
          style={styles.saveBtn}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={18}
            color={Colors.white}
          />
          <Text style={styles.saveBtnText}>{getText("logBtn")}</Text>
        </TouchableOpacity>
      </View>

      {showSuccessToast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>
            ¡Entrada guardada en tu Diario de Bienestar exitosamente! ✨
          </Text>
        </View>
      )}

      <View style={styles.historySection}>
        <Text style={styles.historyHeader}>HISTORIAL DE REGISTROS</Text>

        {reversedLogs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Aún no has registrado síntomas hoy. ¡Anímate a escribir tu primera
              nota!
            </Text>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {reversedLogs.map((log) => {
              const activeMood = MOODS.find((m) => m.id === log.mood);
              const hasPhysical = Object.values(log.physicalSymptoms).some(
                (s) => s !== undefined,
              );

              return (
                <View key={log.id} style={styles.historyCard}>
                  <TouchableOpacity
                    onPress={() => onDeleteLog(log.id)}
                    style={styles.deleteBtn}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color={Colors.muted}
                    />
                  </TouchableOpacity>

                  <View style={styles.logHeader}>
                    <Text style={{ fontSize: 22 }}>
                      {activeMood?.icon || "🌸"}
                    </Text>
                    <View>
                      <Text style={styles.logMoodTitle}>
                        {activeMood?.label || "Tranquila"}
                      </Text>
                      <Text style={styles.logDateText}>{log.date}</Text>
                    </View>
                  </View>

                  {hasPhysical && (
                    <View style={styles.badgeRow}>
                      {log.physicalSymptoms.cramps && (
                        <View style={[styles.badge, styles.badgeRose]}>
                          <Text style={styles.badgeTextRose}>
                            Cólicos: {log.physicalSymptoms.cramps}
                          </Text>
                        </View>
                      )}
                      {log.physicalSymptoms.hotFlashes && (
                        <View style={[styles.badge, styles.badgeAmber]}>
                          <Text style={styles.badgeTextAmber}>
                            Bochornos: {log.physicalSymptoms.hotFlashes}
                          </Text>
                        </View>
                      )}
                      {log.physicalSymptoms.headache && (
                        <View style={[styles.badge, styles.badgeStone]}>
                          <Text style={styles.badgeTextStone}>
                            Dolor cabeza: {log.physicalSymptoms.headache}
                          </Text>
                        </View>
                      )}
                      {log.physicalSymptoms.fatigue && (
                        <View style={[styles.badge, styles.badgeBlue]}>
                          <Text style={styles.badgeTextBlue}>
                            Cansancio: {log.physicalSymptoms.fatigue}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {log.traditionalRemediesUsed &&
                    log.traditionalRemediesUsed.length > 0 && (
                      <View style={styles.remediesUsedRow}>
                        <Text style={styles.remediesUsedLabel}>
                          Plantas usadas:{" "}
                        </Text>
                        <Text style={styles.remediesUsedValue}>
                          {log.traditionalRemediesUsed.join(", ")}
                        </Text>
                      </View>
                    )}

                  {log.notes ? (
                    <Text style={styles.logNotes}>{log.notes}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}
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
  card: {
    width: "92%",
    overflow: "hidden",
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 0,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 18,
    shadowColor: "#6B3F47",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBadge: {
    backgroundColor: Colors.background,
    padding: 6,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  datePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dateText: {
    fontSize: 16,
    color: Colors.muted,
    fontWeight: "600",
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  moodGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
  },
  moodBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 2,
    borderRadius: 12,
  },
  moodBtnInactive: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  moodIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 10,
    color: Colors.muted,
    fontWeight: "500",
    textAlign: "center",
  },
  symptomBox: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
    marginBottom: 8,
  },
  symptomTextCol: {
    gap: 2,
  },
  symptomTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
  },
  symptomSubtitle: {
    fontSize: 10,
    color: Colors.muted,
  },
  severityContainer: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  severityChip: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  severityChipSelected: {
    backgroundColor: Colors.background,
    borderColor: Colors.rose,
  },
  severityChipText: {
    fontSize: 10,
    color: Colors.muted,
    fontWeight: "500",
  },
  severityChipTextSelected: {
    color: Colors.roseDark,
    fontWeight: "700",
  },
  remediesContainer: {
    backgroundColor: Colors.bgverde,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.bgverde,
    gap: 10,
  },
  remediesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  remediesTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.verde,
  },
  remediesList: {
    gap: 8,
  },
  plantCard: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.bgverde,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: Colors.verde,
    borderColor: Colors.verde,
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
  },
  plantUsage: {
    fontSize: 10,
    color: Colors.verde,
    fontWeight: "400",
  },
  plantPrep: {
    fontSize: 10,
    color: Colors.muted,
    marginTop: 2,
  },
  plantLang: {
    fontSize: 10,
    fontStyle: "italic",
    color: Colors.verde,
    marginTop: 2,
  },
  textArea: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 12,
    color: Colors.text,
    textAlignVertical: "top",
    minHeight: 70,
  },
  disclaimerBox: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.rosado,
    flexDirection: "row",
    gap: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 10,
    color: Colors.roseDark,
    lineHeight: 14,
  },
  saveBtn: {
    backgroundColor: Colors.roseDark,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  toast: {
    backgroundColor: Colors.roseDark,
    padding: 12,
    borderRadius: 12,
  },
  toastText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  historySection: {
    gap: 10,
    marginHorizontal: 16,
  },
  historyHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.muted,
    letterSpacing: 1,
  },
  emptyCard: {
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 12,
    color: Colors.muted,
    textAlign: "center",
  },
  historyCard: {
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
    position: "relative",
  },
  deleteBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 4,
    zIndex: 1,
  },
  logHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logMoodTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#292524",
  },
  logDateText: {
    fontSize: 10,
    color: Colors.muted,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeRose: { backgroundColor: "#FFF1F2", borderColor: Colors.fucsiaLight },
  badgeTextRose: { color: Colors.fucsia, fontSize: 10, fontWeight: "600" },

  badgeAmber: { backgroundColor: Colors.amberLight, borderColor: "#FEF3C7" },
  badgeTextAmber: { color: Colors.amber, fontSize: 10, fontWeight: "600" },

  badgeStone: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
  },
  badgeTextStone: { color: Colors.text, fontSize: 10, fontWeight: "600" },

  badgeBlue: { backgroundColor: Colors.bgazul, borderColor: "#DBEAFE" },
  badgeTextBlue: { color: Colors.azul, fontSize: 10, fontWeight: "600" },

  remediesUsedRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  remediesUsedLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.verde,
  },
  remediesUsedValue: {
    fontSize: 10,
    fontStyle: "italic",
    color: Colors.verde,
  },
  logNotes: {
    fontSize: 11,
    color: Colors.text,
    backgroundColor: Colors.background,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    lineHeight: 16,
  },
});
