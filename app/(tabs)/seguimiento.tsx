import MenstruationTracker from "@/components/menstruation/MenstruationTracker";
import { CycleService } from "@/services/cycle.service";
import { Colors } from "@/theme";
import { MenstruationPeriod } from "@/types/cycle";
import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";

export default function TrackingScreen() {
  const [periods, setPeriods] = useState<MenstruationPeriod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    CycleService.getPeriods()
      .then(setPeriods)
      .finally(() => setIsLoading(false));
  }, []);

  const addPeriod = async (period: MenstruationPeriod) => {
    const updatedPeriods = [...periods, period];
    await CycleService.savePeriods(updatedPeriods);
    setPeriods(updatedPeriods);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {isLoading ? (
        <ActivityIndicator
          style={styles.loader}
          color={Colors.rose}
          size="large"
        />
      ) : (
        <MenstruationTracker periods={periods} onAddPeriod={addPeriod} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  loader: { flex: 1 },
});
