import { View, Text, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { colors, typography } from "@/constants";

export function AutosaveStatus() {
  return (
    <View style={styles.autosaveStatus}>
      <Check size={14} color={colors.textTertiary} />
      <Text style={styles.autosaveText}>Salvo automaticamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  autosaveStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  autosaveText: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
});
