import { View, ScrollView, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeftCircle,
  MoreHorizontal,
  CheckCircle,
  Circle,
  ChevronRight,
  ArrowRight,
  Eye,
} from "lucide-react-native";
import { typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useRdoOverview } from "@/hooks/useRdoData";
import { useProjectRepository } from "@/repositories/project.repository";
import { useState, useEffect } from "react";
import type { Project } from "@/types";

function formatReportDate(isoDate: string): string {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const d = new Date(isoDate + "T00:00:00");
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

interface RdoSection {
  id: string;
  name: string;
  summary: string;
  completed: boolean;
}

const SECTION_ROUTES: Record<string, string> = {
  weather: "weather",
  workforce: "workforce",
  materials: "materials",
  equipment: "equipment",
  tasks: "tasks",
  occurrences: "occurrences",
  observations: "observations",
  photographs: "photos",
};

const SECTION_KEYS = ["weather", "workforce", "materials", "equipment", "tasks", "occurrences", "observations", "photographs"] as const;

const SECTION_NAMES: Record<string, string> = {
  weather: "Condições do dia",
  workforce: "Mão de obra",
  materials: "Materiais",
  equipment: "Equipamentos",
  tasks: "Tarefas",
  occurrences: "Ocorrências",
  observations: "Observações",
  photographs: "Fotografias",
};

function buildSectionSummary(key: string, counts: Record<string, number>): string {
  switch (key) {
    case "weather": {
      const c = counts.weather ?? 0;
      if (c === 0) return "Sem dados";
      const labels = ["Manhã", "Tarde", "Noite"];
      return labels.slice(0, c).join(" · ");
    }
    case "workforce": {
      const c = counts.workforce ?? 0;
      const h = counts.workforceHours ?? 0;
      return `${c} trabalhadores · ${h}h`;
    }
    case "materials": return `${counts.materials ?? 0} registos`;
    case "equipment": return `${counts.equipment ?? 0} registos`;
    case "tasks": return `${counts.tasks ?? 0} tarefas`;
    case "occurrences": return `${counts.occurrences ?? 0} ocorrências`;
    case "observations": return (counts.observations ?? 0) > 0 ? "Preenchido" : "Sem dados";
    case "photographs": return `${counts.photographs ?? 0} fotografias`;
    default: return "";
  }
}

export default function RdoOverviewScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { overview, loading } = useRdoOverview(id ?? null);
  const projectRepo = useProjectRepository();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (overview) {
      projectRepo.findById(overview.rdo.project_id).then(setProject);
    }
  }, [overview]);

  if (loading || !overview) return <LoadingScreen />;

  const { rdo, sectionStatuses, completedSections, totalSections, progressPercentage } = overview;

  const counts: Record<string, number> = {
    weather: 0,
    workforce: 0,
    workforceHours: 0,
    materials: 0,
    equipment: 0,
    tasks: 0,
    occurrences: 0,
    observations: 0,
    photographs: 0,
  };

  const sections: RdoSection[] = SECTION_KEYS.map((key) => ({
    id: key,
    name: SECTION_NAMES[key],
    summary: buildSectionSummary(key, counts),
    completed: sectionStatuses[key] === "complete",
  }));

  const getNextUnfilledSection = () => {
    for (const section of sections) {
      if (!section.completed) {
        return SECTION_ROUTES[section.id];
      }
    }
    return null;
  };

  const nextSection = getNextUnfilledSection();

  const styles = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.bgMain,
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
      color: colors.textMain,
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
      color: colors.textMuted,
    },
    projectName: {
      ...typography.presets.h3,
      color: colors.textMain,
    },
    projectLocation: {
      ...typography.presets.body,
      color: colors.textMuted,
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
      color: colors.textMain,
    },
    metaDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textMuted,
    },
    reportMetaDate: {
      ...typography.presets.bodySmall,
      color: colors.textMuted,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 9999,
      backgroundColor: colors.warningBg,
      gap: 4,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.warning,
    },
    statusText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.warning,
    },
    progressSection: {
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.xl,
      padding: 20,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    progressValue: {
      ...typography.presets.h1,
      color: colors.primary,
    },
    progressSteps: {
      ...typography.presets.bodySmall,
      color: colors.textMuted,
      textAlign: "right",
    },
    progressTrack: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    sectionsLabel: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMuted,
      letterSpacing: 1,
    },
    sectionsList: {
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.textMain,
    },
    sectionSummary: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
    },
    primaryButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
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
      color: colors.textMuted,
    },
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeftCircle size={22} color={colors.textMain} />
        </PressableOpacity>
        <Text style={styles.navTitle}>RDO de hoje</Text>
        <PressableOpacity style={styles.navButton}>
          <MoreHorizontal size={22} color={colors.textMain} />
        </PressableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.reportIdentity}>
          <Text style={styles.dateLabel}>{formatReportDate(rdo.report_date)}</Text>
          <Text style={styles.projectName}>{project?.name ?? "Sem obra"}</Text>
          <Text style={styles.projectLocation}>{project?.location ?? ""}</Text>
          <View style={styles.reportMeta}>
            <View style={styles.reportMetaLeft}>
              <Text style={styles.reportNumber}>RDO #{String(rdo.number).padStart(3, "0")}</Text>
              <View style={styles.metaDot} />
              <Text style={styles.reportMetaDate}>{formatReportDate(rdo.report_date)}</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>
                {rdo.status === "draft" ? "Em andamento" : rdo.status === "completed" ? "Concluído" : "Gerado"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressValue}>{progressPercentage}%</Text>
            <Text style={styles.progressSteps}>
              {completedSections} de {totalSections} etapas{"\n"}concluídas
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercentage}%` },
              ]}
            />
          </View>
        </View>

        <Text style={styles.sectionsLabel}>SECÇÕES DO RELATÓRIO</Text>

        <View style={styles.sectionsList}>
          {sections.map((section, index) => (
            <View key={section.id}>
              <PressableOpacity
                style={styles.sectionRow}
                onPress={() => router.push(`/(tabs)/reports/${id}/${SECTION_ROUTES[section.id]}`)}
              >
                <View style={styles.sectionLeft}>
                  {section.completed ? (
                    <CheckCircle size={20} color={colors.success} />
                  ) : (
                    <Circle size={18} color={colors.textMuted} />
                  )}
                  <View style={styles.sectionInfo}>
                    <Text style={styles.sectionName}>{section.name}</Text>
                    <Text style={styles.sectionSummary}>{section.summary}</Text>
                  </View>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </PressableOpacity>
              {index < sections.length - 1 && <View style={styles.divider} />}
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
          <Eye size={16} color={colors.textMuted} />
          <Text style={styles.secondaryButtonText}>Ver resumo</Text>
        </PressableOpacity>
      </ScrollView>
    </View>
  );
}
