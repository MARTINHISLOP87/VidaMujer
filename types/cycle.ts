export type FlowIntensity = "Bajo" | "Medio" | "Fuerte";

export interface MenstruationPeriod {
  id: string;
  /** Local date in YYYY-MM-DD format. */
  startDate: string;
  endDate: string;
  cycleLength: number;
  flowIntensity: FlowIntensity;
}

export interface CyclePrediction {
  nextDate: string;
  fertileStart: string;
  fertileEnd: string;
  daysLeft: number;
  overdueBy: number;
}
