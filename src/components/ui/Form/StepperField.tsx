import { View, StyleSheet, Text } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { colors, typography } from "@/constants";
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
      <View style={styles.stepper}>
        <PressableOpacity
          style={styles.button}
          onPress={() => onChange(Math.max(min, value - step))}
        >
          <Minus size={18} color={colors.textTertiary} />
        </PressableOpacity>
        <View style={styles.divider} />
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{value}</Text>
        </View>
        <View style={styles.divider} />
        <PressableOpacity
          style={styles.button}
          onPress={() => onChange(Math.min(max, value + step))}
        >
          <Plus size={18} color={colors.textTertiary} />
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
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  button: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(148, 163, 184, 0.12)",
  },
  valueContainer: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  valueText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  suffix: {
    ...typography.presets.caption,
    color: colors.textSecondary,
    marginRight: 14,
  },
});
