export type FlowIntensity = 'light' | 'medium' | 'heavy';

export interface MenstruationPeriod {
  id: string;
  startDate: string;
  endDate: string;
  cycleLength: number;
  flowIntensity: FlowIntensity;
}
