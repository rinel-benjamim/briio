import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <PressableOpacity
        style={[styles.dropdown, isFocused && styles.dropdownFocused]}
        onPress={() => {
          setIsOpen(!isOpen);
          setIsFocused(!isOpen);
        }}
        accessibilityRole="combobox"
        accessibilityLabel={`${label}: ${value || placeholder}`}
        accessibilityState={{ expanded: isOpen }}
        testID={`select-${label.toLowerCase().replace(/\s/g, "-")}`}
      >
        <Text style={[styles.value, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color={colors.textMuted} />
      </PressableOpacity>
      {isOpen && (
        <View style={styles.options}>
          {options.map((option) => (
            <PressableOpacity
              key={option}
              style={[
                styles.option,
                value === option && styles.optionSelected,
              ]}
              onPress={() => {
                onSelect(option);
                setIsOpen(false);
                setIsFocused(false);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: value === option }}
              testID={`select-option-${option.toLowerCase().replace(/\s/g, "-")}`}
            >
              <Text
                style={[
                  styles.optionText,
                  value === option && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
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
    ...typography.presets.label,
    color: colors.textMain,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.bgSurface,
    borderRadius: borderRadius.lg,
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  value: {
    ...typography.presets.body,
    color: colors.textMain,
  },
  placeholder: {
    color: colors.textMuted,
  },
  options: {
    backgroundColor: colors.bgSurface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionSelected: {
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    ...typography.presets.body,
    color: colors.textMain,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
});
