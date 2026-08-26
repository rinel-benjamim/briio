import { View, StyleSheet, Text } from "react-native";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface SegmentOption {
  value: string;
  label: string;
}

interface SegmentedFieldProps {
  label: string;
  value: string;
  options: SegmentOption[];
  onChange: (value: string) => void;
}

export function SegmentedField({
  label,
  value,
  options,
  onChange,
}: SegmentedFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.container} accessibilityRole="radiogroup" accessibilityLabel={label}>
        {options.map((option) => (
          <PressableOpacity
            key={option.value}
            style={[
              styles.option,
              value === option.value && styles.optionSelected,
            ]}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: value === option.value }}
            testID={`segmented-${label.toLowerCase().replace(/\s/g, "-")}-${option.value}`}
          >
            <Text
              style={[
                styles.optionText,
                value === option.value && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </PressableOpacity>
        ))}
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
  container: {
    flexDirection: "row",
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.bgMain,
    padding: 3,
    gap: 3,
  },
  option: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.md,
  },
  optionSelected: {
    backgroundColor: colors.bgSurface,
  },
  optionText: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
});
