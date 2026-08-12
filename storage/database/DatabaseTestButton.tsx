// Importamos React para poder crear nuestro componente.
import React, { useState } from "react";

// Importamos los componentes visuales que utilizaremos.
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

// Importamos nuestra función encargada de obtener la conexión SQLite.
import { getDatabase } from "./database";

// Creamos el componente de prueba de SQLite.
export default function DatabaseTestButton() {
  // Guardamos si actualmente estamos ejecutando la prueba.
  const [loading, setLoading] = useState(false);

  // Función que ejecutará nuestra prueba.
  const testDatabase = async () => {
    // Activamos el estado de carga.
    setLoading(true);

    try {
      // Obtenemos la conexión con nuestra base de datos.
      const db = await getDatabase();

      // Mostramos en la consola que conseguimos la conexión.
      console.log("✅ Conexión SQLite obtenida correctamente.");

      // Ejecutamos una consulta muy sencilla.
      const result = await db.getFirstAsync<{ resultado: number }>(
        "SELECT 1 AS resultado;",
      );

      // Mostramos el resultado obtenido.
      console.log("✅ Resultado SQLite:", result);

      // Mostramos el resultado en la aplicación.
      Alert.alert(
        "SQLite funcionando",
        `La base de datos respondió correctamente.\n\nResultado: ${result?.resultado}`,
      );
    } catch (error) {
      // Mostramos el error completo en Metro.
      console.error("❌ Error al probar SQLite:", error);

      // Mostramos el error al usuario.
      Alert.alert("Error SQLite", "No se pudo ejecutar la prueba de SQLite.");
    } finally {
      // Finalizamos el estado de carga.
      setLoading(false);
    }
  };

  // Renderizamos el botón.
  return (
    <View style={styles.container}>
      {/* Botón que ejecutará la prueba. */}
      <Pressable
        style={styles.button}
        onPress={testDatabase}
        disabled={loading}
      >
        {/* Texto del botón. */}
        <Text style={styles.buttonText}>
          {loading ? "Probando SQLite..." : "🧪 Probar SQLite"}
        </Text>
      </Pressable>
    </View>
  );
}

// Definimos los estilos del botón.
const styles = StyleSheet.create({
  // Contenedor principal.
  container: {
    marginVertical: 20,
  },

  // Estilo del botón.
  button: {
    backgroundColor: "#7C3AED",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },

  // Estilo del texto.
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
