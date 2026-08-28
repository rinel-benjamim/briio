import { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeftCircle,
  Copy,
  FilePlus,
  ArrowRight,
  Info,
} from "lucide-react-native";
import { typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { useRdo } from "@/contexts/RdoContext";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useRdoRepository } from "@/repositories/rdo.repository";
import { useCreateRdo } from "@/hooks/useRdoData";

function formatReportDate(isoDate: string): string {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const d = new Date(isoDate + "T00:00:00");
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatShortDate(isoDate: string): string {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const d = new Date(isoDate + "T00:00:00");
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
}

export default function NewRdoScreen() {
  const colors = useThemeColors();
  const { projectId: urlProjectId, projectName: urlProjectName } = useLocalSearchParams<{
    projectId: string;
    projectName: string;
  }>();
  const insets = useSafeAreaInsets();
  const { rdoId, projectId: ctxProjectId, projectName: ctxProjectName, date, setRdoId, setProjectId } = useRdo();
  const rdoRepo = useRdoRepository();
  const { create: createRdo, loading: creating } = useCreateRdo();

  const projectId = urlProjectId || ctxProjectId;
  const projectName = urlProjectName || ctxProjectName;

  const [previousRdo, setPreviousRdo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!projectId) {
        setLoading(false);
        return;
      }
      try {
        const today = new Date().toISOString().split("T")[0];
        const prev = await rdoRepo.findPreviousByProject(projectId, today);
        setPreviousRdo(prev);
      } catch (e) {
        console.error("Failed to load previous RDO:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [projectId]);

  const handleStartFromScratch = useCallback(async () => {
    if (!projectId) return;
    try {
      const today = new Date().toISOString().split("T")[0];
      const rdo = await createRdo(projectId, today);
      setRdoId(rdo.id);
      setProjectId(projectId);
      router.replace(`/(tabs)/reports/${rdo.id}`);
    } catch (e) {
      console.error("Failed to create RDO:", e);
    }
  }, [projectId, createRdo, setRdoId, setProjectId]);

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
    navSpacer: {
      width: 36,
      height: 36,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 24,
      paddingTop: 20,
      gap: 20,
    },
    context: {
      gap: 2,
    },
    contextDate: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    contextProject: {
      ...typography.presets.body,
      color: colors.textMuted,
    },
    question: {
      gap: 4,
    },
    questionTitle: {
      ...typography.presets.h2,
      color: colors.textMain,
    },
    questionSubtitle: {
      ...typography.presets.body,
      color: colors.textMuted,
    },
    optionCard: {
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.xl,
      padding: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionHeader: {
      flexDirection: "row",
      gap: 12,
      alignItems: "flex-start",
    },
    optionIcon: {
      width: 22,
      height: 22,
      justifyContent: "center",
      alignItems: "center",
    },
    optionTextGroup: {
      flex: 1,
      gap: 2,
      alignItems: "flex-start",
    },
    optionTitle: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    optionDesc: {
      ...typography.presets.bodySmall,
      color: colors.textMuted,
    },
    previousReport: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.bgMain,
      borderRadius: borderRadius.md,
      padding: 10,
      paddingHorizontal: 12,
    },
    previousReportLeft: {
      gap: 1,
    },
    previousReportNumber: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    previousReportDate: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    previousReportMeta: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    previousReportAction: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    previousReportActionText: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.semibold,
      color: colors.primary,
    },
    spacer: {
      height: 4,
    },
    optionCardSecondary: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.xl,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionLeftSecondary: {
      flex: 1,
      alignItems: "flex-start",
      gap: 10,
    },
    optionIconSecondary: {
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    optionActionSecondary: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    optionActionTextSecondary: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMuted,
    },
    note: {
      flexDirection: "row",
      gap: 10,
      backgroundColor: colors.primaryLight,
      borderRadius: borderRadius.xl,
      padding: 14,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    noteText: {
      flex: 1,
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    emptyState: {
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.xl,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      gap: 8,
    },
    emptyText: {
      ...typography.presets.bodySmall,
      color: colors.textMuted,
      textAlign: "center",
    },
  }));

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeftCircle size={22} color={colors.textMain} />
        </PressableOpacity>
        <Text style={styles.navTitle}>Novo RDO</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.context}>
          <Text style={styles.contextDate}>{date || formatReportDate(new Date().toISOString().split("T")[0])}</Text>
          <Text style={styles.contextProject}>{projectName || "Obra"}</Text>
        </View>

        <View style={styles.question}>
          <Text style={styles.questionTitle}>Como deseja começar?</Text>
          <Text style={styles.questionSubtitle}>
            Escolha como pretende iniciar o relatório de hoje.
          </Text>
        </View>

        {previousRdo ? (
          <PressableOpacity
            style={styles.optionCard}
            onPress={() => router.push(`/(tabs)/reports/reuse?sourceId=${previousRdo.id}`)}
          >
            <View style={styles.optionHeader}>
              <View style={styles.optionIcon}>
                <Copy size={22} color={colors.primary} />
              </View>
              <View style={styles.optionTextGroup}>
                <Text style={styles.optionTitle}>Usar RDO anterior</Text>
                <Text style={styles.optionDesc}>
                  Comece com os dados de um relatório recente e atualize apenas o
                  que mudou.
                </Text>
              </View>
            </View>
            <View style={styles.previousReport}>
              <View style={styles.previousReportLeft}>
                <Text style={styles.previousReportNumber}>
                  RDO #{previousRdo.number}
                </Text>
                <Text style={styles.previousReportDate}>
                  {formatShortDate(previousRdo.report_date)}
                </Text>
              </View>
              <View style={styles.previousReportAction}>
                <Text style={styles.previousReportActionText}>Selecionar</Text>
                <ArrowRight size={14} color={colors.primary} />
              </View>
            </View>
          </PressableOpacity>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Não existem RDOs anteriores para esta obra.
            </Text>
            <Text style={styles.emptyText}>
              Comece um novo relatório do zero.
            </Text>
          </View>
        )}

        <View style={styles.spacer} />

        <PressableOpacity
          style={[styles.optionCardSecondary, creating && { opacity: 0.5 }]}
          onPress={handleStartFromScratch}
          disabled={creating}
        >
          <View style={styles.optionLeftSecondary}>
            <View style={styles.optionIconSecondary}>
              <FilePlus size={24} color={colors.textMuted} />
            </View>
            <Text style={styles.optionTitle}>{creating ? "Criando..." : "Começar do zero"}</Text>
            <Text style={styles.optionDesc}>
              Criar um novo RDO sem reutilizar dados anteriores.
            </Text>
          </View>
          <View style={styles.optionActionSecondary}>
            <Text style={styles.optionActionTextSecondary}>Criar</Text>
            <ArrowRight size={14} color={colors.textMuted} />
          </View>
        </PressableOpacity>

        <View style={styles.spacer} />

        <View style={styles.note}>
          <Info size={18} color={colors.textMuted} />
          <Text style={styles.noteText}>
            Os dados específicos do dia, como condições meteorológicas,
            ocorrências e fotografias, serão atualizados para o novo RDO.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
