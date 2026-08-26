import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ChevronRight, Plus, Copy } from "lucide-react-native";
import { colors, typography, shadows } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { RdoScreenLayout } from "@/components/ui/RdoScreenLayout";

const MOCK_CONTEXT = {
  date: "12 Agosto 2026",
  projectName: "Reabilitação Pedrinhas",
};

const MOCK_SUMMARY = {
  workers: 7,
  totalHours: 56,
};

interface WorkforceItem {
  id: string;
  role: string;
  people: number;
  hoursPerPerson: number;
  totalHours: number;
}

const MOCK_WORKFORCE: WorkforceItem[] = [
  { id: "1", role: "Mestre de Obras", people: 2, hoursPerPerson: 8, totalHours: 16 },
  { id: "2", role: "Serventes", people: 5, hoursPerPerson: 8, totalHours: 40 },
];

export default function WorkforceScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const [step] = useState(2);
  const totalSteps = 9;
  const fromReview = from === "review";

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
        <Text style={styles.contextDate}>{MOCK_CONTEXT.date}</Text>
        <Text style={styles.contextProject}>{MOCK_CONTEXT.projectName}</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryLabel}>Trabalhadores</Text>
          <Text style={styles.summaryValue}>{MOCK_SUMMARY.workers} trabalhadores</Text>
        </View>
        <View style={styles.summaryRight}>
          <Text style={styles.summaryLabel}>Horas totais</Text>
          <Text style={styles.summaryValue}>{MOCK_SUMMARY.totalHours} h</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>FUNCÇÕES</Text>

      <View style={styles.workforceList}>
        {MOCK_WORKFORCE.map((item, index) => (
          <View key={item.id}>
            <PressableOpacity
              style={styles.workItem}
              onPress={() => router.push(`/(tabs)/reports/${id}/edit-workforce?workforceId=${item.id}`)}
            >
              <View style={styles.workItemLeft}>
                <View style={styles.workItemInfo}>
                  <Text style={styles.workItemName}>{item.role}</Text>
                  <Text style={styles.workItemMeta}>
                    {item.people} pessoas · {item.hoursPerPerson} h por pessoa
                  </Text>
                </View>
              </View>
              <View style={styles.workItemRight}>
                <View style={styles.workItemTotalInfo}>
                  <Text style={styles.workItemTotal}>{item.totalHours} h</Text>
                  <Text style={styles.workItemTotalLabel}>total</Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </View>
            </PressableOpacity>
            {index < MOCK_WORKFORCE.length - 1 && <View style={styles.divider} />}
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
});
