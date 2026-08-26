import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Plus, ChevronRight, Copy } from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { RdoScreenLayout } from "@/components/ui/RdoScreenLayout";

const MOCK_CONTEXT = {
  date: "12 Agosto 2026",
  projectName: "Reabilitação Pedrinhas",
};

const MOCK_SUMMARY = {
  activities: 2,
};

interface ActivityItem {
  id: string;
  name: string;
  location: string;
  quantity: string;
  status: "em_curso" | "concluido";
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: "1", name: "Execução de alvenaria", location: "Piso 2 — Bloco A", quantity: "120 m²", status: "em_curso" },
  { id: "2", name: "Assentamento de revestimento", location: "Piso 1 — Bloco B", quantity: "85 m²", status: "concluido" },
];

const STATUS_LABELS: Record<string, { label: string; color: string; bgColor: string }> = {
  em_curso: { label: "Em curso", color: colors.warning, bgColor: colors.warningBg },
  concluido: { label: "Concluído", color: colors.success, bgColor: colors.successBg },
};

export default function TasksScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const [step] = useState(5);
  const totalSteps = 9;
  const fromReview = from === "review";

  const handleContinue = () => {
    if (fromReview) {
      router.push(`/(tabs)/reports/${id}/review`);
    } else {
      router.push(`/(tabs)/reports/${id}/occurrences`);
    }
  };

  return (
    <RdoScreenLayout
      title="Tarefas"
      progress={{ current: step, total: totalSteps }}
      onBack={() => router.back()}
      onContinue={handleContinue}
    >
      <View style={styles.context}>
        <Text style={styles.contextDate}>{MOCK_CONTEXT.date}</Text>
        <Text style={styles.contextProject}>{MOCK_CONTEXT.projectName}</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryLabel}>Atividades</Text>
          <Text style={styles.summaryValue}>{MOCK_SUMMARY.activities} atividades</Text>
        </View>
        <View style={styles.summaryRight}>
          <Text style={styles.summaryLabel}>Trabalho</Text>
          <Text style={styles.summarySubValue}>registado hoje</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>ATIVIDADES REGISTADAS</Text>

      <View style={styles.activitiesList}>
        {MOCK_ACTIVITIES.map((item, index) => (
          <View key={item.id}>
            <PressableOpacity
              style={styles.activityItem}
              onPress={() => router.push(`/(tabs)/reports/${id}/edit-task?taskId=${item.id}`)}
            >
              <View style={styles.activityItemLeft}>
                <View style={styles.activityItemInfo}>
                  <Text style={styles.activityItemName}>{item.name}</Text>
                  <Text style={styles.activityItemLocation}>{item.location}</Text>
                </View>
              </View>
              <View style={styles.activityItemRight}>
                <View style={styles.activityItemQtyInfo}>
                  <Text style={styles.activityItemQty}>{item.quantity}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: STATUS_LABELS[item.status].bgColor }]}>
                    <Text style={[styles.statusBadgeText, { color: STATUS_LABELS[item.status].color }]}>
                      {STATUS_LABELS[item.status].label}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </View>
            </PressableOpacity>
            {index < MOCK_ACTIVITIES.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
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

const styles = StyleSheet.create({
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
});
