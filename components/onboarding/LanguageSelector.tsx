import { Colors } from "@/theme";
import { LanguageCode } from "@/types/profile";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function LanguageSelector({
  value,
  onChange,
}: {
  value: LanguageCode;
  onChange: (language: LanguageCode) => void;
}) {
  return (
    <View>
      <Text style={styles.label}>
        Selecciona tu idioma preferido / Language configuration
      </Text>
      <View style={styles.row}>
        {(
          [
            ["es", "Español"],
            ["mi", "Miskito"],
            ["ma", "Mayagna"],
          ] as const
        ).map(([code, label]) => (
          <Pressable
            key={code}
            onPress={() => onChange(code)}
            style={[
              styles.option,
              value === code &&
                (code === "es" ? styles.roseActive : styles.orangeActive),
            ]}
          >
            <Text
              style={[styles.optionText, value === code && styles.activeText]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 9,
  },
  row: { flexDirection: "row", gap: 9 },
  option: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "#FCFAF9",
  },
  roseActive: { backgroundColor: Colors.rose, borderColor: Colors.rose },
  orangeActive: { backgroundColor: Colors.orange, borderColor: Colors.orange },
  ambarActive: { backgroundColor: Colors.amber, borderColor: Colors.amber },
  optionText: { color: Colors.text, fontSize: 14, fontWeight: "600" },
  activeText: { color: Colors.white },
});
