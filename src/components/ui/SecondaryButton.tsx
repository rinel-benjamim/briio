import { Text, StyleSheet } from "react-native";
import { colors, typography } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
}

export function SecondaryButton({ label, onPress }: SecondaryButtonProps) {
  return (
    <PressableOpacity
      style={styles.secondaryButton}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={`secondary-button-${label.toLowerCase().replace(/\s/g, "-")}`}
    >
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
  },
  secondaryButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
});
