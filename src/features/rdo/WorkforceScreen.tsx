import { useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  ChevronRight,
  Plus,
  Copy,
  ArrowRight,
  Check,
} from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

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
  const insets = useSafeAreaInsets();
  const [step] = useState(2);
  const totalSteps = 9;
  const fromReview = from === "review";

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </PressableOpacity>
        <Text style={styles.navTitle}>Mão de obra</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>
            {step} de {totalSteps}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
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
                  <ChevronRight size={16} color={colors.textTertiary} />
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
          <Plus size={18} color={colors.brandPrimary} />
          <Text style={styles.addButtonText}>Adicionar função</Text>
        </PressableOpacity>

        <PressableOpacity style={styles.reuseButton}>
          <Copy size={16} color={colors.textTertiary} />
          <Text style={styles.reuseButtonText}>Usar equipe anterior</Text>
        </PressableOpacity>

        <PressableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (fromReview) {
              router.push(`/(tabs)/reports/${id}/review`);
            } else {
              router.push(`/(tabs)/reports/${id}/materials`);
            }
          }}
        >
          <Text style={styles.primaryButtonText}>Continuar</Text>
          <ArrowRight size={18} color={colors.textOnBrand} />
        </PressableOpacity>

        <View style={styles.autosaveStatus}>
          <Check size={14} color={colors.textTertiary} />
          <Text style={styles.autosaveText}>Salvo automaticamente</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceBg,
  },
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 12,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  navTitle: {
    flex: 1,
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: "#E5E7EB",
    gap: 4,
    borderWidth: 1,
    borderColor: "#404040",
  },
  progressText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: "#94A3B8",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 20,
  },
  context: {
    gap: 2,
  },
  contextDate: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  contextProject: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    padding: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
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
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.presets.h1,
    color: "#1B3A5C",
  },
  sectionLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  workforceList: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
    overflow: "hidden",
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
    color: colors.textPrimary,
  },
  workItemMeta: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
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
    color: colors.textPrimary,
  },
  workItemTotalLabel: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    height: 56,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  addButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: "#1B3A5C",
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
    color: colors.textSecondary,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandPrimary,
    borderRadius: borderRadius.xl,
    height: 56,
    gap: 8,
  },
  primaryButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textOnBrand,
  },
  autosaveStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  autosaveText: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
});
