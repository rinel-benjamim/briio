import { Text, StyleSheet, ActivityIndicator } from "react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography, borderRadius } from "@/constants";
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
  const colors = useThemeColors();

  return (
    <PressableOpacity
      style={[styles.button, { backgroundColor: colors.primary, shadowColor: colors.primary }, disabled && styles.disabled]}
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
          <Text style={[styles.label, { color: colors.textOnBrand }]}>{label}</Text>
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
    borderRadius: borderRadius["2xl"],
    height: 56,
    gap: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  label: {
    ...typography.presets.h3,
  },
  disabled: {
    opacity: 0.5,
  },
});
