import { View, Text, StyleSheet } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { colors, typography } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface DropdownProps {
  label: string;
  value: string;
  placeholder?: string;
  onPress: () => void;
}

export function Dropdown({
  label,
  value,
  placeholder,
  onPress,
}: DropdownProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <PressableOpacity style={styles.dropdown} onPress={onPress}>
        <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
          {value || placeholder || "Selecionar..."}
        </Text>
        <ChevronDown size={18} color={colors.textTertiary} />
      </PressableOpacity>
    </View>
  );
}

interface DropdownOptionsProps {
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
}

export function DropdownOptions({
  options,
  selected,
  onSelect,
}: DropdownOptionsProps) {
  return (
    <View style={styles.dropdownOptions}>
      {options.map((option) => (
        <PressableOpacity
          key={option}
          style={[
            styles.dropdownOption,
            option === selected && styles.dropdownOptionSelected,
          ]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[
              styles.dropdownOptionText,
              option === selected && styles.dropdownOptionTextSelected,
            ]}
          >
            {option}
          </Text>
        </PressableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  fieldLabel: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  dropdownText: {
    ...typography.presets.body,
    color: colors.textPrimary,
  },
  dropdownPlaceholder: {
    color: colors.textSecondary,
  },
  dropdownOptions: {
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    overflow: "hidden",
  },
  dropdownOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148, 163, 184, 0.12)",
  },
  dropdownOptionSelected: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
  dropdownOptionText: {
    ...typography.presets.body,
    color: colors.textPrimary,
  },
  dropdownOptionTextSelected: {
    color: colors.brandPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
});
