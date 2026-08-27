import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Plus, ChevronRight } from "lucide-react-native";
import { typography } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { RdoScreenLayout } from "@/components/ui/RdoScreenLayout";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useRdo } from "@/contexts/RdoContext";
import { useOccurrenceRepository } from "@/repositories/occurrence.repository";
import type { Occurrence } from "@/types";

function formatTime(isoString: string | null): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function OccurrencesScreen() {
  const colors = useThemeColors();
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const { date, projectName } = useRdo();
  const occurrenceRepo = useOccurrenceRepository();
  const [step] = useState(6);
  const totalSteps = 9;
  const fromReview = from === "review";

  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    occurrenceRepo.findByRdoId(id).then((data) => {
      setOccurrences(data);
      setLoading(false);
    });
  }, [id]);

  const handleContinue = () => {
    if (fromReview) {
      router.push(`/(tabs)/reports/${id}/review`);
    } else {
      router.push(`/(tabs)/reports/${id}/observations`);
    }
  };

  const styles = useThemedStyles((colors) => ({
    context: {
      gap: 2,
    },
    contextDate: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    contextProject: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    summaryCard: {
      flexDirection: "row",
      alignItems: "center",
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
    summaryLabel: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    summaryValue: {
      ...typography.presets.h2,
      color: colors.textMain,
    },
    summaryRight: {
      alignItems: "flex-end",
      gap: 4,
    },
    summarySubLabel: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    summarySubValue: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMain,
    },
    sectionLabel: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMuted,
      letterSpacing: 1,
    },
    occurrencesCard: {
      backgroundColor: colors.bgSurface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    occurrenceItem: {
      padding: 14,
      paddingHorizontal: 16,
      gap: 6,
    },
    occurrenceTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    occurrenceTitle: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    occurrenceMeta: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    occurrenceDesc: {
      ...typography.presets.caption,
      color: colors.textMuted,
      flex: 1,
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
  }));

  if (loading) return <LoadingScreen />;

  return (
    <RdoScreenLayout
      title="Ocorrências"
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
          <Text style={styles.summaryLabel}>Ocorrências</Text>
          <Text style={styles.summaryValue}>
            {occurrences.length} ocorrências
          </Text>
        </View>
        <View style={styles.summaryRight}>
          <Text style={styles.summarySubLabel}>Registadas</Text>
          <Text style={styles.summarySubValue}>hoje</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>OCORRÊNCIAS REGISTADAS</Text>

      <View style={styles.occurrencesCard}>
        {occurrences.map((item, index) => (
          <View key={item.id}>
            <PressableOpacity
              style={styles.occurrenceItem}
              onPress={() =>
                router.push(`/(tabs)/reports/${id}/edit-occurrence?occId=${item.id}`)
              }
            >
              <View style={styles.occurrenceTop}>
                <Text style={styles.occurrenceTitle}>{item.title}</Text>
                <ChevronRight size={16} color={colors.textMuted} />
              </View>
              <Text style={styles.occurrenceMeta}>
                {formatTime(item.occurred_at)} · {item.location ?? ""}
              </Text>
              <Text style={styles.occurrenceDesc}>{item.description ?? ""}</Text>
            </PressableOpacity>
            {index < occurrences.length - 1 && (
              <View style={styles.divider} />
            )}
          </View>
        ))}
      </View>

      <PressableOpacity
        style={styles.addButton}
        onPress={() =>
          router.push(`/(tabs)/reports/${id}/add-occurrence`)
        }
      >
        <Plus size={18} color={colors.primary} />
        <Text style={styles.addButtonText}>Registar ocorrência</Text>
      </PressableOpacity>
    </RdoScreenLayout>
  );
}
