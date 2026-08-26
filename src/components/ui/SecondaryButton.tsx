import { Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export function SecondaryButton({
  label,
  onPress,
  icon,
  disabled,
  loading,
}: SecondaryButtonProps) {
  return (
    <PressableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading }}
      testID={`secondary-button-${label.toLowerCase().replace(/\s/g, "-")}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.textMuted} />
      ) : (
        <>
          {icon}
          <Text style={styles.label}>{label}</Text>
        </>
      )}
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: borderRadius["2xl"],
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSurface,
    gap: 8,
  },
  label: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  disabled: {
    opacity: 0.5,
  },
});
