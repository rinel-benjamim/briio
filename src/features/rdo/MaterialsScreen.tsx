import { useState } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ChevronRight, Plus, Copy } from "lucide-react-native";
import { typography, shadows } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { RdoScreenLayout } from "@/components/ui/RdoScreenLayout";

const MOCK_CONTEXT = {
  date: "12 Agosto 2026",
  projectName: "Reabilitação Pedrinhas",
};

const MOCK_SUMMARY = {
  records: 3,
  totalItems: 12,
};

interface MaterialItem {
  id: string;
  name: string;
  quantity: string;
}

const MOCK_MATERIALS: MaterialItem[] = [
  { id: "1", name: "Cimento Portland 42.5", quantity: "50 sacos" },
  { id: "2", name: "Areia média", quantity: "8 m³" },
  { id: "3", name: "Bloco de cimento", quantity: "500 un." },
];

export default function MaterialsScreen() {
  const colors = useThemeColors();
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const [step] = useState(3);
  const totalSteps = 9;
  const fromReview = from === "review";

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
    materialsList: {
      backgroundColor: colors.bgSurface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      ...shadows.sm,
    },
    materialItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 14,
      paddingHorizontal: 16,
    },
    materialItemLeft: {
      flex: 1,
    },
    materialItemInfo: {
      gap: 4,
    },
    materialItemName: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    materialItemQty: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.medium,
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

  return (
    <RdoScreenLayout
      title="Materiais"
      progress={{ current: step, total: totalSteps }}
      onBack={() => router.back()}
      onContinue={() => {
        if (fromReview) {
          router.push(`/(tabs)/reports/${id}/review`);
        } else {
          router.push(`/(tabs)/reports/${id}/equipment`);
        }
      }}
    >
      <View style={styles.context}>
        <Text style={styles.contextDate}>{MOCK_CONTEXT.date}</Text>
        <Text style={styles.contextProject}>{MOCK_CONTEXT.projectName}</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryLabel}>Registos</Text>
          <Text style={styles.summaryValue}>{MOCK_SUMMARY.records} registos</Text>
        </View>
        <View style={styles.summaryRight}>
          <Text style={styles.summaryLabel}>Itens totais</Text>
          <Text style={styles.summaryValue}>{MOCK_SUMMARY.totalItems} itens</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>MATERIAIS REGISTADOS</Text>

      <View style={styles.materialsList}>
        {MOCK_MATERIALS.map((item, index) => (
          <View key={item.id}>
            <PressableOpacity
              style={styles.materialItem}
              onPress={() => router.push(`/(tabs)/reports/${id}/edit-material?materialId=${item.id}`)}
            >
              <View style={styles.materialItemLeft}>
                <View style={styles.materialItemInfo}>
                  <Text style={styles.materialItemName}>{item.name}</Text>
                  <Text style={styles.materialItemQty}>{item.quantity}</Text>
                </View>
              </View>
              <ChevronRight size={16} color={colors.textMuted} />
            </PressableOpacity>
            {index < MOCK_MATERIALS.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      <PressableOpacity
        style={styles.addButton}
        onPress={() => router.push(`/(tabs)/reports/${id}/add-material`)}
      >
        <Plus size={18} color={colors.primary} />
        <Text style={styles.addButtonText}>Adicionar material</Text>
      </PressableOpacity>

      <PressableOpacity style={styles.reuseButton}>
        <Copy size={16} color={colors.textMuted} />
        <Text style={styles.reuseButtonText}>Usar materiais anteriores</Text>
      </PressableOpacity>
    </RdoScreenLayout>
  );
}
