/*/ Importamos React para poder trabajar con componentes.
import React from "react";

// Importamos SafeAreaView para respetar las áreas seguras del dispositivo.
import { SafeAreaView, StyleSheet } from "react-native";

// Importamos el componente principal del diario.
import SymptomTracker from "@/components/symptoms/SymptomTracker";

// Importamos los colores globales de VidaMujer.
import { Colors } from "@/theme";

// Definimos la pantalla principal del diario.
export default function SymptomTrackerScreen() {
  // Renderizamos el diario como pantalla inicial posterior al registro.
  return (
    // SafeAreaView evita que el contenido quede debajo del notch o barra de estado.
    <SafeAreaView style={styles.container}>
      {/* 
        El componente SymptomTracker contiene toda la lógica visual
        y funcional del diario que ya construimos.
      *}
      <SymptomTracker />
    </SafeAreaView>
  );
}

// Definimos los estilos de la pantalla.
const styles = StyleSheet.create({
  // Contenedor principal de la pantalla.
  container: {
    // Ocupamos todo el espacio disponible.
    flex: 1,

    // Utilizamos el color de fondo global de la aplicación.
    backgroundColor: Colors.background,
  },
});
*/
