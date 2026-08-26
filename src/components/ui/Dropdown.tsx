import { View, Text, StyleSheet } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography, borderRadius, shadows } from "@/constants";
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
  const colors = useThemeColors();

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.textMain }]}>{label}</Text>
      <PressableOpacity style={[styles.dropdown, { backgroundColor: colors.bgSurface, borderColor: colors.border }]} onPress={onPress}>
        <Text style={[styles.value, { color: colors.textMain }, !value && { color: colors.textMuted }]}>
          {value || placeholder || "Selecionar..."}
        </Text>
        <ChevronDown size={20} color={colors.textMuted} />
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
  const colors = useThemeColors();

  return (
    <View style={[styles.options, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}>
      {options.map((option) => (
        <PressableOpacity
          key={option}
          style={[
            styles.option,
            { borderBottomColor: colors.border },
            option === selected && { backgroundColor: colors.primaryLight },
          ]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[
              styles.optionText,
              { color: colors.textMain },
              option === selected && { color: colors.primary, fontWeight: typography.fontWeight.semibold },
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
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: borderRadius.lg,
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  value: {
    ...typography.presets.body,
  },
  options: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
    ...shadows.md,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  optionText: {
    ...typography.presets.body,
  },
});
