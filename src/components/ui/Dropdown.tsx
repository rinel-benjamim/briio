import { View, Text, StyleSheet } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { colors, typography, borderRadius, shadows } from "@/constants";
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
      <Text style={styles.label}>{label}</Text>
      <PressableOpacity style={styles.dropdown} onPress={onPress}>
        <Text style={[styles.value, !value && styles.placeholder]}>
          {value || placeholder || "Selecionar..."}
        </Text>
        <ChevronDown size={18} color={colors.textMuted} />
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
    <View style={styles.options}>
      {options.map((option) => (
        <PressableOpacity
          key={option}
          style={[
            styles.option,
            option === selected && styles.optionSelected,
          ]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[
              styles.optionText,
              option === selected && styles.optionTextSelected,
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
    height: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
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
    ...shadows.md,
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
