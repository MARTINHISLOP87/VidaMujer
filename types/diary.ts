// Representamos los cuatro niveles de severidad
// utilizados por el formulario original.
export type SymptomSeverity = "none" | "mild" | "moderate" | "severe";

// Representamos los cinco estados de ánimo
// disponibles actualmente.
export type DiaryMoodCode = "calm" | "happy" | "tired" | "pain" | "anxious";

// Representamos los síntomas físicos.
export type DiarySymptomCode =
  | "cramps"
  | "hot_flashes"
  | "headache"
  | "fatigue";

// Representamos una planta recomendada.
export interface DiaryRemedy {
  // Identificador de SQLite.
  id: number;

  // Nombre de la planta.
  name: string;

  // Forma de utilización.
  usage: string | null;

  // Forma de utilización.
  scientificNote: string | null;

  // Forma de preparación.
  preparation: string | null;

  // Traducción Miskito.
  languageMi: string | null;
}

// Representamos una severidad almacenada.
export interface DiarySymptom {
  // Código del síntoma.
  code: DiarySymptomCode;

  // Nivel de intensidad.
  severity: SymptomSeverity;
}

// Representamos una entrada completa del diario.
export interface DiaryEntry {
  // Identificador de SQLite.
  id: number;

  // Usuario propietario.
  userId: number;

  // Fecha del diario.
  date: string;

  // Estado de ánimo.
  mood: DiaryMoodCode;

  // Síntomas registrados.
  symptoms: DiarySymptom[];

  // Notas personales.
  notes: string;

  // Plantas utilizadas.
  remedies: DiaryRemedy[];

  // Fecha de creación.
  createdAt: string;

  // Fecha de modificación.
  updatedAt: string | null;
}

// Datos necesarios para crear o actualizar
// una entrada del diario.
export interface SaveDiaryEntryInput {
  // Usuario que realiza el registro.
  userId: number;

  // Fecha del registro.
  date: string;

  // Estado de ánimo seleccionado.
  mood: DiaryMoodCode;

  // Síntomas seleccionados.
  symptoms: DiarySymptom[];

  // Notas personales.
  notes: string;

  // Nombres de plantas seleccionadas.
  remedies: string[];
}
