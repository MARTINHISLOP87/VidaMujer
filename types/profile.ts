export type WomanStage = "menstruation" | "pregnancy" | "menopause";
export type LanguageCode = "es" | "mi" | "ma";
export type SymptomSeverity = "none" | "mild" | "moderate" | "severe";
export interface UserProfile {
  id: string;
  name: string;
  stage: WomanStage;
  language: LanguageCode;
  cycleLength?: number;
  lmpDate?: string;
  onboarded: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface PhysicalSymptoms {
  cramps?: SymptomSeverity;
  hotFlashes?: SymptomSeverity;
  headache?: SymptomSeverity;
  fatigue?: SymptomSeverity;
}
export interface SymptomLog {
  id: string;
  date: string; // Formato YYYY-MM-DD
  mood: string;
  physicalSymptoms: PhysicalSymptoms;
  notes: string;
  traditionalRemediesUsed: string[];
}
