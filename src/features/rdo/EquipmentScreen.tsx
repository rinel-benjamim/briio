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
  equipmentCount: 3,
  totalHours: 25,
};

interface EquipmentItem {
  id: string;
  name: string;
  units: number;
  hours: number;
}

const MOCK_EQUIPMENT: EquipmentItem[] = [
  { id: "1", name: "Retroescavadora", units: 1, hours: 8 },
  { id: "2", name: "Betoneira", units: 2, hours: 6 },
  { id: "3", name: "Camião basculante", units: 3, hours: 7 },
];

export default function EquipmentScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const insets = useSafeAreaInsets();
  const [step] = useState(4);
  const totalSteps = 9;
  const fromReview = from === "review";

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </PressableOpacity>
        <Text style={styles.navTitle}>Equipamentos</Text>
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
            <Text style={styles.summaryLabel}>Equipamentos</Text>
            <Text style={styles.summaryValue}>{MOCK_SUMMARY.equipmentCount} equipamentos</Text>
          </View>
          <View style={styles.summaryRight}>
            <Text style={styles.summaryLabel}>Horas de uso</Text>
            <Text style={styles.summaryValue}>{MOCK_SUMMARY.totalHours} h</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>EQUIPAMENTOS REGISTADOS</Text>

        <View style={styles.equipmentList}>
          {MOCK_EQUIPMENT.map((item, index) => (
            <View key={item.id}>
              <PressableOpacity
                style={styles.equipmentItem}
                onPress={() => router.push(`/(tabs)/reports/${id}/edit-equipment?equipmentId=${item.id}`)}
              >
                <View style={styles.equipmentItemLeft}>
                  <View style={styles.equipmentItemInfo}>
                    <Text style={styles.equipmentItemName}>{item.name}</Text>
                    <Text style={styles.equipmentItemMeta}>
                      {item.units} {item.units === 1 ? "unidade" : "unidades"} · {item.hours} h
                    </Text>
                  </View>
                </View>
                <ChevronRight size={16} color={colors.textTertiary} />
              </PressableOpacity>
              {index < MOCK_EQUIPMENT.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <PressableOpacity
          style={styles.addButton}
          onPress={() => router.push(`/(tabs)/reports/${id}/add-equipment`)}
        >
          <Plus size={18} color={colors.brandPrimary} />
          <Text style={styles.addButtonText}>Adicionar equipamento</Text>
        </PressableOpacity>

        <PressableOpacity style={styles.reuseButton}>
          <Copy size={16} color={colors.textTertiary} />
          <Text style={styles.reuseButtonText}>Usar equipamentos anteriores</Text>
        </PressableOpacity>

        <PressableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (fromReview) {
              router.push(`/(tabs)/reports/${id}/review`);
            } else {
              router.push(`/(tabs)/reports/${id}/tasks`);
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
  equipmentList: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
    overflow: "hidden",
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
    color: colors.textPrimary,
  },
  equipmentItemMeta: {
    ...typography.presets.bodySmall,
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
