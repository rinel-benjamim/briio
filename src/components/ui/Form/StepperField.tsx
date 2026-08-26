import { View, StyleSheet, Text } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface StepperFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export function StepperField({
  label,
  value,
  onChange,
  min = 1,
  max = 999,
  step = 1,
  suffix,
}: StepperFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.stepper} accessibilityRole="adjustable" accessibilityLabel={`${label}: ${value}`}>
        <PressableOpacity
          style={styles.button}
          onPress={() => onChange(Math.max(min, value - step))}
          accessibilityRole="button"
          accessibilityLabel={`Diminuir ${label}`}
          testID={`stepper-decrease-${label.toLowerCase().replace(/\s/g, "-")}`}
        >
          <Minus size={18} color={colors.primary} />
        </PressableOpacity>
        <View style={styles.divider} />
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
        </View>
        <View style={styles.divider} />
        <PressableOpacity
          style={styles.button}
          onPress={() => onChange(Math.min(max, value + step))}
          accessibilityRole="button"
          accessibilityLabel={`Aumentar ${label}`}
          testID={`stepper-increase-${label.toLowerCase().replace(/\s/g, "-")}`}
        >
          <Plus size={18} color={colors.primary} />
        </PressableOpacity>
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    ...typography.presets.label,
    color: colors.textMain,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgSurface,
    borderRadius: borderRadius.lg,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    width: 50,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  valueContainer: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    ...typography.presets.h3,
    color: colors.textMain,
  },
  suffix: {
    ...typography.presets.caption,
    color: colors.textMuted,
    marginRight: 14,
  },
});
