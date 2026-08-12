// Importamos el tipo de conexión SQLite.
import type { SQLiteDatabase } from "expo-sqlite";

// Importamos la conexión centralizada.
import { getDatabase } from "../database";

// Importamos los tipos utilizados por la interfaz.
import type { FlowIntensity, MenstruationPeriod } from "@/types/cycle";

// Datos necesarios para crear un período.
export interface CreateMenstruationPeriodInput {
  startDate: string;
  endDate: string;
  durationDays: number;
  cycleLength: number;
  flowIntensity: FlowIntensity;
}

// Fila devuelta por SQLite.
interface PeriodRow {
  id: number;
  start_date: string;
  end_date: string;
  cycle_length: number;
  flow_name: string;
}

// Repositorio de menstruación.
export class MenstruationRepository {
  // Conexión SQLite.
  private readonly db: SQLiteDatabase;

  constructor(db: SQLiteDatabase) {
    this.db = db;
  }

  // Busca el ID del flujo.
  private async getFlowTypeId(flow: FlowIntensity): Promise<number> {
    const row = await this.db.getFirstAsync<{ id: number }>(
      `
      SELECT id
      FROM flow_types
      WHERE name = ?
      LIMIT 1
      `,
      flow,
    );

    if (!row) {
      throw new Error(`No existe el flujo ${flow}`);
    }

    return row.id;
  }

  // Guarda un período.
  async createPeriod(
    userId: number,
    input: CreateMenstruationPeriodInput,
  ): Promise<void> {
    const flowTypeId = await this.getFlowTypeId(input.flowIntensity);

    await this.db.runAsync(
      `
      INSERT INTO menstrual_cycles (
        user_id,
        start_date,
        end_date,
        duration_days,
        cycle_length,
        flow_type_id,
        is_predicted
      )
      VALUES (?, ?, ?, ?, ?, ?, 0)
      `,
      userId,
      input.startDate,
      input.endDate,
      input.durationDays,
      input.cycleLength,
      flowTypeId,
    );
  }

  // Obtiene los períodos del usuario.
  async getPeriodsByUser(userId: number): Promise<MenstruationPeriod[]> {
    const rows = await this.db.getAllAsync<PeriodRow>(
      `
        SELECT
          mc.id,
          mc.start_date,
          mc.end_date,
          mc.cycle_length,
          ft.name AS flow_name
        FROM menstrual_cycles mc
        INNER JOIN flow_types ft
          ON ft.id = mc.flow_type_id
        WHERE mc.user_id = ?
        ORDER BY mc.start_date DESC
        `,
      userId,
    );

    return rows.map((row) => ({
      id: String(row.id),
      startDate: row.start_date,
      endDate: row.end_date,
      cycleLength: row.cycle_length,
      flowIntensity: row.flow_name as FlowIntensity,
    }));
  }
}

// Función para obtener el repositorio.
export async function getMenstruationRepository() {
  const db = await getDatabase();

  return new MenstruationRepository(db);
}
