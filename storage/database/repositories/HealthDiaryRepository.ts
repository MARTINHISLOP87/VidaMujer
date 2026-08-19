// Importamos el tipo de conexión SQLite.
import type { SQLiteDatabase } from "expo-sqlite";

// Importamos los tipos utilizados por el repository.
import type {
    DiaryEntry,
    DiaryMoodCode,
    DiarySymptomCode,
    SaveDiaryEntryInput,
    SymptomSeverity,
} from "@/types/diary";

// Definimos la estructura de una fila de síntoma.
// Esta estructura representa el resultado de SQLite.
interface DiarySymptomRow {
  // Código interno del síntoma.
  code: DiarySymptomCode;

  // Nivel de severidad.
  severity: SymptomSeverity;
}

// Definimos la estructura de una fila de remedio.
interface DiaryRemedyRow {
  // Identificador de la planta.
  id: number;

  // Nombre de la planta.
  name: string;

  // Forma de uso.
  usage: string | null;

  // Preparación.
  preparation: string | null;

  // Traducción Miskito.
  language_mi: string | null;
}

// Definimos la estructura principal devuelta
// por la consulta del diario.
interface DiaryEntryRow {
  // Identificador.
  id: number;

  // Usuario.
  user_id: number;

  // Fecha.
  diary_date: string;

  // Código del estado de ánimo.
  mood_code: DiaryMoodCode;

  // Notas.
  notes: string | null;

  // Fecha de creación.
  created_at: string;

  // Fecha de modificación.
  updated_at: string | null;
}

// Creamos la clase responsable de la persistencia
// del diario.
export class HealthDiaryRepository {
  // Guardamos la conexión SQLite.
  private readonly db: SQLiteDatabase;

  // Recibimos la conexión mediante el constructor.
  constructor(db: SQLiteDatabase) {
    // Guardamos la conexión.
    this.db = db;
  }

  // ============================================================
  // GUARDAR DIARIO
  // ============================================================

  // Crea o reemplaza la entrada de una fecha.
  async save(input: SaveDiaryEntryInput): Promise<number> {
    // Obtenemos el identificador del estado de ánimo.
    const mood = await this.db.getFirstAsync<{ id: number }>(
      `
      SELECT id
      FROM diary_moods
      WHERE code = ?
      LIMIT 1;
      `,
      [input.mood],
    );

    // Validamos que el estado exista.
    if (!mood) {
      throw new Error(`No existe el estado de ánimo: ${input.mood}`);
    }

    // Buscamos si ya existe una entrada
    // para ese usuario y fecha.
    const existing = await this.db.getFirstAsync<{ id: number }>(
      `
      SELECT id
      FROM diary_entries
      WHERE user_id = ?
        AND diary_date = ?
      LIMIT 1;
      `,
      [input.userId, input.date],
    );

    // Si existe, actualizamos.
    if (existing) {
      // Ejecutamos la actualización.
      await this.db.runAsync(
        `
        UPDATE diary_entries
        SET
          mood_id = ?,
          notes = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?;
        `,
        [mood.id, input.notes.trim(), existing.id],
      );

      // Eliminamos los síntomas anteriores.
      await this.db.runAsync(
        `
        DELETE FROM diary_entry_symptoms
        WHERE diary_entry_id = ?;
        `,
        [existing.id],
      );

      // Eliminamos los remedios anteriores.
      await this.db.runAsync(
        `
        DELETE FROM diary_entry_remedies
        WHERE diary_entry_id = ?;
        `,
        [existing.id],
      );

      // Volvemos a insertar los síntomas.
      await this.insertSymptoms(existing.id, input.symptoms);

      // Volvemos a insertar los remedios.
      await this.insertRemedies(existing.id, input.remedies);

      // Devolvemos el identificador existente.
      return existing.id;
    }

    // Creamos una nueva entrada.
    const result = await this.db.runAsync(
      `
      INSERT INTO diary_entries
      (
        user_id,
        diary_date,
        mood_id,
        notes
      )
      VALUES (?, ?, ?, ?);
      `,
      [input.userId, input.date, mood.id, input.notes.trim()],
    );

    // Guardamos los síntomas.
    await this.insertSymptoms(result.lastInsertRowId, input.symptoms);

    // Guardamos las plantas.
    await this.insertRemedies(result.lastInsertRowId, input.remedies);

    // Devolvemos el identificador creado.
    return result.lastInsertRowId;
  }

  // ============================================================
  // INSERTAR SÍNTOMAS
  // ============================================================

  // Guarda los síntomas asociados a una entrada.
  private async insertSymptoms(
    diaryEntryId: number,
    symptoms: SaveDiaryEntryInput["symptoms"],
  ): Promise<void> {
    // Recorremos todos los síntomas.
    for (const symptom of symptoms) {
      // Ignoramos los síntomas marcados como "none".
      if (symptom.severity === "none") {
        continue;
      }

      // Buscamos el identificador del síntoma.
      const symptomType = await this.db.getFirstAsync<{ id: number }>(
        `
          SELECT id
          FROM diary_symptom_types
          WHERE code = ?
          LIMIT 1;
          `,
        [symptom.code],
      );

      // Si no existe, continuamos con el siguiente.
      if (!symptomType) {
        continue;
      }

      // Insertamos la relación.
      await this.db.runAsync(
        `
        INSERT INTO diary_entry_symptoms
        (
          diary_entry_id,
          symptom_type_id,
          severity
        )
        VALUES (?, ?, ?);
        `,
        [diaryEntryId, symptomType.id, symptom.severity],
      );
    }
  }

