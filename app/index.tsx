import { ScreenLoader } from "@/components/common/ScreenLoader";
import { useApp } from "@/contexts/AppContext";
import { Redirect } from "expo-router";
export default function Index() {
  const { profile, isLoading } = useApp();
  if (isLoading) return <ScreenLoader />;
  return (
    <Redirect href={profile?.onboarded ? "/(tabs)/symptoms" : "/onboarding"} />
  );
}
