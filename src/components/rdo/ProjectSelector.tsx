import { useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronDown, Check, X } from "lucide-react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography, borderRadius, shadows } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

export interface ProjectOption {
  id: string;
  name: string;
  location?: string;
}

interface ProjectSelectorProps {
  projects: ProjectOption[];
  selectedId?: string;
  onSelect?: (project: ProjectOption) => void;
}

export function ProjectSelector({
  projects,
  selectedId,
  onSelect,
}: ProjectSelectorProps) {
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textMuted }]}>Obra atual</Text>
      <PressableOpacity style={[styles.button, { backgroundColor: colors.bgSurface, borderColor: colors.border }]} onPress={() => setVisible(true)}>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.textMain }]}>{selected?.name}</Text>
          {selected?.location && (
            <Text style={[styles.location, { color: colors.textMuted }]}>{selected.location}</Text>
          )}
        </View>
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
              <Text style={[styles.sheetTitle, { color: colors.textMain }]}>Selecionar obra</Text>
              <PressableOpacity
                style={[styles.closeButton, { backgroundColor: colors.bgMain }]}
                onPress={() => setVisible(false)}
              >
                <X size={20} color={colors.textMuted} />
              </PressableOpacity>
            </View>

            <FlatList
              data={projects}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = item.id === selected?.id;
                return (
                  <PressableOpacity
                    style={[
                      styles.option,
                      { borderBottomColor: colors.border },
                      isSelected && { backgroundColor: colors.primaryLight },
                    ]}
                    onPress={() => {
                      onSelect?.(item);
                      setVisible(false);
                    }}
                  >
                    <View style={styles.optionInfo}>
                      <Text
                        style={[
                          styles.optionName,
                          { color: colors.textMain },
                          isSelected && { fontWeight: typography.fontWeight.semibold, color: colors.primary },
                        ]}
                      >
                        {item.name}
                      </Text>
                      {item.location && (
                        <Text style={[styles.optionLocation, { color: colors.textMuted }]}>
                          {item.location}
                        </Text>
                      )}
                    </View>
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
  container: {
    gap: 8,
  },
  label: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: borderRadius.xl,
    padding: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    ...shadows.sm,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.presets.bodyMedium,
  },
  location: {
    ...typography.presets.caption,
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
    ...typography.presets.h2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingHorizontal: 20,
  },
  optionInfo: {
    flex: 1,
    gap: 2,
  },
  optionName: {
    ...typography.presets.body,
  },
  optionLocation: {
    ...typography.presets.caption,
  },
});
