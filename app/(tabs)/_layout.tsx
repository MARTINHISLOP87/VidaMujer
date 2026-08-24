import { useApp } from "@/contexts/AppContext";
import { Colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { profile } = useApp();
  const stage = profile?.stage ?? "menstruation";

  return (
    <Tabs
      initialRouteName="symptoms"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.rose,
        tabBarInactiveTintColor: "#9A918D",
        tabBarStyle: { height: 64, paddingTop: 7 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="symptoms"
        options={{
          title: "Diario",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="seguimiento"
        options={{
          href: stage === "menstruation" ? undefined : null,
          title: "Menstruacion",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="pregnancy"
        options={{
          href: stage === "pregnancy" ? undefined : null,
          title: "Embarazo",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="menopause"
        options={{
          href: stage === "menopause" ? undefined : null,
          title: "Menopausia",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="information"
        options={{
          title: "Saberes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="moon" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
