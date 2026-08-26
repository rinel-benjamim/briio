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
  const [step] = useState(4);
  const totalSteps = 9;
  const fromReview = from === "review";

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
              <ChevronRight size={16} color={colors.textMuted} />
            </PressableOpacity>
            {index < MOCK_EQUIPMENT.length - 1 && <View style={styles.divider} />}
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
});
