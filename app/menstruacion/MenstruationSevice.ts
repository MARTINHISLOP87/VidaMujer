// Importamos el repositorio.
import { getMenstruationRepository } from "@/storage/database/repositories/menstruationRepository";

// Importamos el tipo utilizado por la UI.
import type { MenstruationPeriod } from "@/types/cycle";

// Datos para registrar un período.
export interface RegisterPeriodInput {
  userId: number;
  startDate: string;
  endDate: string;
  durationDays: number;
  cycleLength: number;
  flowIntensity: MenstruationPeriod["flowIntensity"];
}

// Registra un período.
export async function registerPeriod(
  input: RegisterPeriodInput,
): Promise<void> {
  const repository = await getMenstruationRepository();

  await repository.createPeriod(input.userId, {
    startDate: input.startDate,
    endDate: input.endDate,
    durationDays: input.durationDays,
    cycleLength: input.cycleLength,
    flowIntensity: input.flowIntensity,
  });
}

// Obtiene el historial.
export async function getPeriods(
  userId: number,
): Promise<MenstruationPeriod[]> {
  const repository = await getMenstruationRepository();

  return repository.getPeriodsByUser(userId);
}
