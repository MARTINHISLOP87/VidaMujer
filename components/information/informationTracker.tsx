import { useApp } from "@/contexts/AppContext";
import { Colors } from "@/theme";
import { GLOSSARY_DATA, MYTHS_DB } from "@/types/information";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BookOpen } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppHeader from "../onboarding/AppHeader";
export interface MythItem {
  id: string;
  stage: "menstruation" | "pregnancy" | "menopause" | string;
  myth: string;
  fact: string;
  explanation: string;
  scientificBasis: string;
}

export interface GlossaryItem {
  termEs: string;
  termMi?: string;
  meaning: string;
  category: "stage" | "anatomy" | "traditional_medicine" | "feeling" | string;
}

const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "stage", label: "Etapas" },
  { id: "anatomy", label: "Cuerpo" },
  { id: "traditional_medicine", label: "Plantas" },
  { id: "feeling", label: "Ánimo" },
];

export default function MythBuster() {
  const { profile } = useApp();
  const [activeMythId, setActiveMythId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGlossaryCategory, setSelectedGlossaryCategory] =
    useState<string>("all");

  const filteredGlossary = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return GLOSSARY_DATA.filter((item) => {
      const matchesSearch =
        !query ||
        item.termEs.toLowerCase().includes(query) ||
        (item.termMi && item.termMi.toLowerCase().includes(query)) ||
        item.meaning.toLowerCase().includes(query);

      const matchesCategory =
        selectedGlossaryCategory === "all" ||
        item.category === selectedGlossaryCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedGlossaryCategory]);

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case "menstruation":
        return "Mito de Menstruación";
      case "pregnancy":
        return "Mito de Embarazo";
      case "menopause":
        return "Mito de Menopausia";
      default:
        return "Mito de Salud";
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "anatomy":
        return "Cuerpo";
      case "stage":
        return "Etapa";
      case "feeling":
        return "Ánimo";
      default:
        return "Planta";
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <AppHeader
        userName={profile?.name || ""}
        language={profile?.language ?? "es"}
        subtitle="Informacion General"
        onMoonPress={() => console.log("luna")}
        onSettingsPress={() => console.log("ajustes")}
        onLanguagePress={() => console.log("idioma")}
      />
      <LinearGradient
        colors={[Colors.verdeligt, Colors.bgverde]} // Gradiente ámbar a naranja
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mitosCard}
      >
        {/* Fondo del ícono de la sol */}
        <View style={styles.bookBackground}>
          <BookOpen color={Colors.white} size={96} strokeWidth={1} />
        </View>
        {/* Mitos vs Verdades */}
        <View style={styles.sectionHeader}>
          <View style={styles.titleRow}>
            <Ionicons name="help-circle-outline" size={18} color="#f97316" />
            <Text style={styles.sectionTitle}>
              Mitos vs Verdades / Willakuykuna
            </Text>
          </View>
          <Text style={styles.sectionDescription}>
            A veces escuchamos consejos que infunden miedo o culpas. Presiona
            sobre cualquier recuadro para revelar la verdad con sustento
            científico y respeto ancestral:
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.mythsList}>
        {MYTHS_DB.map((item) => {
          const isActive = activeMythId === item.id;
          return (
            <View
              key={item.id}
              style={[
                styles.mythCard,
                isActive ? styles.mythCardActive : styles.mythCardInactive,
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setActiveMythId(isActive ? null : item.id)}
                style={styles.mythHeaderBtn}
              >
                <View style={styles.mythHeaderContent}>
                  <View style={styles.stageTag}>
                    <Text style={styles.stageTagText}>
                      {getStageLabel(item.stage)}
                    </Text>
                  </View>
                  <Text style={styles.mythQuestion}>{item.myth}</Text>
                </View>

                <View style={styles.togglePill}>
                  <Text style={styles.togglePillText}>
                    {isActive ? "Cerrar" : "Revelar"}
                  </Text>
                </View>
              </TouchableOpacity>

              {isActive && (
                <View style={styles.mythBody}>
                  {/* Verdadero diagnóstico médico */}
                  <View style={styles.factBox}>
                    <Ionicons
                      name="thumbs-up-outline"
                      size={18}
                      color="#059669"
                      style={{ marginTop: 2 }}
                    />
                    <View style={styles.factTextCol}>
                      <Text style={styles.factLabel}>LA VERDAD MÉDICA:</Text>
                      <Text style={styles.factText}>{item.fact}</Text>
                    </View>
                  </View>

                  {/* Explicación cercana */}
                  <View style={styles.explanationBox}>
                    <Text style={styles.explanationLabel}>
                      Explicación Cercana:
                    </Text>
                    <Text style={styles.explanationText}>
                      {item.explanation}
                    </Text>
                  </View>

                  {/* Sustento científico */}
                  <View style={styles.scientificBox}>
                    <Text style={styles.scientificLabel}>
                      SUSTENTO CIENTÍFICO:
                    </Text>
                    <Text style={styles.scientificText}>
                      {item.scientificBasis}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Glosario y Lenguas Originarias */}
      <View style={styles.glossaryCard}>
        <View style={styles.glossaryHeader}>
          <View style={styles.titleRow}>
            <Ionicons name="book-outline" size={18} color="#f97316" />
            <Text style={styles.glossaryTitle}>
              Glosario y Lenguas Originarias
            </Text>
          </View>
          <Text style={styles.glossarySubtitle}>
            Nombres tradicionales de órganos corporales, plantas sagradas y
            sentimientos médicos traducidos con amor al Miskito para recuperar
            la confianza familiar.
          </Text>
        </View>

        {/* Buscador */}
        <View style={styles.searchBarContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#A8A29E"
            style={styles.searchIcon}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar término en Español o Miskito..."
            placeholderTextColor="#A8A29E"
            style={styles.searchInput}
          />
        </View>

        {/* Filtros de Categoría */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedGlossaryCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.7}
                onPress={() => setSelectedGlossaryCategory(cat.id)}
                style={[
                  styles.categoryChip,
                  isSelected
                    ? styles.categoryChipActive
                    : styles.categoryChipInactive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Resultados del Glosario */}
        <View style={styles.glossaryGrid}>
          {filteredGlossary.length > 0 ? (
            filteredGlossary.map((item, idx) => (
              <View key={idx} style={styles.termCard}>
                <View style={styles.termCardHeader}>
                  <Text style={styles.termEs}>{item.termEs}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {getCategoryBadge(item.category)}
                    </Text>
                  </View>
                </View>

                {item.termMi && (
                  <View style={styles.nativeTermRow}>
                    <Text style={styles.nativeTermPrefix}>• Miskito:</Text>
                    <Text style={styles.nativeTermValue}>{item.termMi}</Text>
                  </View>
                )}

                <Text style={styles.meaningText}>
                  <Text style={styles.meaningLabel}>Significado: </Text>
                  {item.meaning}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No encontramos coincidencias para esa búsqueda de término.
                ¡Prueba otra palabra!
              </Text>
            </View>
          )}
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
  sectionHeader: {
    gap: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#57534E",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  mitosCard: {
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
  bookBackground: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 32,
    opacity: 0.1,
    transform: [{ scale: 1.5 }, { rotate: "12deg" }],
  },
  sectionDescription: {
    fontSize: 12,
    color: "#78716C",
    lineHeight: 16,
    marginLeft: 16,
  },
  mythsList: {
    gap: 12,
  },
  mythCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  mythCardInactive: {
    borderColor: "#E7E5E4",
  },
  mythCardActive: {
    borderColor: "#FDA4AF",
    shadowColor: "#F43F5E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  mythHeaderBtn: {
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  mythHeaderContent: {
    flex: 1,
    gap: 6,
  },
  stageTag: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF1F2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  stageTagText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#E11D48",
    textTransform: "uppercase",
  },
  mythQuestion: {
    fontSize: 12,
    fontWeight: "600",
    color: "#292524",
    lineHeight: 18,
  },
  togglePill: {
    backgroundColor: "#FAF9F6",
    borderWidth: 1,
    borderColor: "#E7E5E4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  togglePillText: {
    fontSize: 10,
    color: "#78716C",
    fontWeight: "600",
  },
  mythBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F4",
    backgroundColor: "#FAFAF9",
    gap: 12,
  },
  factBox: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  factTextCol: {
    flex: 1,
    gap: 2,
  },
  factLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#065F46",
  },
  factText: {
    fontSize: 11,
    color: "#1C1917",
    lineHeight: 16,
  },
  explanationBox: {
    gap: 2,
    paddingLeft: 2,
  },
  explanationLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#292524",
  },
  explanationText: {
    fontSize: 11,
    color: "#57534E",
    lineHeight: 16,
  },
  scientificBox: {
    borderLeftWidth: 2,
    borderLeftColor: "#D6D3D1",
    paddingLeft: 10,
    gap: 2,
  },
  scientificLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#78716C",
    textTransform: "uppercase",
  },
  scientificText: {
    fontSize: 10,
    color: "#78716C",
    lineHeight: 15,
  },
  glossaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E7E5E4",
    gap: 14,
  },
  glossaryHeader: {
    gap: 4,
  },
  glossaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C1917",
  },
  glossarySubtitle: {
    fontSize: 10,
    color: "#78716C",
    lineHeight: 14,
  },
  searchBarContainer: {
    position: "relative",
    justifyContent: "center",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: "#FAF9F6",
    borderWidth: 1,
    borderColor: "#E7E5E4",
    borderRadius: 12,
    paddingVertical: 10,
    paddingLeft: 38,
    paddingRight: 12,
    fontSize: 11,
    color: "#1C1917",
  },
  categoriesRow: {
    flexDirection: "row",
    gap: 6,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryChipActive: {
    backgroundColor: "#F43F5E",
    borderColor: "#F43F5E",
  },
  categoryChipInactive: {
    backgroundColor: "#FAF9F6",
    borderColor: "#E7E5E4",
  },
  categoryChipText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#57534E",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  glossaryGrid: {
    gap: 10,
    paddingTop: 4,
  },
  termCard: {
    backgroundColor: "#FAF9F6",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E7E5E4",
    gap: 8,
  },
  termCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  termEs: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1C1917",
  },
  categoryBadge: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E5E4",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#78716C",
    textTransform: "uppercase",
  },
  nativeTermRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E7E5E4",
    borderStyle: "dashed",
    paddingTop: 6,
  },
  nativeTermPrefix: {
    fontSize: 10,
    color: "#047857",
    fontWeight: "600",
  },
  nativeTermValue: {
    fontSize: 11,
    fontWeight: "700",
    color: "#047857",
    textDecorationLine: "underline",
  },
  meaningText: {
    fontSize: 10,
    color: "#57534E",
    fontStyle: "italic",
    borderTopWidth: 1,
    borderTopColor: "#F5F5F4",
    paddingTop: 6,
    lineHeight: 14,
  },
  meaningLabel: {
    fontWeight: "600",
    fontStyle: "normal",
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 11,
    color: "#A8A29E",
    fontStyle: "italic",
    textAlign: "center",
  },
});
