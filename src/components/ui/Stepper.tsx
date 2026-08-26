import { View, Text, StyleSheet } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography, borderRadius } from "@/constants";
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
  const colors = useThemeColors();

  const handleDecrement = () => {
    if (value > min) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(value + 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}>
      <PressableOpacity
        style={[styles.button, { backgroundColor: colors.primaryLight, borderRadius: borderRadius.lg }]}
        onPress={handleDecrement}
      >
        <Minus size={18} color={colors.primary} />
      </PressableOpacity>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: colors.textMain }]}>{value}</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <PressableOpacity
        style={[styles.button, { backgroundColor: colors.primaryLight, borderRadius: borderRadius.lg }]}
        onPress={handleIncrement}
      >
        <Plus size={18} color={colors.primary} />
      </PressableOpacity>
      {label && <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.lg,
    height: 48,
    borderWidth: 1,
  },
  button: {
    width: 50,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 28,
  },
  valueContainer: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    ...typography.presets.h3,
  },
  label: {
    ...typography.presets.caption,
    marginRight: 14,
  },
});
