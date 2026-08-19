// Importamos los hooks de React.
import { useCallback, useEffect, useState } from "react";

// Importamos la conexión SQLite.
import type { SQLiteDatabase } from "expo-sqlite";

// Importamos nuestro repository.
import { HealthDiaryRepository } from "@/storage/database/repositories/HealthDiaryRepository";

// Importamos nuestros tipos.
import type { DiaryEntry, SaveDiaryEntryInput } from "@/types/diary";

// Definimos las propiedades del hook.
interface UseHealthDiaryProps {
  // Conexión SQLite.
  db: SQLiteDatabase | null;

  // Usuario actualmente autenticado/activo.
  userId: number | null;
}

// Creamos el hook encargado del diario.
export function useHealthDiary({ db, userId }: UseHealthDiaryProps) {
  // Guardamos las entradas.
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  // Indicamos si estamos cargando.
  const [loading, setLoading] = useState(false);

  // Indicamos si ocurrió un error.
  const [error, setError] = useState<string | null>(null);

  // Cargamos el historial.
  const loadEntries = useCallback(async () => {
    // Si no tenemos base de datos,
    // no podemos realizar consultas.
    if (!db) {
      return;
    }

    // Si no existe usuario,
    // no debemos consultar datos.
    if (!userId) {
      setEntries([]);
      return;
    }

    // Activamos el indicador de carga.
    setLoading(true);

    // Limpiamos errores anteriores.
    setError(null);

    try {
      // Creamos el repository.
      const repository = new HealthDiaryRepository(db);

      // Obtenemos los registros.
      const result = await repository.getAll(userId);

      // Actualizamos la pantalla.
      setEntries(result);
    } catch (err) {
      // Convertimos el error a texto.
      setError(
        err instanceof Error ? err.message : "No fue posible cargar el diario.",
      );
    } finally {
      // Finalizamos la carga.
      setLoading(false);
    }
  }, [db, userId]);

  // Guardamos una entrada.
  const saveEntry = useCallback(
    async (input: SaveDiaryEntryInput) => {
      // Validamos la base.
      if (!db) {
        throw new Error("La base de datos todavía no está disponible.");
      }

      // Validamos usuario.
      if (!userId) {
        throw new Error("No existe una usuaria activa.");
      }

      // Creamos el repository.
      const repository = new HealthDiaryRepository(db);

      // Guardamos.
      await repository.save({
        ...input,
        userId,
      });

      // Actualizamos el historial.
      await loadEntries();
    },
    [db, userId, loadEntries],
  );

  // Eliminamos una entrada.
  const deleteEntry = useCallback(
    async (id: number) => {
      // Validamos conexión.
      if (!db) {
        return;
      }

      // Validamos usuario.
      if (!userId) {
        return;
      }

      // Creamos el repository.
      const repository = new HealthDiaryRepository(db);

      // Eliminamos.
      await repository.delete(userId, id);

      // Refrescamos el historial.
      await loadEntries();
    },
    [db, userId, loadEntries],
  );

  // Cargamos los datos automáticamente
  // cuando cambia el usuario o la conexión.
  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  // Exponemos la API del hook.
  return {
    entries,
    loading,
    error,
    saveEntry,
    deleteEntry,
    reload: loadEntries,
  };
}
