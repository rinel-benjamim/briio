import { View, Text, StyleSheet } from "react-native";
import { ShieldCheck } from "lucide-react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography } from "@/constants";

export function AutosaveStatus() {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <ShieldCheck size={17} color={colors.textMuted} />
      <Text style={[styles.text, { color: colors.textMuted }]}>Os dados ficam guardados automaticamente.</Text>
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
  },
});
