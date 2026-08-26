import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Ellipsis,
  CircleCheck,
  Circle,
  ChevronRight,
  ArrowRight,
  Eye,
} from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

const MOCK_RDO = {
  date: "12 Agosto 2026",
  projectName: "Reabilitação Pedrinhas",
  location: "Zango 1 — Icolo e Bengo",
  number: "RDO #032",
  reportDate: "12 Ago 2026",
  status: "Em andamento",
  progressPercentage: 100,
  completedSteps: 9,
  totalSteps: 9,
};

interface RdoSection {
  id: string;
  name: string;
  summary: string;
  completed: boolean;
}

const RDO_SECTIONS: RdoSection[] = [
  { id: "1", name: "Condições do dia", summary: "Manhã · Tarde · Noite", completed: true },
  { id: "2", name: "Mão de obra", summary: "7 trabalhadores · 8h", completed: true },
  { id: "3", name: "Materiais", summary: "3 registos", completed: true },
  { id: "4", name: "Equipamentos", summary: "2 registos", completed: true },
  { id: "5", name: "Tarefas", summary: "2 tarefas", completed: true },
  { id: "6", name: "Ocorrências", summary: "2 ocorrências", completed: true },
  { id: "7", name: "Observações", summary: "Preenchido", completed: true },
  { id: "8", name: "Fotografias", summary: "6 fotografias", completed: true },
];

const SECTION_ROUTES: Record<string, string> = {
  "1": "weather",
  "2": "workforce",
  "3": "materials",
  "4": "equipment",
  "5": "tasks",
  "6": "occurrences",
  "7": "observations",
  "8": "photos",
};

const SECTION_ORDER = ["1", "2", "3", "4", "5", "6", "7", "8"];

export default function RdoOverviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const getNextUnfilledSection = () => {
    for (const sectionId of SECTION_ORDER) {
      const section = RDO_SECTIONS.find((s) => s.id === sectionId);
      if (section && !section.completed) {
        return SECTION_ROUTES[sectionId];
      }
    }
    return null;
  };

  const nextSection = getNextUnfilledSection();

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </PressableOpacity>
        <Text style={styles.navTitle}>RDO de hoje</Text>
        <PressableOpacity style={styles.navButton}>
          <Ellipsis size={20} color={colors.textPrimary} />
        </PressableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.reportIdentity}>
          <Text style={styles.dateLabel}>{MOCK_RDO.date}</Text>
          <Text style={styles.projectName}>{MOCK_RDO.projectName}</Text>
          <Text style={styles.projectLocation}>{MOCK_RDO.projectLocation}</Text>
          <View style={styles.reportMeta}>
            <View style={styles.reportMetaLeft}>
              <Text style={styles.reportNumber}>{MOCK_RDO.number}</Text>
              <View style={styles.metaDot} />
              <Text style={styles.reportMetaDate}>{MOCK_RDO.reportDate}</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{MOCK_RDO.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressValue}>{MOCK_RDO.progressPercentage}%</Text>
            <Text style={styles.progressSteps}>
              {MOCK_RDO.completedSteps} de {MOCK_RDO.totalSteps} etapas{"\n"}concluídas
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${MOCK_RDO.progressPercentage}%` },
              ]}
            />
          </View>
        </View>

        <Text style={styles.sectionsLabel}>SECÇÕES DO RELATÓRIO</Text>

        <View style={styles.sectionsList}>
          {RDO_SECTIONS.map((section, index) => (
            <View key={section.id}>
              <PressableOpacity
                style={styles.sectionRow}
                onPress={() => router.push(`/(tabs)/reports/${id}/${SECTION_ROUTES[section.id]}`)}
              >
                <View style={styles.sectionLeft}>
                  {section.completed ? (
                    <CircleCheck size={18} color="#15803D" />
                  ) : (
                    <Circle size={18} color={colors.textTertiary} />
                  )}
                  <View style={styles.sectionInfo}>
                    <Text style={styles.sectionName}>{section.name}</Text>
                    <Text style={styles.sectionSummary}>{section.summary}</Text>
                  </View>
                </View>
                <ChevronRight size={16} color={colors.textTertiary} />
              </PressableOpacity>
              {index < RDO_SECTIONS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <PressableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (nextSection) {
              router.push(`/(tabs)/reports/${id}/${nextSection}`);
            } else {
              router.push(`/(tabs)/reports/${id}/review`);
            }
          }}
        >
          <Text style={styles.primaryButtonText}>
            {nextSection ? "Continuar" : "Gerar Relatório"}
          </Text>
          <ArrowRight size={18} color={colors.textOnBrand} />
        </PressableOpacity>

        <PressableOpacity style={styles.secondaryButton}>
          <Eye size={16} color={colors.textSecondary} />
          <Text style={styles.secondaryButtonText}>Ver resumo</Text>
        </PressableOpacity>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 20,
  },
  reportIdentity: {
    gap: 4,
  },
  dateLabel: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  projectName: {
    ...typography.presets.h3,
    color: colors.textPrimary,
  },
  projectLocation: {
    ...typography.presets.body,
    color: colors.textSecondary,
  },
  reportMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  reportMetaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reportNumber: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textTertiary,
  },
  reportMetaDate: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: "#FEF3C7",
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#B45309",
  },
  statusText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: "#D97706",
  },
  progressSection: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.xl,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressValue: {
    ...typography.presets.h1,
    color: "#1B3A5C",
  },
  progressSteps: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
    textAlign: "right",
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.brandPrimary,
    borderRadius: 4,
  },
  sectionsLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  sectionsList: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
    overflow: "hidden",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    paddingHorizontal: 16,
  },
  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionInfo: {
    gap: 2,
  },
  sectionName: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  sectionSummary: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandPrimary,
    borderRadius: borderRadius.lg,
    height: 56,
    gap: 8,
  },
  primaryButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textOnBrand,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
});
