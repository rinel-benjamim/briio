import { View, Text, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { colors, typography } from "@/constants";

export function AutosaveStatus() {
  return (
    <View style={styles.container}>
      <Check size={14} color={colors.success} />
      <Text style={styles.text}>Salvo automaticamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  text: {
    ...typography.presets.caption,
    color: colors.textMuted,
  },
});
