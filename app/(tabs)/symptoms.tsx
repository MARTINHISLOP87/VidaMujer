import React, { useCallback, useEffect, useState } from "react";
//                                 ↑ useEffect para efectos al montar

import SymptomTracker from "@/components/symptoms/SymptomTracker";
import { useApp } from "@/contexts/AppContext";
import { LanguageCode, SymptomLog, WomanStage } from "@/types/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";

const STORAGE_KEY = "@vidamujer:symptom_logs";

export default function SymptomScreen() {
  const { profile } = useApp();
  // Estado principal: array de logs en memoria
  const [logs, setLogs] = useState<SymptomLog[]>([]);

  // Configuración de la usuaria (puedes leerlas de tu contexto global)
  const language: LanguageCode = "es";
  const stage: WomanStage = "menstruation";

  // ── Cargar logs desde AsyncStorage AL MONTAR ──
  useEffect(() => {
    //  useEffect con [] vacío se ejecuta UNA VEZ al montar el componente
    //  Es el lugar correcto para efectos secundarios como leer AsyncStorage

    async function load() {
      try {
        //  Lee el string JSON almacenado en el dispositivo
        const raw = await AsyncStorage.getItem(STORAGE_KEY);

        if (raw) {
          //  Si existe, parsea el JSON y lo pone en el estado
          const parsed: SymptomLog[] = JSON.parse(raw);
          setLogs(parsed);
          //  ↑ Ahora SymptomTracker recibirá estos logs y los mostrará
        }
        //  Si raw es null, no hace /nada: logs queda como []
      } catch (e) {
        //  Si el JSON está corrupto u otra falla, reporta y continúa
        console.error("Error cargando logs:", e);
      }
    }

    load();
    //  ↑ Ejecuta la función asíncrona inmediatamente
  }, []);
  //  ↑ Array de dependencias vacío = solo al montar

  // ── Guardar un nuevo log ──
  const handleSaveLog = useCallback((log: SymptomLog) => {
    //  'log' viene de SymptomTracker.handleSave() con todos los datos

    setLogs((prev) => {
      //  Crea un nuevo array con el log agregado al final
      const updated = [...prev, log];

      //  Guarda en AsyncStorage (sin await porque es fire-and-forget)
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch((e) =>
        console.error("Error guardando:", e),
      );
      //    ↑ .catch maneja errores sin bloquear la UI

      //  Retorna el nuevo array para que React re-renderice
      return updated;
    });
  }, []);

  // ── Eliminar un log existente ──
  const handleDeleteLog = useCallback((id: string) => {
    //  'id' es el identificador único del log a borrar

    setLogs((prev) => {
      //  Filtra el array para quitar el log con ese ID
      const updated = prev.filter((l) => l.id !== id);

      //  Actualiza AsyncStorage con el array sin el log eliminado
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch((e) =>
        console.error("Error al eliminar:", e),
      );

      //  Retorna el array filtrado
      return updated;
    });
  }, []);

  // ── Render ──
  return (
    <View style={{ flex: 1 }}>
      <SymptomTracker
        logs={logs}
        onSaveLog={handleSaveLog}
        onDeleteLog={handleDeleteLog}
        language={language}
        stage={stage}
        username={profile?.name}
      />
    </View>
  );
}
