// Exportamos la función utilizada para obtener
// la conexión SQLite.
export { closeDatabase, getDatabase, getDatabaseVersion } from "./database";

// Exportamos la función que ejecuta las migraciones.
export { DATABASE_VERSION, runMigrations } from "./migrations/migrations";

