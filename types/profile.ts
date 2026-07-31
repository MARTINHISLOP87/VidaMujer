export type WomanStage = 'menstruation' | 'pregnancy' | 'menopause';
export type LanguageCode = 'es' | 'mi';

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
