// Importamos el tipo SQLiteDatabase de Expo SQLite.
// Este tipo representa la conexión activa con nuestra base de datos local.
import type { SQLiteDatabase } from "expo-sqlite";

// Importamos la función que nos proporciona la conexión
// única y centralizada de nuestra aplicación.
import { getDatabase } from "@/storage/database/database";

// Definimos la información mínima necesaria
// para crear una usuaria en SQLite.
export interface CreateUserInput {
  // Nombre mostrado dentro de la aplicación.
  displayName: string;

  // Código del idioma seleccionado.
  languageCode: string;

  // Código de la etapa seleccionada.
  stageCode: string;
}

// Definimos la información que devolveremos
// después de crear la usuaria.
export interface UserRecord {
  // Identificador numérico generado por SQLite.
  id: number;

  // Nombre visible de la usuaria.
  displayName: string;

  // Código del idioma.
  languageCode: string;

  // Nombre del idioma.
  languageName: string;

  // Código de la etapa.
  stageCode: string;

  // Nombre de la etapa.
  stageName: string;
}

// Clase responsable exclusivamente
// de acceder a la tabla users.
export class UserRepository {
  // Guardamos la conexión SQLite dentro del repositorio.
  private readonly db: SQLiteDatabase;

  // Constructor del repositorio.
  constructor(db: SQLiteDatabase) {
    // Guardamos la conexión recibida.
    this.db = db;
  }

  // Crea una nueva usuaria dentro de SQLite.
  async create(input: CreateUserInput): Promise<UserRecord> {
    // Buscamos el idioma seleccionado por su código.
    const language = await this.db.getFirstAsync<{
      id: number;
    }>(
      `
      SELECT id
      FROM languages
      WHERE code = ?
      LIMIT 1
      `,
      input.languageCode,
    );

    // Si no encontramos el idioma,
    // detenemos la operación para evitar datos inválidos.
    if (!language) {
      throw new Error(`No existe el idioma con código: ${input.languageCode}`);
    }

    // Buscamos la etapa seleccionada por su código.
    const stage = await this.db.getFirstAsync<{
      id: number;
    }>(
      `
      SELECT id
      FROM stages
      WHERE code = ?
      LIMIT 1
      `,
      input.stageCode,
    );

    // Si no existe la etapa,
    // detenemos la operación.
    if (!stage) {
      throw new Error(`No existe la etapa con código: ${input.stageCode}`);
    }

    // Insertamos la usuaria dentro de SQLite.
    // El ID no lo proporcionamos porque SQLite lo genera automáticamente.
    const result = await this.db.runAsync(
      `
      INSERT INTO users (
        display_name,
        language_id,
        stage_id
      )
      VALUES (?, ?, ?)
      `,
      input.displayName,
      language.id,
      stage.id,
    );

    // Obtenemos inmediatamente el registro recién creado.
    const createdUser = await this.db.getFirstAsync<UserRecord>(
      `
      SELECT
        u.id AS id,
        u.display_name AS displayName,
        l.code AS languageCode,
        l.name AS languageName,
        s.code AS stageCode,
        s.name AS stageName
      FROM users u

      INNER JOIN languages l
        ON l.id = u.language_id

      INNER JOIN stages s
        ON s.id = u.stage_id

      WHERE u.id = ?

      LIMIT 1
      `,
      result.lastInsertRowId,
    );

    // Si por alguna razón no podemos recuperar
    // el registro recién insertado, informamos el error.
    if (!createdUser) {
      throw new Error(
        "La usuaria fue creada, pero no pudo recuperarse desde SQLite.",
      );
    }

    // Devolvemos el registro completo.
    return createdUser;
  }

  // Obtiene una usuaria mediante su ID.
  async getById(id: number): Promise<UserRecord | null> {
    // Ejecutamos una consulta utilizando las relaciones
    // entre users, languages y stages.
    const user = await this.db.getFirstAsync<UserRecord>(
      `
      SELECT
        u.id AS id,
        u.display_name AS displayName,
        l.code AS languageCode,
        l.name AS languageName,
        s.code AS stageCode,
        s.name AS stageName
      FROM users u

      INNER JOIN languages l
        ON l.id = u.language_id

      INNER JOIN stages s
        ON s.id = u.stage_id

      WHERE u.id = ?

      LIMIT 1
      `,
      id,
    );

    // Devolvemos el usuario encontrado
    // o null si no existe.
    return user ?? null;
  }

  // Obtiene la última usuaria registrada.
  // Esto es útil porque VidaMujer funciona actualmente
  // como una aplicación local para una usuaria.
  async getLatest(): Promise<UserRecord | null> {
    // Buscamos la usuaria cuyo ID sea más reciente.
    const user = await this.db.getFirstAsync<UserRecord>(
      `
      SELECT
        u.id AS id,
        u.display_name AS displayName,
        l.code AS languageCode,
        l.name AS languageName,
        s.code AS stageCode,
        s.name AS stageName
      FROM users u

      INNER JOIN languages l
        ON l.id = u.language_id

      INNER JOIN stages s
        ON s.id = u.stage_id

      ORDER BY u.id DESC

      LIMIT 1
      `,
    );

    // Devolvemos el registro o null.
    return user ?? null;
  }
}

// Creamos una función para obtener el repositorio.
// De esta manera todas las operaciones utilizan
// la misma conexión centralizada de SQLite.
export async function getUserRepository(): Promise<UserRepository> {
  // Obtenemos la conexión SQLite.
  const db = await getDatabase();

  // Creamos y devolvemos el repositorio.
  return new UserRepository(db);
}
