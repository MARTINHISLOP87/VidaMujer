// app/(tabs)/symptoms.tsx
import InformationTracker from "@/components/information/informationTracker"; // Ajusta la ruta a tu componente
import { Colors } from "@/theme";
import { useApp } from "@/contexts/AppContext";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function InformationScreen() {
 const { profile } = useApp();
  return (
    <View style={styles.container}>
      <InformationTracker />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
