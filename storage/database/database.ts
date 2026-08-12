// Importamos la función que abre una base SQLite.
import { openDatabaseAsync } from "expo-sqlite";

// Importamos nuestra función encargada
// de crear las tablas y relaciones.
import { DATABASE_VERSION, runMigrations } from "./migrations/migrations";

// Importamos el tipo de base de datos.
import type { SQLiteDatabase } from "expo-sqlite";

// Variable privada que almacenará la conexión.
let database: SQLiteDatabase | null = null;

// Nombre físico del archivo SQLite.
const DATABASE_NAME = "vidamujer.db";

// Esta función devuelve la conexión actual.
// Si todavía no existe, la crea.
export async function getDatabase(): Promise<SQLiteDatabase> {
  // Comprobamos si ya existe una conexión.
  if (database) {
    // Si existe, simplemente la devolvemos.
    return database;
  }

  // Abrimos la base de datos local.
  database = await openDatabaseAsync(DATABASE_NAME);

  // Ejecutamos las migraciones iniciales.
  await runMigrations(database);

  // Devolvemos la conexión.
  return database;
}

// Esta función permite cerrar correctamente
// la conexión con SQLite.
export async function closeDatabase(): Promise<void> {
  // Comprobamos que exista una conexión.
  if (!database) {
    // Si no existe, no hay nada que cerrar.
    return;
  }

  // Cerramos físicamente la base de datos.
  await database.closeAsync();

  // Eliminamos la referencia para permitir
  // abrirla nuevamente cuando sea necesario.
  database = null;
}

// Esta función devuelve la versión
// que utiliza actualmente nuestro esquema.
export function getDatabaseVersion(): number {
  // Devolvemos la versión definida en migrations.ts.
  return DATABASE_VERSION;
}
