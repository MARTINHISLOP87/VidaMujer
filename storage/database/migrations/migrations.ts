// Importamos el tipo SQLiteDatabase.
// Este tipo representa la conexión activa con nuestra base de datos SQLite.
import type { SQLiteDatabase } from "expo-sqlite";

// Definimos la versión actual de nuestro esquema de base de datos.
// Cuando en el futuro hagamos cambios estructurales,
// aumentaremos este número mediante nuevas migraciones.
export const DATABASE_VERSION = 1;

// Esta función ejecuta toda la estructura inicial de nuestra base de datos.
// Recibe la conexión SQLite que fue abierta por database.ts.
export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  // Activamos las claves foráneas de SQLite.
  // Esto permite que SQLite haga cumplir automáticamente
  // las relaciones FOREIGN KEY definidas entre nuestras tablas.
  await db.execAsync(`
    PRAGMA foreign_keys = ON;
  `);

  // ============================================================
  // TABLA: languages
  // ============================================================
  // Esta tabla almacena los idiomas disponibles en la aplicación.
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS languages (
      
      -- Identificador único del idioma.
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      -- Código interno del idioma.
      code TEXT NOT NULL UNIQUE,

      -- Nombre que mostraremos a la usuaria.
      name TEXT NOT NULL
    );
  `);

  // ============================================================
  // TABLA: stages
  // ============================================================
  // Esta tabla almacena las diferentes etapas de vida
  // contempladas actualmente por VidaMujer.
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS stages (

      -- Identificador único de la etapa.
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      -- Código interno utilizado por la aplicación.
      code TEXT NOT NULL UNIQUE,

      -- Nombre visible de la etapa.
      name TEXT NOT NULL,

      -- Descripción de la etapa.
      description TEXT
    );
  `);

  // ============================================================
  // TABLA: users
  // ============================================================
  // Esta es la tabla principal de las usuarias.
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (

      -- Identificador único de la usuaria.
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      -- Nombre que la usuaria desea utilizar.
      display_name TEXT NOT NULL,

      -- Identificador del idioma seleccionado.
      language_id INTEGER NOT NULL,

      -- Identificador de la etapa seleccionada.
      stage_id INTEGER NOT NULL,

      -- Fecha y hora de creación.
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      -- Fecha y hora de última modificación.
      updated_at TEXT,

      -- Relación con la tabla languages.
      FOREIGN KEY (language_id)
        REFERENCES languages(id),

      -- Relación con la tabla stages.
      FOREIGN KEY (stage_id)
        REFERENCES stages(id)
    );
  `);

  // ============================================================
  // TABLA: app_settings
  // ============================================================
  // Aquí almacenaremos configuraciones particulares
  // de cada usuaria.
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_settings (

      -- Identificador único de la configuración.
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      -- Usuario propietario de la configuración.
      user_id INTEGER NOT NULL UNIQUE,

      -- Duración promedio del ciclo.
      average_cycle_length INTEGER NOT NULL DEFAULT 28,

      -- Duración promedio del período.
      average_period_length INTEGER NOT NULL DEFAULT 5,

      -- Indica si las notificaciones están activadas.
      notifications_enabled INTEGER NOT NULL DEFAULT 1,

      -- Tema utilizado por la aplicación.
      theme TEXT NOT NULL DEFAULT 'system',

      -- Formato de fecha utilizado por la aplicación.
      date_format TEXT NOT NULL DEFAULT 'YYYY-MM-DD',

      -- Relación con users.
      FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    );
  `);

  // ============================================================
  // TABLA: flow_types
  // ============================================================
  // Esta tabla funciona como catálogo.
  // Aquí almacenamos Bajo, Medio y Alto.
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS flow_types (

      -- Identificador único del tipo de flujo.
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      -- Nombre del tipo de flujo.
      name TEXT NOT NULL UNIQUE,

      -- Descripción del tipo de flujo.
      description TEXT
    );
  `);

  // ============================================================
  // TABLA: menstrual_cycles
  // ============================================================
  // Esta es una de las tablas principales de VidaMujer.
  // Cada registro representa un período menstrual registrado.
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS menstrual_cycles (

      -- Identificador único del registro.
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      -- Usuario propietario del período.
      user_id INTEGER NOT NULL,

      -- Fecha de inicio del período.
      start_date TEXT NOT NULL,

      -- Fecha de finalización del período.
      end_date TEXT NOT NULL,

      -- Cantidad de días que duró el período.
      duration_days INTEGER NOT NULL,

      -- Duración total estimada del ciclo.
      cycle_length INTEGER NOT NULL DEFAULT 28,

      -- Tipo de flujo registrado.
      flow_type_id INTEGER NOT NULL,

      -- Indica si el registro es real o una predicción.
      -- 0 = registro real.
      -- 1 = registro predicho.
      is_predicted INTEGER NOT NULL DEFAULT 0,

      -- Notas opcionales.
      notes TEXT,

      -- Fecha de creación del registro.
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      -- Fecha de modificación del registro.
      updated_at TEXT,

      -- Relación con users.
      FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

      -- Relación con flow_types.
      FOREIGN KEY (flow_type_id)
        REFERENCES flow_types(id),

      -- La duración de un período debe estar entre 1 y 15 días.
      CHECK (duration_days BETWEEN 1 AND 15),

      -- El ciclo debe estar dentro de un rango razonable.
      CHECK (cycle_length BETWEEN 20 AND 45),

      -- Solo permitimos 0 o 1.
      CHECK (is_predicted IN (0, 1))
    );
  `);

  // ============================================================
  // TABLA: cycle_predictions
  // ============================================================
  // Esta tabla almacena las predicciones calculadas
  // a partir de los ciclos registrados.
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS cycle_predictions (

      -- Identificador único de la predicción.
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      -- Ciclo utilizado como referencia.
      cycle_id INTEGER NOT NULL,

      -- Fecha estimada de la próxima menstruación.
      next_period_date TEXT NOT NULL,

      -- Inicio de la ventana fértil.
      fertile_start TEXT,

      -- Final de la ventana fértil.
      fertile_end TEXT,

      -- Fecha estimada de ovulación.
      ovulation_date TEXT,

      -- Cantidad de días restantes.
      days_remaining INTEGER,

      -- Cantidad de días de retraso.
      overdue_days INTEGER NOT NULL DEFAULT 0,

      -- Fecha de creación de la predicción.
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      -- Relación con menstrual_cycles.
      FOREIGN KEY (cycle_id)
        REFERENCES menstrual_cycles(id)
        ON DELETE CASCADE
    );
  `);

  // ============================================================
  // ÍNDICES
  // ============================================================

  // Índice para buscar rápidamente los ciclos de una usuaria.
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_menstrual_cycles_user_id
    ON menstrual_cycles(user_id);
  `);

  // Índice para ordenar y buscar ciclos por fecha de inicio.
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_menstrual_cycles_start_date
    ON menstrual_cycles(start_date);
  `);

  // Índice para buscar rápidamente las predicciones de un ciclo.
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_cycle_predictions_cycle_id
    ON cycle_predictions(cycle_id);
  `);

  // ============================================================
  // DATOS INICIALES: LANGUAGES
  // ============================================================

  // Insertamos Español.
  // INSERT OR IGNORE evita duplicar el registro si ya existe.
  await db.runAsync(
    `
      INSERT OR IGNORE INTO languages (code, name)
      VALUES (?, ?);
    `,
    ["es", "Español"],
  );

  // Insertamos Miskito.
  await db.runAsync(
    `
      INSERT OR IGNORE INTO languages (code, name)
      VALUES (?, ?);
    `,
    ["mi", "Miskito"],
  );

  // Insertamos Mayagna.
  await db.runAsync(
    `
      INSERT OR IGNORE INTO languages (code, name)
      VALUES (?, ?);
    `,
    ["may", "Mayagna"],
  );

  // ============================================================
  // DATOS INICIALES: STAGES
  // ============================================================

  // Insertamos la etapa menstrual.
  await db.runAsync(
    `
      INSERT OR IGNORE INTO stages (
        code,
        name,
        description
      )
      VALUES (?, ?, ?);
    `,
    ["menstruation", "Ciclo Menstrual", "Seguimiento del ciclo menstrual."],
  );

  // Insertamos la etapa de embarazo.
  await db.runAsync(
    `
      INSERT OR IGNORE INTO stages (
        code,
        name,
        description
      )
      VALUES (?, ?, ?);
    `,
    ["pregnancy", "Embarazo", "Seguimiento del embarazo."],
  );

  // Insertamos la etapa de menopausia.
  await db.runAsync(
    `
      INSERT OR IGNORE INTO stages (
        code,
        name,
        description
      )
      VALUES (?, ?, ?);
    `,
    ["menopause", "Menopausia", "Seguimiento de la menopausia."],
  );

  // ============================================================
  // DATOS INICIALES: FLOW TYPES
  // ============================================================

  // Insertamos flujo bajo.
  await db.runAsync(
    `
      INSERT OR IGNORE INTO flow_types (
        name,
        description
      )
      VALUES (?, ?);
    `,
    ["Bajo", "Flujo menstrual ligero."],
  );

  // Insertamos flujo medio.
  await db.runAsync(
    `
      INSERT OR IGNORE INTO flow_types (
        name,
        description
      )
      VALUES (?, ?);
    `,
    ["Medio", "Flujo menstrual moderado."],
  );

  // Insertamos flujo alto.
  await db.runAsync(
    `
      INSERT OR IGNORE INTO flow_types (
        name,
        description
      )
      VALUES (?, ?);
    `,
    ["Alto", "Flujo menstrual abundante."],
  );
}
