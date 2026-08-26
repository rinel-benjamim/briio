import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Copy,
  FilePlus,
  ArrowRight,
  Info,
} from "lucide-react-native";
import { typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { useRdo } from "@/contexts/RdoContext";

const tokens = {
  bgMain: "#F4F6F4",
  bgSurface: "#FFFFFF",
  primary: "#134E32",
  primaryLight: "#E6F4EA",
  textMain: "#1A2E22",
  textMuted: "#5B6E63",
  textOnBrand: "#FFFFFF",
  border: "#E0E6E1",
  success: "#137333",
  successBg: "#E6F4EA",
  warning: "#B96A00",
  warningBg: "#FFF8F0",
  overlay: "rgba(0, 0, 0, 0.3)",
};

const MOCK_CONTEXT = {
  date: "17 Agosto 2026",
  projectName: "Reabilitação Pedrinhas",
};

const MOCK_PREVIOUS_RDO = {
  number: "RDO #032",
  date: "12 Ago 2026",
  meta: "6 fotografias · 2 ocorrências",
};

export default function NewRdoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { rdoId } = useRdo();

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={tokens.textMain} />
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
          <Text style={styles.contextDate}>{MOCK_CONTEXT.date}</Text>
          <Text style={styles.contextProject}>{MOCK_CONTEXT.projectName}</Text>
        </View>

        <View style={styles.question}>
          <Text style={styles.questionTitle}>Como deseja começar?</Text>
          <Text style={styles.questionSubtitle}>
            Escolha como pretende iniciar o relatório de hoje.
          </Text>
        </View>

        <PressableOpacity
          style={styles.optionCard}
          onPress={() => router.push(`/(tabs)/reports/reuse`)}
        >
          <View style={styles.optionHeader}>
            <View style={styles.optionIcon}>
              <Copy size={22} color={tokens.primary} />
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
                {MOCK_PREVIOUS_RDO.number}
              </Text>
              <Text style={styles.previousReportDate}>
                {MOCK_PREVIOUS_RDO.date}
              </Text>
              <Text style={styles.previousReportMeta}>
                {MOCK_PREVIOUS_RDO.meta}
              </Text>
            </View>
            <View style={styles.previousReportAction}>
              <Text style={styles.previousReportActionText}>Selecionar</Text>
              <ArrowRight size={14} color={tokens.primary} />
            </View>
          </View>
        </PressableOpacity>

        <View style={styles.spacer} />

        <PressableOpacity
          style={styles.optionCardSecondary}
          onPress={() => router.push(`/(tabs)/reports/${rdoId}`)}
        >
          <View style={styles.optionLeftSecondary}>
            <View style={styles.optionIconSecondary}>
              <FilePlus size={24} color={tokens.textMuted} />
            </View>
            <Text style={styles.optionTitle}>Começar do zero</Text>
            <Text style={styles.optionDesc}>
              Criar um novo RDO sem reutilizar dados anteriores.
            </Text>
          </View>
          <View style={styles.optionActionSecondary}>
            <Text style={styles.optionActionTextSecondary}>Criar</Text>
            <ArrowRight size={14} color={tokens.textMuted} />
          </View>
        </PressableOpacity>

        <View style={styles.spacer} />

        <View style={styles.note}>
          <Info size={18} color={tokens.textMuted} />
          <Text style={styles.noteText}>
            Os dados específicos do dia, como condições meteorológicas,
            ocorrências e fotografias, serão atualizados para o novo RDO.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.bgMain,
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
    color: tokens.textMain,
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
    color: tokens.textMain,
  },
  contextProject: {
    ...typography.presets.body,
    color: tokens.textMuted,
  },
  question: {
    gap: 4,
  },
  questionTitle: {
    ...typography.presets.h2,
    color: tokens.textMain,
  },
  questionSubtitle: {
    ...typography.presets.body,
    color: tokens.textMuted,
  },
  optionCard: {
    backgroundColor: tokens.bgSurface,
    borderRadius: borderRadius.xl,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: tokens.border,
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
    color: tokens.textMain,
  },
  optionDesc: {
    ...typography.presets.bodySmall,
    color: tokens.textMuted,
  },
  previousReport: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: tokens.bgMain,
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
    color: tokens.textMain,
  },
  previousReportDate: {
    ...typography.presets.caption,
    color: tokens.textMuted,
  },
  previousReportMeta: {
    ...typography.presets.caption,
    color: tokens.textMuted,
  },
  previousReportAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  previousReportActionText: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.semibold,
    color: tokens.primary,
  },
  spacer: {
    height: 4,
  },
  optionCardSecondary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: tokens.bgSurface,
    borderRadius: borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: tokens.border,
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
    color: tokens.textMuted,
  },
  note: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: tokens.primaryLight,
    borderRadius: borderRadius.xl,
    padding: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: tokens.border,
  },
  noteText: {
    flex: 1,
    ...typography.presets.caption,
    color: tokens.textMuted,
  },
});
