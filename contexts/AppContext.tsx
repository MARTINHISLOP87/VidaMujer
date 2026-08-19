import { StorageService } from "@/services/storage.service";
import { UserProfile } from "@/types/profile";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type AppContextValue = {
  profile: UserProfile | null;
  isLoading: boolean;
  completeOnboarding: (profile: UserProfile) => Promise<void>;
  resetProfile: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    StorageService.getProfile()
      .then(setProfile)
      .finally(() => setIsLoading(false));
  }, []);

  const completeOnboarding = async (newProfile: UserProfile) => {
    await StorageService.saveProfile(newProfile);
    setProfile(newProfile);
  };

  const resetProfile = async () => {
    await StorageService.clearProfile();
    setProfile(null);
  };

  return (
    <AppContext.Provider
      value={{ profile, isLoading, completeOnboarding, resetProfile }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp debe utilizarse dentro de AppProvider");
  return context;
}
