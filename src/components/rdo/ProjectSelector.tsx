import { useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable, FlatList } from "react-native";
import { ChevronDown, Check, X } from "lucide-react-native";
import { colors, typography, borderRadius, shadows } from "@/constants";
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
  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Obra atual</Text>
      <PressableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <View style={styles.info}>
          <Text style={styles.name}>{selected?.name}</Text>
          {selected?.location && (
            <Text style={styles.location}>{selected.location}</Text>
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
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Selecionar obra</Text>
              <PressableOpacity
                style={styles.closeButton}
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
                      isSelected && styles.optionSelected,
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
                          isSelected && styles.optionNameSelected,
                        ]}
                      >
                        {item.name}
                      </Text>
                      {item.location && (
                        <Text style={styles.optionLocation}>
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
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.bgSurface,
    borderRadius: borderRadius.xl,
    padding: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.presets.bodyMedium,
    color: colors.textMain,
  },
  location: {
    ...typography.presets.caption,
    color: colors.textMuted,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.bgSurface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
    paddingBottom: 34,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 12,
  },
  sheetTitle: {
    ...typography.presets.h2,
    color: colors.textMain,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F4F6F4",
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
  optionSelected: {
    backgroundColor: colors.primaryLight,
  },
  optionInfo: {
    flex: 1,
    gap: 2,
  },
  optionName: {
    ...typography.presets.body,
    color: colors.textMain,
  },
  optionNameSelected: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
  optionLocation: {
    ...typography.presets.caption,
    color: colors.textMuted,
  },
});
