import { useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable, FlatList } from "react-native";
import { ChevronDown, Check, X } from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
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
      <Text style={styles.label}>OBRA ATUAL</Text>
      <PressableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <View style={styles.info}>
          <Text style={styles.name}>{selected?.name}</Text>
          {selected?.location && (
            <Text style={styles.location}>{selected.location}</Text>
          )}
        </View>
        <ChevronDown size={20} color={colors.textTertiary} />
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
                <X size={20} color={colors.textSecondary} />
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
                      <Check size={18} color={colors.brandPrimary} />
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
    gap: 6,
  },
  label: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.lg,
    padding: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  location: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surfaceCardSolid,
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
    ...typography.presets.h4,
    color: colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(148, 163, 184, 0.15)",
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
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
  optionInfo: {
    flex: 1,
    gap: 2,
  },
  optionName: {
    ...typography.presets.body,
    color: colors.textPrimary,
  },
  optionNameSelected: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.brandPrimary,
  },
  optionLocation: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
  },
});
