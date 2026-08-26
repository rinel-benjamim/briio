import { useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, ChevronRight, Plus, ArrowRight, Check } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

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
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const insets = useSafeAreaInsets();
  const [step] = useState(6);
  const totalSteps = 9;
  const fromReview = from === "review";

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.textPrimary} />
        </PressableOpacity>
        <Text style={styles.navTitle}>Ocorrências</Text>
        <View style={styles.progressIndicator}>
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
          <Text style={styles.contextProject}>
            {MOCK_CONTEXT.projectName}
          </Text>
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
                  <ChevronRight size={16} color="#9CA3AF" />
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
          <Plus size={18} color={colors.brandPrimary} />
          <Text style={styles.addButtonText}>Registar ocorrência</Text>
        </PressableOpacity>

        <PressableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (fromReview) {
              router.push(`/(tabs)/reports/${id}/review`);
            } else {
              router.push(`/(tabs)/reports/${id}/observations`);
            }
          }}
        >
          <Text style={styles.primaryButtonText}>Continuar</Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </PressableOpacity>

        <View style={styles.autosaveStatus}>
          <Check size={14} color="#9CA3AF" />
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
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  progressIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: "#E5E7EB",
    borderWidth: 1,
    borderColor: "#404040",
  },
  progressText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 20,
  },
  context: {
    gap: 2,
  },
  contextDate: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  contextProject: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
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
  summaryLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.presets.heading2,
    color: colors.textPrimary,
  },
  summaryRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  summarySubLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  summarySubValue: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  sectionLabel: {
    ...typography.presets.overline,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  occurrencesCard: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
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
    color: colors.textPrimary,
  },
  occurrenceMeta: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  occurrenceDesc: {
    ...typography.presets.caption,
    color: colors.textSecondary,
    textGrowth: "fixed-width",
    width: "fill_container",
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
    color: colors.brandPrimary,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandPrimary,
    borderRadius: 16,
    height: 56,
    gap: 8,
  },
  primaryButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: "#FFFFFF",
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
