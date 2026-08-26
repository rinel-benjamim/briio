import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { colors, typography } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function SelectField({
  label,
  value,
  options,
  onSelect,
  placeholder = "Selecione uma opção",
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <PressableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(!isOpen)}
        accessibilityRole="combobox"
        accessibilityLabel={`${label}: ${value || placeholder}`}
        accessibilityState={{ expanded: isOpen }}
        testID={`select-${label.toLowerCase().replace(/\s/g, "-")}`}
      >
        <Text style={[styles.value, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={18} color={colors.textTertiary} />
      </PressableOpacity>
      {isOpen && (
        <View style={styles.options}>
          {options.map((option) => (
            <PressableOpacity
              key={option}
              style={styles.option}
              onPress={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: value === option }}
              testID={`select-option-${option.toLowerCase().replace(/\s/g, "-")}`}
            >
              <Text style={styles.optionText}>{option}</Text>
            </PressableOpacity>
          ))}
        </View>
      )}
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
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  value: {
    ...typography.presets.body,
    color: colors.textPrimary,
  },
  placeholder: {
    color: colors.textSecondary,
  },
  options: {
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    overflow: "hidden",
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148, 163, 184, 0.12)",
  },
  optionText: {
    ...typography.presets.body,
    color: colors.textPrimary,
  },
});
