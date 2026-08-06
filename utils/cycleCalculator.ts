import { CyclePrediction, MenstruationPeriod } from "../types/cycle";

const DAY = 1000 * 60 * 60 * 24;

export function calculatePrediction(
  periods: MenstruationPeriod[],
  averageCycle = 28,
): CyclePrediction | null {
  if (periods.length === 0) return null;

  const sorted = [...periods].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  const lastPeriod = sorted[0];

  const lastDate = new Date(lastPeriod.startDate);

  const nextDate = new Date(lastDate.getTime() + averageCycle * DAY);

  const fertileStart = new Date(lastDate.getTime() + 11 * DAY);

  const fertileEnd = new Date(lastDate.getTime() + 16 * DAY);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  nextDate.setHours(0, 0, 0, 0);

  const diff = Math.ceil((nextDate.getTime() - today.getTime()) / DAY);

  return {
    nextDate: nextDate.toISOString().split("T")[0],

    fertileStart: fertileStart.toISOString().split("T")[0],

    fertileEnd: fertileEnd.toISOString().split("T")[0],

    daysLeft: diff > 0 ? diff : 0,

    overdueBy: diff < 0 ? Math.abs(diff) : 0,
  };
}
