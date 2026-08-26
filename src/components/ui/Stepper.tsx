import { View, Text, StyleSheet } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { colors, typography } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export function Stepper({
  value,
  onChange,
  min = 1,
  max = 999,
  label,
}: StepperProps) {
  return (
    <View style={styles.stepper}>
      <PressableOpacity
        style={styles.stepperButton}
        onPress={() => onChange(Math.max(min, value - 1))}
      >
        <Minus size={18} color={colors.textTertiary} />
      </PressableOpacity>
      <View style={styles.stepperDivider} />
      <View style={styles.stepperValue}>
        <Text style={styles.stepperValueText}>{value}</Text>
      </View>
      <View style={styles.stepperDivider} />
      <PressableOpacity
        style={styles.stepperButton}
        onPress={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={18} color={colors.textTertiary} />
      </PressableOpacity>
      {label && <Text style={styles.stepperLabel}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  stepperButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  stepperDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(148, 163, 184, 0.12)",
  },
  stepperValue: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  stepperValueText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  stepperLabel: {
    ...typography.presets.caption,
    color: colors.textSecondary,
    marginRight: 14,
  },
});
