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
import { useMaterialRepository } from "@/repositories/material.repository";
import type { MaterialEntry } from "@/types";

export default function MaterialsScreen() {
  const colors = useThemeColors();
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const { date, projectName } = useRdo();
  const materialRepo = useMaterialRepository();
  const [step] = useState(3);
  const totalSteps = 9;
  const fromReview = from === "review";

  const [entries, setEntries] = useState<MaterialEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    materialRepo.findByRdoId(id).then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, [id]);

  const totalItems = entries.reduce((sum, e) => sum + e.quantity, 0);

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

  if (loading) return <LoadingScreen />;

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
        <Text style={styles.contextDate}>{date}</Text>
        <Text style={styles.contextProject}>{projectName}</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryLabel}>Registos</Text>
          <Text style={styles.summaryValue}>{entries.length} registos</Text>
        </View>
        <View style={styles.summaryRight}>
          <Text style={styles.summaryLabel}>Itens totais</Text>
          <Text style={styles.summaryValue}>{totalItems} itens</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>MATERIAIS REGISTADOS</Text>

      <View style={styles.materialsList}>
        {entries.map((item, index) => (
          <View key={item.id}>
            <PressableOpacity
              style={styles.materialItem}
              onPress={() => router.push(`/(tabs)/reports/${id}/edit-material?materialId=${item.id}`)}
            >
              <View style={styles.materialItemLeft}>
                <View style={styles.materialItemInfo}>
                  <Text style={styles.materialItemName}>{item.material}</Text>
                  <Text style={styles.materialItemQty}>
                    {item.quantity} {item.unit ?? ""}
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
