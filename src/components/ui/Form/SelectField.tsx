import { useState } from "react";
import { View, StyleSheet, Text, Modal, Pressable, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronDown, Check, X } from "lucide-react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography, borderRadius } from "@/constants";
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
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.textMain }]}>{label}</Text>
      <PressableOpacity
        style={[styles.dropdown, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}
        onPress={() => setVisible(true)}
        accessibilityRole="combobox"
        accessibilityLabel={`${label}: ${value || placeholder}`}
        testID={`select-${label.toLowerCase().replace(/\s/g, "-")}`}
      >
        <Text style={[styles.value, { color: colors.textMain }, !value && { color: colors.textMuted }]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color={colors.textMuted} />
      </PressableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={() => setVisible(false)}>
          <View style={[styles.sheet, { backgroundColor: colors.bgSurface, paddingBottom: insets.bottom + 16 }]}>
            <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.sheetTitle, { color: colors.textMain }]}>{label}</Text>
              <PressableOpacity
                style={[styles.closeButton, { backgroundColor: colors.bgMain }]}
                onPress={() => setVisible(false)}
              >
                <X size={20} color={colors.textMuted} />
              </PressableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.optionsList}
              renderItem={({ item }) => {
                const isSelected = item === value;
                return (
                  <PressableOpacity
                    style={[
                      styles.option,
                      { borderBottomColor: colors.border },
                      isSelected && { backgroundColor: colors.primaryLight },
                    ]}
                    onPress={() => {
                      onSelect(item);
                      setVisible(false);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    testID={`select-option-${item.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: colors.textMain },
                        isSelected && { color: colors.primary, fontWeight: typography.fontWeight.semibold },
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <Check size={18} color={colors.primary} />
                    )}
                  </PressableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily,
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
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  sheetTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsList: {
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    ...typography.presets.body,
  },
});
