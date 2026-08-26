import { View, StyleSheet, Text } from "react-native";
import { colors, typography } from "@/constants";
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
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  container: {
    flexDirection: "row",
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    overflow: "hidden",
  },
  option: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(148, 163, 184, 0.1)",
  },
  optionSelected: {
    backgroundColor: colors.brandPrimary,
  },
  optionText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  optionTextSelected: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
});
