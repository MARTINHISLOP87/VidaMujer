// app/(tabs)/menopause.tsx
import MenopauseFlow from "@/components/menopauce/MenopauseFlow";
import { useApp } from "@/contexts/AppContext";
import { MenopauseChecklist } from "@/types/menopause";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function MenopauseScreen() {
  const { profile } = useApp();
  const checklist = {} as MenopauseChecklist;

  const onUpdateChecklist = (nextChecklist: MenopauseChecklist) => {
    // TODO: persist or update the checklist state if needed.
    console.log("Menopause checklist updated", nextChecklist);
  };

  return (
    <View style={styles.container}>
      <MenopauseFlow
        checklist={checklist}
        onUpdateChecklist={onUpdateChecklist}
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
