/*
// ============================================================
// REPOSITORIO DE SÍNTOMAS
// ============================================================

// Importamos el tipo de conexión SQLite.
import type { SQLiteDatabase } from "expo-sqlite";

// Importamos el modelo del diario.
//import type { SymptomLog } from "@/types/profile";

// ============================================================
// REPOSITORIO
// ============================================================

export class SymptomRepository {
  // Guardamos la conexión SQLite.
  private db: SQLiteDatabase;

  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(db: SQLiteDatabase) {
    // Recibimos la conexión SQLite
    // desde la capa de almacenamiento.
    this.db = db;
  }

  // ==========================================================
  // CREAR REGISTRO
  // ==========================================================

  async create(log: SymptomLog): Promise<number> {
    // Insertamos el registro principal del diario.
    //
    // user_id es obligatorio porque el diario pertenece
    // a una usuaria concreta.
    const result = await this.db.runAsync(
      `
      INSERT INTO symptom_logs (
        external_id,
        user_id,
        date,
        mood,
        cramps,
        hot_flashes,
        headache,
        fatigue,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `,
      [
        // ID lógico del registro.
        log.id,

        // ID REAL de SQLite de la usuaria.
        log.userId,

        // Fecha del diario.
        log.date,

        // Estado de ánimo.
        log.mood,

        // Cólicos.
        log.physicalSymptoms.cramps ?? "none",

        // Sofocos.
        log.physicalSymptoms.hotFlashes ?? "none",

        // Dolor de cabeza.
        log.physicalSymptoms.headache ?? "none",

        // Cansancio.
        log.physicalSymptoms.fatigue ?? "none",

        // Notas.
        log.notes,
      ],
    );

    // ========================================================
    // GUARDAR PLANTAS UTILIZADAS
    // ========================================================

    // Recorremos todas las plantas seleccionadas.
    for (const plantName of log.traditionalRemediesUsed) {
      // Insertamos cada planta relacionada
      // con este registro del diario.
      await this.db.runAsync(
        `
        INSERT INTO symptom_log_remedies (
          symptom_log_id,
          plant_name
        )
        VALUES (?, ?);
        `,
        [
          // ID SQLite del registro recién creado.
          result.lastInsertRowId,

          // Nombre de la planta.
          plantName,
        ],
      );
    }

    // Devolvemos el ID SQLite del nuevo registro.
    return result.lastInsertRowId;
  }

  // ==========================================================
  // OBTENER REGISTROS DE UNA USUARIA
  // ==========================================================

  async getByUserId(userId: number): Promise<SymptomLog[]> {
    // Consultamos únicamente los registros
    // pertenecientes a la usuaria indicada.
    const rows = await this.db.getAllAsync<any>(
      `
      SELECT
        id,
        external_id,
        user_id,
        date,
        mood,
        cramps,
        hot_flashes,
        headache,
        fatigue,
        notes
      FROM symptom_logs
      WHERE user_id = ?
      ORDER BY date DESC, id DESC;
      `,
      [
        // ID SQLite de la usuaria.
        userId,
      ],
    );

    // Transformamos los registros SQLite
    // al modelo utilizado por React Native.
    const logs: SymptomLog[] = [];

    // Recorremos cada registro encontrado.
    for (const row of rows) {
      // Obtenemos las plantas utilizadas
      // en este registro.
      const remedies = await this.db.getAllAsync<{
        plant_name: string;
      }>(
        `
          SELECT plant_name
          FROM symptom_log_remedies
          WHERE symptom_log_id = ?
          ORDER BY id ASC;
          `,
        [
          // ID SQLite del registro.
          row.id,
        ],
      );

      // Convertimos el registro SQLite
      // al modelo SymptomLog.
      logs.push({
        // Recuperamos el ID lógico.
        id: row.external_id,

        // Recuperamos el ID del usuario.
        userId: row.user_id,

        // Recuperamos la fecha.
        date: row.date,

        // Recuperamos el estado de ánimo.
        mood: row.mood,

        // Reconstruimos los síntomas físicos.
        physicalSymptoms: {
          // Cólicos.
          cramps: row.cramps,

          // Sofocos.
          hotFlashes: row.hot_flashes,

          // Dolor de cabeza.
          headache: row.headache,

          // Cansancio.
          fatigue: row.fatigue,
        },

        // Recuperamos las notas.
        notes: row.notes ?? "",

        // Convertimos las plantas
        // a un arreglo de nombres.
        traditionalRemediesUsed: remedies.map((item) => item.plant_name),
      });
    }

    // Devolvemos el historial completo.
    return logs;
  }
}
*/
