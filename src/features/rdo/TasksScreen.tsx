import { useState, useCallback } from "react";
import { View, Text, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useFocusEffect } from "expo-router";
import { Plus, ChevronRight, Copy, Trash2 } from "lucide-react-native";
import { typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { RdoScreenLayout } from "@/components/ui/RdoScreenLayout";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SectionEmptyToggle } from "@/components/ui/SectionEmptyToggle";
import { useRdo } from "@/contexts/RdoContext";
import { useTaskRepository } from "@/repositories/task.repository";
import type { Task } from "@/types";

export default function TasksScreen() {
  const colors = useThemeColors();
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const { date, projectName } = useRdo();
  const taskRepo = useTaskRepository();
  const [step] = useState(5);
  const totalSteps = 9;
  const fromReview = from === "review";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      taskRepo.findByRdoId(id).then((data) => {
        setTasks(data);
        setLoading(false);
      });
    }, [id])
  );

  const STATUS_LABELS: Record<string, { label: string; color: string; bgColor: string }> = {
    in_progress: { label: "Em curso", color: colors.warning, bgColor: colors.warningBg },
    completed: { label: "Concluído", color: colors.success, bgColor: colors.successBg },
    paused: { label: "Pausado", color: colors.textMuted, bgColor: colors.bgSurface },
  };

  const handleContinue = () => {
    if (fromReview) {
      router.push(`/(tabs)/reports/${id}/review`);
    } else {
      router.push(`/(tabs)/reports/${id}/occurrences`);
    }
  };

  const removeTask = (taskId: string) => {
    Alert.alert("Remover atividade", "Tem a certeza que deseja remover?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          await taskRepo.remove(taskId);
          setTasks((prev) => prev.filter((t) => t.id !== taskId));
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
      ...typography.presets.h2,
      color: colors.textMain,
    },
    summarySubValue: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMain,
    },
    sectionLabel: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMuted,
      letterSpacing: 1,
    },
    activitiesList: {
      backgroundColor: colors.bgSurface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    activityItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 14,
      paddingHorizontal: 16,
    },
    activityItemLeft: {
      flex: 1,
    },
    activityItemInfo: {
      gap: 4,
    },
    activityItemName: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    activityItemLocation: {
      ...typography.presets.bodySmall,
      color: colors.textMuted,
    },
    activityItemRight: {
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
    activityItemQtyInfo: {
      alignItems: "flex-end",
      gap: 4,
    },
    activityItemQty: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMain,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: borderRadius.full,
    },
    statusBadgeText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bgSurface,
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
      title="Tarefas"
      progress={{ current: step, total: totalSteps }}
      onBack={() => router.back()}
      onContinue={handleContinue}
    >
      <View style={styles.context}>
        <Text style={styles.contextDate}>{date}</Text>
        <Text style={styles.contextProject}>{projectName}</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryLabel}>Atividades</Text>
          <Text style={styles.summaryValue}>{tasks.length} atividades</Text>
        </View>
        <View style={styles.summaryRight}>
          <Text style={styles.summaryLabel}>Trabalho</Text>
          <Text style={styles.summarySubValue}>registado hoje</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>ATIVIDADES REGISTADAS</Text>

      <SectionEmptyToggle rdoId={id ?? ""} section="tasks" hasData={tasks.length > 0} />

      <View style={styles.activitiesList}>
        {tasks.map((item, index) => {
          const statusInfo = STATUS_LABELS[item.status] ?? STATUS_LABELS.in_progress;
          return (
            <View key={item.id}>
              <PressableOpacity
                style={styles.activityItem}
                onPress={() => router.push(`/(tabs)/reports/${id}/edit-task?taskId=${item.id}`)}
              >
                <View style={styles.activityItemLeft}>
                  <View style={styles.activityItemInfo}>
                    <Text style={styles.activityItemName}>{item.description}</Text>
                    <Text style={styles.activityItemLocation}>{item.location ?? ""}</Text>
                  </View>
                </View>
                <View style={styles.activityItemRight}>
                  <View style={styles.activityItemQtyInfo}>
                    <Text style={styles.activityItemQty}>
                      {item.quantity != null ? `${item.quantity} ${item.unit ?? ""}` : ""}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
                      <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>
                        {statusInfo.label}
                      </Text>
                    </View>
                  </View>
                  <PressableOpacity style={styles.deleteButton} onPress={() => removeTask(item.id)}>
                    <Trash2 size={16} color="#EF4444" />
                  </PressableOpacity>
                  <ChevronRight size={16} color={colors.textMuted} />
                </View>
              </PressableOpacity>
              {index < tasks.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}
      </View>

      <PressableOpacity
        style={styles.addButton}
        onPress={() => router.push(`/(tabs)/reports/${id}/add-task`)}
      >
        <Plus size={18} color={colors.primary} />
        <Text style={styles.addButtonText}>Adicionar atividade</Text>
      </PressableOpacity>

      <PressableOpacity style={styles.reuseButton}>
        <Copy size={16} color={colors.textMuted} />
        <Text style={styles.reuseButtonText}>Usar atividades anteriores</Text>
      </PressableOpacity>
    </RdoScreenLayout>
  );
}
