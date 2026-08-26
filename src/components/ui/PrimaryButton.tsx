import { Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  disabled,
  loading,
}: PrimaryButtonProps) {
  return (
    <PressableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading }}
      testID={`primary-button-${label.toLowerCase().replace(/\s/g, "-")}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.textOnBrand} />
      ) : (
        <>
          <Text style={styles.label}>{label}</Text>
          {icon}
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
    backgroundColor: colors.primary,
    borderRadius: borderRadius["2xl"],
    height: 56,
    gap: 8,
  },
  label: {
    ...typography.presets.h3,
    color: colors.textOnBrand,
  },
  disabled: {
    opacity: 0.5,
  },
});
