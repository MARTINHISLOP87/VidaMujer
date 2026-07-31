import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/types/profile';

const PROFILE_KEY = '@vidamujer/profile';

export class StorageService {
  static async getProfile(): Promise<UserProfile | null> {
    const rawProfile = await AsyncStorage.getItem(PROFILE_KEY);
    return rawProfile ? (JSON.parse(rawProfile) as UserProfile) : null;
  }

  static async saveProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  static async clearProfile(): Promise<void> {
    await AsyncStorage.removeItem(PROFILE_KEY);
  }
}
