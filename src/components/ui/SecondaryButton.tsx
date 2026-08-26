import { Text, StyleSheet } from "react-native";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
}

export function SecondaryButton({ label, onPress }: SecondaryButtonProps) {
  return (
    <PressableOpacity
      style={styles.button}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={`secondary-button-${label.toLowerCase().replace(/\s/g, "-")}`}
    >
      <Text style={styles.label}>{label}</Text>
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: borderRadius["2xl"],
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  label: {
    ...typography.presets.h3,
    color: colors.primary,
  },
});
