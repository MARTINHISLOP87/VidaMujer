// Importamos el tipo de conexión SQLite.
import type { SQLiteDatabase } from "expo-sqlite";

// Importamos nuestra conexión centralizada.
import { getDatabase } from "@/storage/database/database";

// Definimos los datos iniciales
// que tendrá la configuración de una usuaria.
export interface CreateUserSettingsInput {
  // ID de la usuaria propietaria.
  userId: number;

  // Duración promedio del ciclo.
  averageCycleLength: number;

  // Duración promedio del período.
  averagePeriodLength: number;
}

// Clase responsable de trabajar
// con la tabla app_settings.
export class UserSettingsRepository {
  // Guardamos la conexión SQLite.
  private readonly db: SQLiteDatabase;

  // Recibimos la conexión desde fuera.
  constructor(db: SQLiteDatabase) {
    // Guardamos la conexión.
    this.db = db;
  }

  // Creamos la configuración inicial.
  async create(input: CreateUserSettingsInput): Promise<void> {
    // Insertamos la configuración relacionada
    // con la usuaria mediante user_id.
    await this.db.runAsync(
      `
      INSERT INTO app_settings (
        user_id,
        average_cycle_length,
        average_period_length,
        notifications_enabled,
        theme,
        date_format
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      input.userId,
      input.averageCycleLength,
      input.averagePeriodLength,
      1,
      "system",
      "YYYY-MM-DD",
    );
  }

  // Obtiene la configuración de una usuaria.
  async getByUserId(userId: number) {
    // Consultamos la configuración mediante user_id.
    return this.db.getFirstAsync(
      `
      SELECT
        id,
        user_id AS userId,
        average_cycle_length AS averageCycleLength,
        average_period_length AS averagePeriodLength,
        notifications_enabled AS notificationsEnabled,
        theme,
        date_format AS dateFormat
      FROM app_settings
      WHERE user_id = ?
      LIMIT 1
      `,
      userId,
    );
  }
}

// Función central para obtener el repositorio.
export async function getUserSettingsRepository(): Promise<UserSettingsRepository> {
  // Obtenemos la conexión SQLite.
  const db = await getDatabase();

  // Creamos el repositorio.
  return new UserSettingsRepository(db);
}
