// app/(tabs)/pregnancy.tsx
import PregnancyTracker from "@/components/pregnancy/PregnancyTracker";
import { useApp } from "@/contexts/AppContext";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function PregnancyScreen() {
  const { profile } = useApp();

  return (
    <View style={styles.container}>
      <PregnancyTracker
        lastPeriodDate={profile?.lmpDate ?? ""}
        language={profile?.language ?? "es"}
        username={profile?.name}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
  },
});
