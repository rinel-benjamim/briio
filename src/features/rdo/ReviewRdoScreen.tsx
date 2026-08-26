import { useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CircleCheck,
  FileDown,
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

const MOCK_RDO = {
  number: "RDO #032",
  date: "12 Agosto 2026",
  projectName: "Reabilitação Pedrinhas",
  location: "Zango 1 — Icolo e Bengo",
  author: "Kiali Rodrigues",
};

type SectionItem = {
  id: string;
  name: string;
  summary: string;
  route: string;
};

const RDO_SECTIONS: SectionItem[] = [
  { id: "1", name: "Condições do dia", summary: "Manhã · Tarde · Noite", route: "weather" },
  { id: "2", name: "Mão de obra", summary: "7 trabalhadores · 8h", route: "workforce" },
  { id: "3", name: "Materiais", summary: "3 registos", route: "materials" },
  { id: "4", name: "Equipamentos", summary: "2 registos", route: "equipment" },
  { id: "5", name: "Tarefas", summary: "2 tarefas", route: "tasks" },
  { id: "6", name: "Ocorrências", summary: "2 ocorrências", route: "occurrences" },
  { id: "7", name: "Observações", summary: "Preenchido", route: "observations" },
  { id: "8", name: "Fotografias", summary: "6 fotografias", route: "photos" },
];

export default function ReviewRdoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [step] = useState(9);
  const totalSteps = 9;

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.textPrimary} />
        </PressableOpacity>
        <Text style={styles.navTitle}>Revisar RDO</Text>
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
        <View style={styles.reportIdentity}>
          <Text style={styles.reportNumber}>{MOCK_RDO.number}</Text>
          <Text style={styles.reportDate}>{MOCK_RDO.date}</Text>
          <Text style={styles.reportProject}>{MOCK_RDO.projectName}</Text>
          <Text style={styles.reportLocation}>{MOCK_RDO.location}</Text>
        </View>

        <View style={styles.overallStatus}>
          <CircleCheck size={22} color="#15803D" />
          <View style={styles.overallInfo}>
            <Text style={styles.overallTitle}>Tudo preenchido</Text>
            <Text style={styles.overallSubtitle}>
              O RDO está pronto para ser gerado.
            </Text>
          </View>
        </View>

        <Text style={styles.checklistLabel}>SECÇÕES DO RELATÓRIO</Text>

        <View style={styles.checklist}>
          {RDO_SECTIONS.map((section, index) => (
            <View key={section.id}>
              <PressableOpacity
                style={styles.checklistItem}
                onPress={() =>
                  router.push(`/(tabs)/reports/${id}/${section.route}?from=review`)
                }
              >
                <View style={styles.checklistItemLeft}>
                  <CircleCheck size={18} color="#15803D" />
                  <View style={styles.checklistItemInfo}>
                    <Text style={styles.checklistItemName}>{section.name}</Text>
                    <Text style={styles.checklistItemSummary}>
                      {section.summary}
                    </Text>
                  </View>
                </View>
                <Text style={styles.editButton}>Editar</Text>
              </PressableOpacity>
              {index < RDO_SECTIONS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <View style={styles.signatureSection}>
          <Text style={styles.signatureLabel}>ASSINATURA</Text>
          <Text style={styles.signatureRole}>
            Responsável pelo preenchimento
          </Text>
          <Text style={styles.signatureName}>{MOCK_RDO.author}</Text>
          <Text style={styles.signatureNote}>
            Assinatura física após impressão
          </Text>
        </View>

        <PressableOpacity
          style={styles.primaryButton}
          onPress={() => router.push(`/(tabs)/reports/${id}/generated`)}
        >
          <Text style={styles.primaryButtonText}>Gerar RDO</Text>
          <FileDown size={18} color="#FFFFFF" />
        </PressableOpacity>

        <Text style={styles.primaryHint}>
          O relatório será gerado em PDF.
        </Text>
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
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
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
    gap: 16,
  },
  reportIdentity: {
    gap: 4,
  },
  reportNumber: {
    ...typography.presets.heading2,
    color: colors.textPrimary,
  },
  reportDate: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  reportProject: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  reportLocation: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  overallStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  overallInfo: {
    gap: 2,
  },
  overallTitle: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: "#15803D",
  },
  overallSubtitle: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  checklistLabel: {
    ...typography.presets.overline,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  checklist: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
    overflow: "hidden",
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    paddingHorizontal: 16,
  },
  checklistItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  checklistItemInfo: {
    gap: 1,
  },
  checklistItemName: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  checklistItemSummary: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  editButton: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: "#1B3A5C",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  signatureSection: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  signatureLabel: {
    ...typography.presets.overline,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  signatureRole: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  signatureName: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  signatureNote: {
    ...typography.presets.caption,
    color: colors.textSecondary,
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
  primaryHint: {
    ...typography.presets.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
