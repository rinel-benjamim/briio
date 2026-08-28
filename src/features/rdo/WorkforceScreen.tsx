import { useState, useCallback } from "react";
import { View, Text, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useFocusEffect } from "expo-router";
import { ChevronRight, Plus, Copy, Trash2 } from "lucide-react-native";
import { typography, shadows } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { RdoScreenLayout } from "@/components/ui/RdoScreenLayout";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SectionEmptyToggle } from "@/components/ui/SectionEmptyToggle";
import { useRdo } from "@/contexts/RdoContext";
import { useWorkforceRepository } from "@/repositories/workforce.repository";
import type { WorkforceEntry } from "@/types";

export default function WorkforceScreen() {
  const colors = useThemeColors();
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const { date, projectName } = useRdo();
  const workforceRepo = useWorkforceRepository();
  const [step] = useState(2);
  const totalSteps = 9;
  const fromReview = from === "review";

  const [entries, setEntries] = useState<WorkforceEntry[]>([]);
  const [workers, setWorkers] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      loadData();
    }, [id])
  );

  async function loadData() {
    if (!id) return;
    const [data, summary] = await Promise.all([
      workforceRepo.findByRdoId(id),
      workforceRepo.getSummary(id),
    ]);
    setEntries(data);
    setWorkers(summary.workers);
    setTotalHours(summary.totalHours);
    setLoading(false);
  }

  const removeEntry = (entryId: string) => {
    Alert.alert("Remover função", "Tem a certeza que deseja remover?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          await workforceRepo.remove(entryId);
          loadData();
        },
      },
    ]);
  };

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
    workforceList: {
      backgroundColor: colors.bgSurface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      ...shadows.sm,
    },
    workItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
    },
    workItemLeft: {
      flex: 1,
    },
    workItemInfo: {
      gap: 4,
    },
    workItemName: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    workItemMeta: {
      ...typography.presets.bodySmall,
      color: colors.textMuted,
    },
    workItemRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    deleteButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      justifyContent: "center",
      alignItems: "center",
    },
    workItemTotalInfo: {
      alignItems: "flex-end",
      gap: 2,
    },
    workItemTotal: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    workItemTotalLabel: {
      ...typography.presets.caption,
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
      title="Mão de obra"
      progress={{ current: step, total: totalSteps }}
      onBack={() => router.back()}
      onContinue={() => {
        if (fromReview) {
          router.push(`/(tabs)/reports/${id}/review`);
        } else {
          router.push(`/(tabs)/reports/${id}/materials`);
        }
      }}
    >
      <View style={styles.context}>
        <Text style={styles.contextDate}>{date}</Text>
        <Text style={styles.contextProject}>{projectName}</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryLabel}>Trabalhadores</Text>
          <Text style={styles.summaryValue}>{workers} trabalhadores</Text>
        </View>
        <View style={styles.summaryRight}>
          <Text style={styles.summaryLabel}>Horas totais</Text>
          <Text style={styles.summaryValue}>{totalHours} h</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>FUNCÇÕES</Text>

      <SectionEmptyToggle rdoId={id ?? ""} section="workforce" hasData={entries.length > 0} onToggle={loadData} />

      <View style={styles.workforceList}>
        {entries.map((item, index) => (
          <View key={item.id}>
            <PressableOpacity
              style={styles.workItem}
              onPress={() => router.push(`/(tabs)/reports/${id}/edit-workforce?workforceId=${item.id}`)}
            >
              <View style={styles.workItemLeft}>
                <View style={styles.workItemInfo}>
                  <Text style={styles.workItemName}>{item.function}</Text>
                  <Text style={styles.workItemMeta}>
                    {item.people_count} pessoas · {item.hours_per_person} h por pessoa
                  </Text>
                </View>
              </View>
              <View style={styles.workItemRight}>
                <View style={styles.workItemTotalInfo}>
                  <Text style={styles.workItemTotal}>{item.total_hours} h</Text>
                  <Text style={styles.workItemTotalLabel}>total</Text>
                </View>
                <PressableOpacity style={styles.deleteButton} onPress={() => removeEntry(item.id)}>
                  <Trash2 size={16} color="#EF4444" />
                </PressableOpacity>
                <ChevronRight size={16} color={colors.textMuted} />
              </View>
            </PressableOpacity>
            {index < entries.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      <PressableOpacity
        style={styles.addButton}
        onPress={() => router.push(`/(tabs)/reports/${id}/add-workforce`)}
      >
        <Plus size={18} color={colors.primary} />
        <Text style={styles.addButtonText}>Adicionar função</Text>
      </PressableOpacity>

      <PressableOpacity style={styles.reuseButton}>
        <Copy size={16} color={colors.textMuted} />
        <Text style={styles.reuseButtonText}>Usar equipe anterior</Text>
      </PressableOpacity>
    </RdoScreenLayout>
  );
}
