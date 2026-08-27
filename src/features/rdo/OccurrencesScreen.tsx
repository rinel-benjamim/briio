import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Plus, ChevronRight } from "lucide-react-native";
import { colors, typography } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { RdoScreenLayout } from "@/components/ui/RdoScreenLayout";

const MOCK_CONTEXT = {
  date: "12 Agosto 2026",
  projectName: "Reabilitação Pedrinhas",
};

type OccurrenceItem = {
  id: string;
  title: string;
  time: string;
  location: string;
  description: string;
};

const MOCK_OCCURRENCES: OccurrenceItem[] = [
  {
    id: "1",
    title: "Chuva intensa",
    time: "14:20",
    location: "Área externa",
    description:
      "Interrupção dos trabalhos exteriores durante aproximadamente 1 hora.",
  },
  {
    id: "2",
    title: "Atraso na entrega de material",
    time: "10:30",
    location: "Frente B",
    description:
      "A entrega do cimento prevista para a manhã ocorreu às 14h.",
  },
];

export default function OccurrencesScreen() {
  const colors = useThemeColors();
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const [step] = useState(6);
  const totalSteps = 9;
  const fromReview = from === "review";

  const handleContinue = () => {
    if (fromReview) {
      router.push(`/(tabs)/reports/${id}/review`);
    } else {
      router.push(`/(tabs)/reports/${id}/observations`);
    }
  };

  return (
    <RdoScreenLayout
      title="Ocorrências"
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
          <Text style={styles.summaryLabel}>Ocorrências</Text>
          <Text style={styles.summaryValue}>
            {MOCK_OCCURRENCES.length} ocorrências
          </Text>
        </View>
        <View style={styles.summaryRight}>
          <Text style={styles.summarySubLabel}>Registadas</Text>
          <Text style={styles.summarySubValue}>hoje</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>OCORRÊNCIAS REGISTADAS</Text>

      <View style={styles.occurrencesCard}>
        {MOCK_OCCURRENCES.map((item, index) => (
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
                {item.time} · {item.location}
              </Text>
              <Text style={styles.occurrenceDesc}>{item.description}</Text>
            </PressableOpacity>
            {index < MOCK_OCCURRENCES.length - 1 && (
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

const styles = StyleSheet.create({
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
});
