import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ChevronRight, Plus, Copy } from "lucide-react-native";
import { typography, shadows } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { RdoScreenLayout } from "@/components/ui/RdoScreenLayout";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useRdo } from "@/contexts/RdoContext";
import { useEquipmentRepository } from "@/repositories/equipment.repository";
import type { EquipmentEntry } from "@/types";

export default function EquipmentScreen() {
  const colors = useThemeColors();
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const { date, projectName } = useRdo();
  const equipmentRepo = useEquipmentRepository();
  const [step] = useState(4);
  const totalSteps = 9;
  const fromReview = from === "review";

  const [entries, setEntries] = useState<EquipmentEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    equipmentRepo.findByRdoId(id).then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, [id]);

  const totalHours = entries.reduce((sum, e) => sum + e.hours_used, 0);

  const styles = useThemedStyles((colors) => ({
    context: {
      gap: 2,
    },
    contextDate: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    contextProject: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    summaryCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: colors.bgSurface,
      borderRadius: 16,
      padding: 16,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.sm,
    },
    summaryLeft: {
      gap: 4,
    },
    summaryRight: {
      alignItems: "flex-end",
      gap: 4,
    },
    summaryLabel: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    summaryValue: {
      ...typography.presets.h1,
      color: colors.primary,
    },
    sectionLabel: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMuted,
      letterSpacing: 1,
    },
    equipmentList: {
      backgroundColor: colors.bgSurface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      ...shadows.sm,
    },
    equipmentItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 14,
      paddingHorizontal: 16,
    },
    equipmentItemLeft: {
      flex: 1,
    },
    equipmentItemInfo: {
      gap: 4,
    },
    equipmentItemName: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    equipmentItemMeta: {
      ...typography.presets.bodySmall,
      color: colors.textMuted,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primaryLight,
      borderRadius: 16,
      height: 56,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    addButtonText: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.primary,
    },
    reuseButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 4,
    },
    reuseButtonText: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
  }));

  if (loading) return <LoadingScreen />;

  return (
    <RdoScreenLayout
      title="Equipamentos"
      progress={{ current: step, total: totalSteps }}
      onBack={() => router.back()}
      onContinue={() => {
        if (fromReview) {
          router.push(`/(tabs)/reports/${id}/review`);
        } else {
          router.push(`/(tabs)/reports/${id}/tasks`);
        }
      }}
    >
      <View style={styles.context}>
        <Text style={styles.contextDate}>{date}</Text>
        <Text style={styles.contextProject}>{projectName}</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryLabel}>Equipamentos</Text>
          <Text style={styles.summaryValue}>{entries.length} equipamentos</Text>
        </View>
        <View style={styles.summaryRight}>
          <Text style={styles.summaryLabel}>Horas de uso</Text>
          <Text style={styles.summaryValue}>{totalHours} h</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>EQUIPAMENTOS REGISTADOS</Text>

      <View style={styles.equipmentList}>
        {entries.map((item, index) => (
          <View key={item.id}>
            <PressableOpacity
              style={styles.equipmentItem}
              onPress={() => router.push(`/(tabs)/reports/${id}/edit-equipment?equipmentId=${item.id}`)}
            >
              <View style={styles.equipmentItemLeft}>
                <View style={styles.equipmentItemInfo}>
                  <Text style={styles.equipmentItemName}>{item.equipment}</Text>
                  <Text style={styles.equipmentItemMeta}>
                    {item.quantity} {item.quantity === 1 ? "unidade" : "unidades"} · {item.hours_used} h
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} color={colors.textMuted} />
            </PressableOpacity>
            {index < entries.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      <PressableOpacity
        style={styles.addButton}
        onPress={() => router.push(`/(tabs)/reports/${id}/add-equipment`)}
      >
        <Plus size={18} color={colors.primary} />
        <Text style={styles.addButtonText}>Adicionar equipamento</Text>
      </PressableOpacity>

      <PressableOpacity style={styles.reuseButton}>
        <Copy size={16} color={colors.textMuted} />
        <Text style={styles.reuseButtonText}>Usar equipamentos anteriores</Text>
      </PressableOpacity>
    </RdoScreenLayout>
  );
}
