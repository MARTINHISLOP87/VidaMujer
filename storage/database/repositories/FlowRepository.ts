// Importamos el tipo SQLiteDatabase desde expo-sqlite.
// Este tipo nos permite trabajar con la conexión SQLite
// utilizando TypeScript.
import type { SQLiteDatabase } from "expo-sqlite";

// Importamos nuestra función centralizada para obtener
// la conexión con la base de datos.
import { getDatabase } from "../database";

/**
 * Representa un registro de la tabla "flows".
 *
 * Esta interfaz refleja exactamente las columnas
 * existentes en flows.sql.
 */
export interface Flow {
  // Identificador único generado automáticamente por SQLite.
  id: number;

  // Nombre del flujo.
  // Ejemplos: Bajo, Medio y Alto.
  name: string;

  // Descripción opcional del flujo.
  description: string | null;
}

/**
 * Repository encargado de todas las operaciones
 * relacionadas con la tabla "flows".
 *
 * La pantalla no accederá directamente a SQLite.
 * Las pantallas utilizarán este Repository.
 */
export class FlowRepository {
  /**
   * Obtiene la conexión centralizada con SQLite.
   */
  private static async getConnection(): Promise<SQLiteDatabase> {
    // Solicitamos la conexión mediante database.ts.
    const database = await getDatabase();

    // Devolvemos la conexión.
    return database;
  }

  /**
   * Obtiene todos los niveles de flujo.
   *
   * Los resultados se ordenan alfabéticamente por nombre.
   */
  static async getAll(): Promise<Flow[]> {
    // Obtenemos la conexión con SQLite.
    const database = await this.getConnection();

    // Ejecutamos el SELECT.
    const flows = await database.getAllAsync<Flow>(
      `
        SELECT
          id,
          name,
          description
        FROM flows
        ORDER BY name ASC;
      `,
    );

    // Devolvemos los registros encontrados.
    return flows;
  }

  /**
   * Busca un flujo por su nombre.
   *
   * Por ejemplo:
   *
   * "Bajo"
   * "Medio"
   * "Alto"
   */
  static async getByName(name: string): Promise<Flow | null> {
    // Obtenemos la conexión.
    const database = await this.getConnection();

    // Buscamos el flujo cuyo nombre coincida.
    const flow = await database.getFirstAsync<Flow>(
      `
        SELECT
          id,
          name,
          description
        FROM flows
        WHERE name = ?
        LIMIT 1;
      `,
      [name],
    );

    // Si no encontramos ningún registro,
    // devolvemos null.
    if (!flow) {
      return null;
    }

    // Devolvemos el flujo encontrado.
    return flow;
  }

  /**
   * Busca únicamente el ID de un flujo mediante su nombre.
   *
   * Este método será especialmente útil para
   * MenstruationTracker.
   *
   * Ejemplo:
   *
   * "Medio" -> 2
   */
  static async getIdByName(name: string): Promise<number | null> {
    // Obtenemos la conexión.
    const database = await this.getConnection();

    // Buscamos únicamente el ID.
    const flow = await database.getFirstAsync<{
      id: number;
    }>(
      `
        SELECT
          id
        FROM flows
        WHERE name = ?
        LIMIT 1;
      `,
      [name],
    );

    // Si no existe el flujo, devolvemos null.
    if (!flow) {
      return null;
    }

    // Devolvemos el ID generado por SQLite.
    return flow.id;
  }

  /**
   * Obtiene un flujo mediante su ID.
   */
  static async getById(id: number): Promise<Flow | null> {
    // Obtenemos la conexión.
    const database = await this.getConnection();

    // Ejecutamos el SELECT.
    const flow = await database.getFirstAsync<Flow>(
      `
        SELECT
          id,
          name,
          description
        FROM flows
        WHERE id = ?
        LIMIT 1;
      `,
      [id],
    );

    // Si no existe, devolvemos null.
    if (!flow) {
      return null;
    }

    // Devolvemos el registro.
    return flow;
  }
}

// Exportamos también la clase como exportación por defecto.
// Esto permite importarla directamente desde otros archivos.
export default FlowRepository;
