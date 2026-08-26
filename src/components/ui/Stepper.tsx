import { View, Text, StyleSheet } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
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
    <View style={styles.container}>
      <PressableOpacity
        style={styles.button}
        onPress={() => onChange(Math.max(min, value - 1))}
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
        onPress={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={18} color={colors.primary} />
      </PressableOpacity>
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgSurface,
    borderRadius: borderRadius.lg,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    width: 50,
    height: 50,
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
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    ...typography.presets.h3,
    color: colors.textMain,
  },
  label: {
    ...typography.presets.caption,
    color: colors.textMuted,
    marginRight: 14,
  },
});
