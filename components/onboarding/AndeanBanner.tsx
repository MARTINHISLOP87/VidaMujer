import { Colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";

// Interfaz TypeScript para las propiedades del banner
export interface AndeanBannerProps {
  tagline?: string;
  title?: string;
  description?: string;
}

export default function AndeanBanner({
  tagline = "Sumaq Kawsay",
  title = "Vida Mujer",
  description = "Acompañamiento Integral y Sabiduría para la Salud de la Mujer",
}: AndeanBannerProps) {
  // Replicación de la animación `animate-bounce` de Tailwind
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10, // Altura del rebote
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    );

    bounceAnimation.start();

    return () => bounceAnimation.stop();
  }, [translateY]);

  return (
    <LinearGradient
      // Colores tomados de Tailwind: red-400 -> rose-400 -> orange-400
      colors={[Colors.rose, Colors.rose, Colors.amber]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.container}
    >
      {/* Badge Flotante Superior Derecho */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{tagline}</Text>
      </View>

      {/* Ícono de Corazón Animado (Bounce + Sombra) */}
      <Animated.View
        style={[styles.iconContainer, { transform: [{ translateY }] }]}
      >
        <Ionicons name="heart" size={48} color={Colors.roseLight} />
      </Animated.View>

      {/* Título Principal */}
      <Text style={styles.title}>{title}</Text>

      {/* Subtítulo / Descripción */}
      <Text style={styles.description}>{description}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24, // p-6
    alignItems: "center", // text-center
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 12, // top-3
    right: 12, // right-3
    backgroundColor: "rgba(255, 255, 255, 0.2)", // bg-white/20
    borderRadius: 9999, // rounded-full
    paddingHorizontal: 10, // px-2.5
    paddingVertical: 2, // py-0.5
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10, // text-[10px]
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace", // font-mono
    letterSpacing: 1, // tracking-wider
  },
  iconContainer: {
    marginBottom: 8, // mb-2
    // Replicación de drop-shadow-md (Sombras para iOS y Android)
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  title: {
    fontSize: 24, // text-2xl
    fontWeight: "600", // font-semibold
    color: Colors.white,
    letterSpacing: -0.5, // tracking-tight
    textAlign: "center",
  },
  description: {
    fontSize: 12, // text-xs
    color: Colors.roseLight, // text-rose-50/90
    marginTop: 4, // mt-1
    maxWidth: 280, // max-w-xs
    textAlign: "center",
  },
});