  // ============================================================
  // INSERTAR REMEDIOS
  // ============================================================

  // Guarda las plantas seleccionadas.
  private async insertRemedies(
    diaryEntryId: number,
    remedies: string[],
  ): Promise<void> {
    // Recorremos las plantas seleccionadas.
    for (const remedyName of remedies) {
      // Buscamos la planta por nombre.
      const remedy = await this.db.getFirstAsync<{ id: number }>(
        `
          SELECT id
          FROM diary_remedies
          WHERE name = ?
          LIMIT 1;
          `,
        [remedyName],
      );

      // Si no existe en el catálogo,
      // no insertamos una relación inválida.
      if (!remedy) {
        continue;
      }

      // Guardamos la relación.
      await this.db.runAsync(
        `
        INSERT OR IGNORE INTO diary_entry_remedies
        (
          diary_entry_id,
          remedy_id
        )
        VALUES (?, ?);
        `,
        [diaryEntryId, remedy.id],
      );
    }
  }

  // ============================================================
  // OBTENER UNA ENTRADA
  // ============================================================

  // Obtiene el diario de una fecha específica.
  async getByDate(userId: number, date: string): Promise<DiaryEntry | null> {
    // Buscamos la entrada principal.
    const row = await this.db.getFirstAsync<DiaryEntryRow>(
      `
      SELECT
        de.id,
        de.user_id,
        de.diary_date,
        dm.code AS mood_code,
        de.notes,
        de.created_at,
        de.updated_at
      FROM diary_entries de
      INNER JOIN diary_moods dm
        ON dm.id = de.mood_id
      WHERE de.user_id = ?
        AND de.diary_date = ?
      LIMIT 1;
      `,
      [userId, date],
    );

    // Si no existe, devolvemos null.
    if (!row) {
      return null;
    }

    // Obtenemos los síntomas.
    const symptoms = await this.db.getAllAsync<DiarySymptomRow>(
      `
        SELECT
          dst.code,
          des.severity
        FROM diary_entry_symptoms des
        INNER JOIN diary_symptom_types dst
          ON dst.id = des.symptom_type_id
        WHERE des.diary_entry_id = ?
        ORDER BY des.id ASC;
        `,
      [row.id],
    );

    // Obtenemos los remedios.
    const remedies = await this.db.getAllAsync<DiaryRemedyRow>(
      `
        SELECT
          dr.id,
          dr.name,
          dr.usage,
          dr.preparation,
          dr.language_mi
        FROM diary_entry_remedies der
        INNER JOIN diary_remedies dr
          ON dr.id = der.remedy_id
        WHERE der.diary_entry_id = ?
        ORDER BY der.id ASC;
        `,
      [row.id],
    );

    // Convertimos SQLite a nuestro modelo TypeScript.
    return {
      id: row.id,
      userId: row.user_id,
      date: row.diary_date,
      mood: row.mood_code,
      symptoms,
      notes: row.notes ?? "",
      remedies: remedies.map((remedy) => ({
        id: remedy.id,
        name: remedy.name,
        usage: remedy.usage,
        preparation: remedy.preparation,
        languageMi: remedy.language_mi,
      })),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // ============================================================
  // OBTENER HISTORIAL
  // ============================================================

  // Obtiene todas las entradas del usuario.
  async getAll(userId: number): Promise<DiaryEntry[]> {
    // Obtenemos las entradas ordenadas
    // desde la más reciente.
    const rows = await this.db.getAllAsync<DiaryEntryRow>(
      `
        SELECT
          de.id,
          de.user_id,
          de.diary_date,
          dm.code AS mood_code,
          de.notes,
          de.created_at,
          de.updated_at
        FROM diary_entries de
        INNER JOIN diary_moods dm
          ON dm.id = de.mood_id
        WHERE de.user_id = ?
        ORDER BY de.diary_date DESC, de.id DESC;
        `,
      [userId],
    );

    // Creamos el resultado final.
    const entries: DiaryEntry[] = [];

    // Recorremos las entradas.
    for (const row of rows) {
      // Obtenemos la entrada completa.
      const entry = await this.getByDate(userId, row.diary_date);

      // Añadimos solamente si existe.
      if (entry) {
        entries.push(entry);
      }
    }

    // Devolvemos el historial.
    return entries;
  }

  // ============================================================
  // ELIMINAR
  // ============================================================

  // Elimina una entrada completa.
  async delete(userId: number, diaryEntryId: number): Promise<void> {
    // Eliminamos solamente si pertenece al usuario.
    await this.db.runAsync(
      `
      DELETE FROM diary_entries
      WHERE id = ?
        AND user_id = ?;
      `,
      [diaryEntryId, userId],
    );
  }
}
