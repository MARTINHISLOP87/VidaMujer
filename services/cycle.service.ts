import { MenstruationPeriod } from "@/types/cycle";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PERIODS_KEY = "@vidamujer/menstruation-periods";

export class CycleService {
  static async getPeriods(): Promise<MenstruationPeriod[]> {
    const rawPeriods = await AsyncStorage.getItem(PERIODS_KEY);
    return rawPeriods ? (JSON.parse(rawPeriods) as MenstruationPeriod[]) : [];
  }

  static async savePeriods(periods: MenstruationPeriod[]): Promise<void> {
    await AsyncStorage.setItem(PERIODS_KEY, JSON.stringify(periods));
  }
}
